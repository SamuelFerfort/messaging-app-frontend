import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { authenticatedFetch } from "../utils/api";


export default function ChatList() {
  const {
    isLoading,
    data: chats,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => authenticatedFetch("/api/chats"),
  });

  if (isLoading) return <div>Loading chats...</div>;

  if (error) return <div>Error fetching chats: {error.message}</div>;
  console.log(chats)

  return (
    <>
      <h1>Chats</h1>

      <input type="search" className="w-full " />

      <nav className="flex gap-2">
        <button>All Chats</button>
        <button>Users</button>
        <button>Groups</button>
      </nav>

      {chats && chats.length > 0
        ? chats.map((chat) => (
            <div key={chat.id} className="flex items-center">
              {chat.id}
            </div>
          ))
        : (
            <div>No chats open!</div>
        )}
    </>
  );
}

ChatList.propTypes = {
  users: PropTypes.array,
};
