import PropTypes from "prop-types";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

ChatWindow.propTypes = {
  chat: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default function ChatWindow({ chat, loading, error }) {
  const [newMessage, setNewMessage] = useState("");

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

  async function handleSendMessage() {
    if (!newMessage.trim() || !chat) return;

    try {
      await sendMessageMutation.mutateAsync({
        receiverId: chat.receiver[0].id,
        content: newMessage,
      });

      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  if (loading) return <div>Loading chat...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!chat) return <div>Select a chat to start chatting</div>;

  console.log(chat);
  return (
    <section className="bg-blue-500 max-w-full w-full flex flex-col">
      <header className="h-14 bg-gray-200 flex items-center p-3">
        👤 {chat.name}
      </header>
      <main className="flex-grow">
        {messagesLoading ? (
          <div>Loading messages...</div>
        ) : messagesError ? (
          <div>Error loading messages {messagesError.message}</div>
        ) : (
          messages.map((m) => <p key={m.id}>{m.content}</p>)
        )}
      </main>
      <footer className="h-14 bg-white flex items-center p-3">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </footer>
    </section>
  );
}
