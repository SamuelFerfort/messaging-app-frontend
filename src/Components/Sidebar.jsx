import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import filterItems from "../utils/filterItems";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
Sidebar.propTypes = {
  handleChatStart: PropTypes.func,
  setActiveChat: PropTypes.func,
};

export default function Sidebar({ handleChatStart, setActiveChat, activeChat }) {
  const [activeTab, setActiveTabs] = useState("chats");

  const [filter, setFilter] = useState("");

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
    enabled: activeTab === "users",
  });

  const isLoading = chatsLoading || usersLoading;
  const error = chatsError || usersError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const renderContent = () => {
    const items = activeTab === "chats" ? chats : users;

    const filteredItems = filterItems(items, filter, activeTab);

    console.log(filteredItems)
    if (activeTab === "chats") {
      return (
        <div>
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((chat) => (
              <button
                onClick={() => setActiveChat(chat)}
                key={chat.id}
                className="flex items-center p-2 hover:bg-gray-100 gap-2 w-full"
              >
                {chat.receiver[0].avatar ? (
                  <img
                    src={chat.receiver[0].avatar}
                    alt={chat.name}
                    className="rounded-full w-8 h-8 bg-white"
                  />
                ) : (
                  <AvatarIcon size={32}/>
                )}{" "}
                {chat.name}
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
                onClick={() => handleChatStart(user.id)}
                key={user.id}
                className="flex items-center p-2 gap-2 hover:bg-gray-100 w-full"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="rounded-full w-8 h-8 bg-white"
                  />
                ) : (
                  <AvatarIcon size={32}/>
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
    <section className="p-4">
      <h1 className="px-2 pb-5 text-xl font-bold">Chats</h1>
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
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-500 "
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTabs("users")}
          className={` py-1 px-2 rounded-full ${
            activeTab === "users"
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-500 "
          }`}
        >
          Users
        </button>
      </nav>

      {renderContent()}
    </section>
  );
}
