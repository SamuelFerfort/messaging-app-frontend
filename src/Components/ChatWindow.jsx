import PropTypes from "prop-types";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import formatTimestampToHHMM from "../utils/formatMessageTime";
import { SendHorizonal } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

ChatWindow.propTypes = {
  chat: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default function ChatWindow({ chat, loading, error }) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };
  const queryClient = useQueryClient();

  const {
    error: messagesError,
    data: messages,
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ["messages", chat?.id],
    queryFn: () => authenticatedFetch(`/api/chats/${chat.id}/messages`),
    enabled: !!chat?.id,
  });

  console.log(chat);
  const sendMessageMutation = useMutation({
    mutationFn: (newMessage) =>
      authenticatedFetch(`/api/chats/${chat.id}/messages/create`, {
        method: "POST",
        body: newMessage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chat.id]);
      queryClient.invalidateQueries(["chats"]);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: chat.receiver[0].id,
        content: newMessage,
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  if (loading) return <div>Loading chat...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!chat) return <div>Select a chat to start chatting</div>;

  console.log(chat);
  return (
    <section className="max-w-full w-full flex flex-col">
      <header className="h-14 bg-gray-100 flex items-center p-3 gap-3">
        {chat.receiver[0].avatar ? (
          <img
            src={chat.receiver[0].avatar}
            alt={chat.receiver[0].firstName}
            className="rounded-full w-10 h-10 bg-white"
          />
        ) : (
          <AvatarIcon size={40} />
        )}{" "}
        {chat.receiver[0].firstName + " " + chat.receiver[0].lastName}
      </header>
      <main className="flex-grow flex flex-col px-8 py-5 chat">
        {messagesLoading ? (
          <div>Loading messages...</div>
        ) : messagesError ? (
          <div>Error loading messages {messagesError.message}</div>
        ) : (
          messages.map((m) => (
            <div
              className={`py-2 px-3 my-1 rounded-md chat-message flex gap-2 items-center ${
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
          ))
        )}
      </main>
      <footer className="h-14 bg-gray-200 flex items-center p-3">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 w-full relative"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl"
          >
            😊
          </button>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="outline-none px-4 py-2 h-9 w-full text-gray-500"
          />
          <button>
            <SendHorizonal className="h-8 w-8 text-gray-600" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full">
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          )}
        </form>
      </footer>
    </section>
  );
}
