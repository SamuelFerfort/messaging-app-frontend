import PropTypes from "prop-types";
import { authenticatedFetch } from "../utils/api";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizonal, Image as ImageIcon, X } from "lucide-react";
import AvatarIcon from "./AvatarIcon";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useTitle from "../hooks/useTitle";
import MessagesWindow from "./MessageWindow";

ChatWindow.propTypes = {
  chat: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
};

export default function ChatWindow({ chat, loading, error }) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);
    setShowEmojiPicker(false);
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

  useTitle(chat?.name || "Chat");

  const sendMessageMutation = useMutation({
    mutationFn: (messageData) =>
      authenticatedFetch(`/api/chats/${chat.id}/messages/create`, {
        method: "POST",
        body: messageData,
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
    if ((!newMessage.trim() && !selectedImage) || !chat) return;

    const formData = new FormData();
    formData.append("receiverId", chat.receiver[0].id);
    formData.append("type", selectedImage ? "IMAGE" : "TEXT");

    if (selectedImage) {
      formData.append("image", selectedImage);
    } else {
      formData.append("content", newMessage);
    }

    try {
      await sendMessageMutation.mutateAsync(formData);

      setNewMessage("");
      setSelectedImage(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setNewMessage(""); // Clear text message when image is selected
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = null; // Reset file input
  };

  if (loading) return <div>Loading chat...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!chat) return <div>Select a chat to start chatting</div>;

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
      <MessagesWindow
        messages={messages}
        messagesLoading={messagesLoading}
        messagesError={messagesError}
        chat={chat}
      />

      <footer className="h-14 bg-gray-200 flex items-center p-3">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 w-full relative"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl"
            disabled={!!selectedImage}
          >
            😊
          </button>
          <button
              type="button"
              onClick={handleImageClick}
              disabled={!!selectedImage}
            >
              <ImageIcon className="h-6 w-6 text-gray-600" />
            </button>
          <div className="relative flex-grow">
           
            <input
              type="text"
              placeholder={selectedImage ? "Send image..." : "Type a message"}
              value={selectedImage ? selectedImage.name : newMessage}
              onChange={(e) => !selectedImage && setNewMessage(e.target.value)}
              className="outline-none px-4 py-2 h-9 w-full text-gray-500 pr-10"
              readOnly={!!selectedImage}
            />
            {selectedImage && (
              <button
                type="button"
                onClick={removeSelectedImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button type="submit">
            <SendHorizonal className="h-8 w-8 text-gray-600" />
          </button>
          {showEmojiPicker && !selectedImage && (
            <div className="absolute bottom-full">
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          )}
        </form>
      </footer>
    </section>
  );
}
