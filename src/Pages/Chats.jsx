import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import Sidebar from "../Components/Sidebar";
import Profile from "../Components/Profile";
import { authenticatedFetch } from "../utils/api";
import ChatWindow from "../Components/ChatWindow";
import { MessageCircle, User, LogOut } from "lucide-react";
import useTitle from "../hooks/useTitle";

export default function Chats() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("chats");
  const [activeChat, setActiveChat] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(null);
  const [newChatError, setNewChatError] = useState(null);

  async function handleChatStart(otherUserId) {
    setIsChatLoading(true);
    try {
      const chat = await authenticatedFetch("/api/chats/create", {
        method: "POST",
        body: { otherUserId },
      });

      setActiveChat(chat);
    } catch (error) {
      console.error("Failed to start chat:", error);

      setNewChatError(error);
    } finally {
      setIsChatLoading(false);
    }
  }

  useTitle("Chats");

  return (
    <main className="flex h-screen justify-center items-center xl:py-5 xl:px-28  shadow-2xl">
      <div className="w-full h-full flex">
      <div className="bg-green-500 h-12 z-10"/>

        <aside className=" bg-gray-100 flex max-w-sm w-full ">
          <nav className="flex flex-col  min-w-14 items-center py-4 gap-5 border-r border-r-gray-100">
            <button
              onClick={() => setActiveTab("chats")}
              className={` p-2 rounded-full ${
                activeTab === "chats" ? "bg-gray-500 " : ""
              }`}
            >
              <MessageCircle
                className={`h-6 w-6  ${
                  activeTab === "chats" ? " text-gray-200 " : "text-gray-600"
                }`}
              />
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={` p-2 rounded-full ${
                activeTab === "profile" ? "bg-gray-500 " : ""
              }`}
            >
              <User
                className={`h-6 w-6  ${
                  activeTab === "profile" ? "text-gray-200" : "text-gray-600"
                }`}
              />
            </button>
            <button onClick={logout}>
              <LogOut className="h-6 w-6 text-gray-600" />
            </button>
          </nav>
          <aside className="flex-grow overflow-y-auto  bg-white min-w-2xl  ">
            {activeTab === "chats" && (
              <Sidebar
                handleChatStart={handleChatStart}
                setActiveChat={setActiveChat}
                activeChat={activeChat}
              />
            )}
            {activeTab === "profile" && <Profile />}
          </aside>
        </aside>
        <ChatWindow
          chat={activeChat}
          loading={isChatLoading}
          error={newChatError}
        />
      </div>
    </main>
  );
}
