import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "../utils/api";
import { useState, useRef } from "react";
import filterItems from "../utils/filterItems";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
import { truncateMessage } from "../utils/truncate";
import UserSelect from "./UserSelect";

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
  const [nameError, setNameError] = useState("");
  const dialogRef = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    isLoading: chatsLoading,
    data: chats,
    error: chatsError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => authenticatedFetch("/api/chats"),
    enabled: activeTab === "chats",
  });

  const {
    isLoading: usersLoading,
    data: users,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => authenticatedFetch("/api/users"),
  });

  async function handleGroupChatSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;

    if (!name) return setNameError("Name must not be empty");

    if (name.length > 30)
      return setNameError("Name must not be longer than 30 characters");

    setNameError("");
    const userIds = selectedUsers.map((u) => ({ id: u.id }));

    console.log("userIds", userIds);
    const result = await authenticatedFetch("/api/chats/group", {
      body: {
        name,
        userIds,
      },
      method: "POST",
    });

    if (result.success) {
      setActiveChat(result.group);
    } else {
      setNameError(result.message);
    }
  }

  const isLoading = chatsLoading || usersLoading;
  const error = chatsError || usersError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const renderContent = () => {
    const items = activeTab === "chats" ? chats : users;

    const filteredItems = filterItems(items, filter, activeTab);

    console.log(filteredItems);
    if (activeTab === "chats") {
      return (
        <div className="overflow-x-hidden">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((chat) => (
              <button
                onClick={() => setActiveChat(chat)}
                key={chat.id}
                className={`flex items-center p-2 hover:bg-gray-100 gap-2 w-full border-b border-gray-300 ${
                  activeChat?.id === chat.id ? "bg-gray-100" : ""
                }`}
              >
                {chat.receiver[0].avatar ? (
                  <div>
                    <img
                      src={chat.receiver[0].avatar}
                      alt={chat.name}
                      className="rounded-full w-10 h-10 object-cover bg-white"
                    />
                  </div>
                ) : (
                  <AvatarIcon size={40} />
                )}{" "}
                <div className="flex flex-col items-start">
                  <span className="text-lg">{chat.name} </span>
                  <span className="text-xs text-gray-500 overflow-x-hidden">
                    {truncateMessage(chat.lastMessage?.content)}
                  </span>
                </div>
              </button>
            ))
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
                onClick={() => {
                  handleChatStart(user.id);
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
    }
  };

  return (
    <section className="p-4 ">
      <dialog ref={dialogRef} className="p-8 overflow-y-visible">
        <form
          onSubmit={handleGroupChatSubmit}
          className="flex flex-col gap-3  w-80  "
        >
          <h1 className="text-xl">Create group chat</h1>
          <div className="flex flex-col">
            <label htmlFor="name" className=" text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className=" w-full border p-2 border-gray-200 rounded-md"
            />
            {nameError && (
              <span className="text-red-400 italic text-xs pt-1">
                {nameError}
              </span>
            )}
          </div>
          <UserSelect
            allUsers={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />

          <button className="bg-green-500 text-white h-10 rounded-md hover:bg-green-600">
            Submit
          </button>
        </form>
      </dialog>

      <div className="flex items-center px-2 pb-5 justify-between">
        <h1 className=" text-xl font-bold">Chats</h1>
        <button
          onClick={() => dialogRef.current?.showModal()}
          className="bg-green-100 text-green-500 py-1 px-2 rounded-full hover:bg-green-200"
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

      <nav className="flex gap-2 py-2 px-1">
        <button
          onClick={() => setActiveTabs("chats")}
          className={` py-1 px-2 rounded-full ${
            activeTab === "chats"
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTabs("users")}
          className={` py-1 px-2 rounded-full ${
            activeTab === "users"
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
        >
          Users
        </button>
      </nav>

      {renderContent()}
    </section>
  );
}
