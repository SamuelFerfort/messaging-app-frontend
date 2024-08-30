import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import filterItems from "../utils/filterItems";
import PropTypes from "prop-types";

ChatSidebar.propTypes = {
  handleChatStart: PropTypes.func,
};

export default function ChatSidebar({ handleChatStart }) {
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

    if (activeTab === "chats") {
      return (
        <div>
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center p-2 hover:bg-gray-100"
              >
                👤 {chat.name || `Chat ${chat.id}`}
              </div>
            ))
          ) : (
            <div>No chats found!</div>
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
                className="flex items-center p-2 hover:bg-gray-100"
              >
                👤 {user.firstName} {user.lastName}
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
    <>
      <h1>Chats</h1>

      <input
        type="search"
        className="w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <nav className="flex gap-2">
        <button onClick={() => setActiveTabs("chats")}>Chats</button>
        <button onClick={() => setActiveTabs("users")}>Users</button>
      </nav>

      {renderContent()}
    </>
  );
}
