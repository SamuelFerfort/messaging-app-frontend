import PropTypes from "prop-types";
import formatTimestampToHHMM from "../utils/formatMessageTime";
import { useAuth } from "../contexts/AuthProvider";
import AvatarIcon from "./AvatarIcon";

const MessagesWindow = ({ messages, messagesLoading, messagesError, chat }) => {
  const { user } = useAuth();

  if (messagesLoading) return <div>Loading messages...</div>;
  if (messagesError)
    return <div>Error loading messages {messagesError.message}</div>;

 
  return (
    <main className="flex-grow flex flex-col px-8 py-5 overflow-y-auto chat justify-end">
      {messages.map((m) => (
        <div key={m.id} className={`flex  items-center gap-1 ${
            m.senderId === user.id
              ? "ml-auto  flex-row-reverse "
              : "mr-auto "
          }`}>
          {m.sender.avatar ? (
            <img
              src={m.sender.avatar}
              alt={m.sender.firstName}
              className="rounded-full w-8 h-8 object-cover bg-white"
            />
          ) : (
            <AvatarIcon size={32}/>
          )}

          {m.type === "TEXT" ? (
            <div
              className={`py-2 px-3 my-1 rounded-lg chat-message flex gap-2 items-center ${
                m.senderId === user.id
                  ? " bg-green-200 "
                  : " bg-slate-100"
              }  `}
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
                m.senderId === user.id
                  ? "ml-auto bg-green-200 "
                  : "mr-auto bg-slate-100"
              }`}
            />
          )}
        </div>
      ))}
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
