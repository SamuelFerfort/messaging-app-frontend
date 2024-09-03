import PropTypes from "prop-types";
import formatTimestampToHHMM from "../utils/formatMessageTime";
const MessagesWindow = ({ messages, messagesLoading, messagesError, chat }) => {
 

  if (messagesLoading) return <div>Loading messages...</div>;
  if (messagesError)
    return <div>Error loading messages {messagesError.message}</div>;

  return (
    <main className="flex-grow flex flex-col px-8 py-5 overflow-y-auto chat justify-end">
      {messages.map((m) =>
        m.type === "TEXT" ? (
          <div
            className={`py-2 px-3 my-1 rounded-md chat-message flex gap-2 items-center  ${
              m.receiverId === chat.receiver[0].id
                ? "ml-auto bg-green-200 "
                : "mr-auto bg-slate-100"
            } `}
            key={m.id}
          >
            <span>{m.content}</span>
            <span className="text-xs self-end text-gray-500">
              {formatTimestampToHHMM(m.timestamp)}
            </span>
          </div>
        ) : (
          <img
            key={m.id}
            src={m.content}
            alt="message"
            className={`w-96 h-96 object-cover my-2 ${
              m.receiverId === chat.receiver[0].id
                ? "ml-auto bg-green-200 "
                : "mr-auto bg-slate-100"
            }`}
          />
        )
      )}

    </main>
  );
};

MessagesWindow.propTypes = {
  messagesLoading: PropTypes.bool,
  messagesError: PropTypes.object,
  chat: PropTypes.object,
  messages: PropTypes.array,
};

export default MessagesWindow;
