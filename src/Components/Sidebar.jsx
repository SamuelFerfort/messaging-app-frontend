import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedFetch } from "../utils/api";
import { useState, useRef, useEffect } from "react";
import filterItems from "../utils/filterItems";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
import { truncateMessage } from "../utils/truncate";
import UserSelect from "./UserSelect";
import ActionButton from "./ActionButton";
import Loading from "./Loading";
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_NAME = import.meta.env.VITE_TOKEN_NAME;
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

Sidebar.propTypes = {
  handleChatStart: PropTypes.func,
  setActiveChat: PropTypes.func,
  activeChat: PropTypes.object,
};

export default function Sidebar({
  handleChatStart,
  setActiveChat,
  activeChat,
}) {
  const [activeTab, setActiveTabs] = useState("chats");
  const [filter, setFilter] = useState("");
  const [groupFormError, setGroupFormError] = useState({
    name: null,
    users: null,
  });
  const [notifications, setNotifications] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dialogRef = useRef(null);
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const {
    isLoading: chatsLoading,
    data: chats,
    error: chatsError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => authenticatedFetch("/api/chats"),
  });

  const {
    isLoading: usersLoading,
    data: users,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => authenticatedFetch("/api/users"),
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_NAME);

    if (!token) {
      console.error("No token found");
      
      return navigate("login");
      
    }
    socketRef.current = io(API_URL, {
      auth: { token },
    });

    socketRef.current.on("new message notification", ({ chatId, message }) => {
      if (activeChat.id === chatId) return;

      console.log(activeChat === chatId);
      setNotifications((prev) => {
        const newNotifications = {
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        };
        return newNotifications;
      });

      queryClient.setQueryData(["chats"], (oldData) => {
        if (!oldData) return oldData;
        const newData = oldData.map((chat) =>
          chat.id === chatId ? { ...chat, lastMessage: message } : chat
        );
        return newData;
      });
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected with ID:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket notification disconnected");
    });

    return () => {
      console.log("Cleaning up socket notification connection");
      socketRef.current.disconnect();
    };
  }, [queryClient, activeChat]);

  async function handleGroupChatSubmit(e) {
    e.preventDefault();

    const name = e.target.name.value;

    if (!name)
      return setGroupFormError((prev) => ({
        ...prev,
        name: "Name must not be empty",
      }));

    if (name.length > 30)
      return setGroupFormError((prev) => ({
        ...prev,
        name: "Name must not be longer than 30 characters",
      }));

    if (selectedUsers.length <= 0)
      return setGroupFormError((prev) => ({
        ...prev,
        users: "Select at least 1 other user",
      }));

    setLoading(true);
    setGroupFormError({ users: null, name: null });

    const userIds = selectedUsers.map((u) => ({ id: u.id }));

    const result = await authenticatedFetch("/api/chats/group", {
      body: {
        name,
        userIds,
      },
      method: "POST",
    });

    if (result.success) {
      queryClient.invalidateQueries(["chats"]);
      setActiveChat(result.group);
      setActiveTabs("groups");
    } else {
      setGroupFormError(result.message);
    }
    setLoading(false);
    dialogRef.current.close();
  }

  const isLoading = chatsLoading || usersLoading;
  const error = chatsError || usersError;

  if (error) return <div>Error fetching data: {error.message}</div>;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center mt-8">
          <Loading />
        </div>
      );
    }

    const items =
      activeTab === "chats" || activeTab === "groups" ? chats : users;
    const filteredItems = filterItems(items, filter, activeTab);

    const renderChatOrGroupItem = (chat) => (
      <button
        onClick={() => {
          setActiveChat(chat);
          setNotifications((prev) => ({ ...prev, [chat.id]: 0 }));
        }}
        key={chat.id}
        className={`flex items-center p-2 hover:bg-gray-100 gap-2 w-full border-b border-gray-300 ${
          activeChat?.id === chat.id ? "bg-gray-100" : ""
        }`}
      >
        <div className="relative">
          {chat.receiver[0]?.avatar ? (
            <img
              src={chat.receiver[0].avatar}
              alt={chat.name}
              className="rounded-full w-10 h-10 object-cover bg-white"
            />
          ) : (
            <AvatarIcon size={40} />
          )}
          {notifications[chat.id] > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notifications[chat.id]}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg">{chat.name} </span>
          <span className="text-xs text-gray-500 overflow-x-hidden">
            {truncateMessage(chat.lastMessage?.content, 30)}
          </span>
        </div>
      </button>
    );

    if (activeTab === "chats") {
      return (
        <div className="overflow-x-hidden">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map(renderChatOrGroupItem)
          ) : (
            <div className="p-2">No chats found!</div>
          )}
        </div>
      );
    } else if (activeTab === "users") {
      return (
        <div>
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((user) => (
              <button
                onClick={async () => {
                  await handleChatStart(user.id);
                  queryClient.invalidateQueries(["chats"]);

                  setActiveTabs("chats");
                }}
                key={user.id}
                className="flex items-center p-2 gap-2 hover:bg-gray-100 w-full border-b border-gray-200"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="rounded-full w-10 h-10 object-cover bg-white"
                  />
                ) : (
                  <AvatarIcon size={40} />
                )}{" "}
                {user.firstName + " " + user.lastName}
              </button>
            ))
          ) : (
            <div>No users found!</div>
          )}
        </div>
      );
    } else if (activeTab === "groups") {
      const groups = filteredItems.filter((chat) => chat.isGroup);
      return (
        <div className="overflow-x-hidden">
          {groups && groups.length > 0 ? (
            groups.map(renderChatOrGroupItem)
          ) : (
            <div className="p-2">No groups found!</div>
          )}
        </div>
      );
    }
  };

  return (
    <section className="p-4 ">
      <dialog
        ref={dialogRef}
        className="p-12 overflow-y-visible border border-gray-400 rounded-md"
      >
        <form
          onSubmit={handleGroupChatSubmit}
          className="flex flex-col gap-3  w-80  "
        >
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-base font-medium text-gray-700 mb-1 "
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className=" w-full border p-2 border-gray-200 rounded-md"
            />
            {groupFormError.name && (
              <span className="text-red-400 italic text-xs pt-1">
                {groupFormError.name}
              </span>
            )}
          </div>
          <UserSelect
            allUsers={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            error={groupFormError.users}
          />

          <ActionButton
            idleText={"Create group"}
            loading={loading}
            loadingText={"Creating group..."}
          />
        </form>
      </dialog>

      <div className="flex items-center px-2 pb-5 justify-between">
        <h1 className=" text-2xl font-bold">Chats</h1>
        <button
          onClick={() => dialogRef.current?.showModal()}
          className=" bg-green-500 py-1 px-5 rounded-full hover:bg-green-600 text-white"
        >
          Create Group
        </button>
      </div>
      <div className="relative w-full ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="search"
          className="w-full bg-gray-100 text-gray-500 rounded-lg h-8 pl-10 outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search..."
        />
      </div>

      <nav className="flex gap-2 py-2 px-1 ">
        <button
          onClick={() => setActiveTabs("chats")}
          className={` py-1 px-5 rounded-full ${
            activeTab === "chats"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "text-white bg-gray-500 hover:bg-gray-600"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTabs("users")}
          className={` py-1 px-5 rounded-full ${
            activeTab === "users"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "text-white bg-gray-500 hover:bg-gray-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTabs("groups")}
          className={` py-1 px-5 rounded-full ${
            activeTab === "groups"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "text-white bg-gray-500 hover:bg-gray-600"
          }`}
        >
          Groups
        </button>
      </nav>

      {renderContent()}
    </section>
  );
}
