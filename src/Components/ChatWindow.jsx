import PropTypes from "prop-types";

ChatWindow.propTypes = {
  activeChat: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default function ChatWindow({ activeChat, loading, error }) {
  if (loading) return <div>Loading chat...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!activeChat) return <div>Select a chat to start chatting</div>;

  return (
    <section className="bg-blue-500 max-w-full w-full"> active chat</section>
  );
}
