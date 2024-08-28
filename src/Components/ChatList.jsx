import PropTypes from "prop-types";

ChatList.propTypes = {
  users: PropTypes.array,
};

export default function ChatList({ users }) {
  return (
    <>
      <h1>Chats</h1>

      <input type="search" className="w-full " />

      <nav className="flex gap-2">
        <button>All Chats</button>
        <button>Users</button>
        <button>Groups</button>
      </nav>

      {users && users.length > 0
        ? users.map((user) => (
            <div key={user.id} className="flex items-center">
              user
            </div>
          ))
        : "No chats open!"}
    </>
  );
}
