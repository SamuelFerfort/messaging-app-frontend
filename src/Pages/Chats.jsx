import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import ChatSidebar from "../Components/ChatSidebar";
import Profile from "../Components/Profile";
import Settings from "../Components/Settings";

export default function Chats() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <main className="flex h-screen justify-center items-center py-5 px-28 ">
      <div className="w-full h-full flex">
        <aside className="w-full max-w-96 bg-slate-500 flex">
          <nav className="flex flex-col bg-orange-300 min-w-8 p-2 ">
            <button
              onClick={() => setActiveTab("chats")}
              className={`mr-2 ${
                activeTab === "chats" ? "text-white" : "text-black"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`mr-2 ${
                activeTab === "settings" ? "text-white" : "text-black"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`mr-2 ${
                activeTab === "profile" ? "text-white" : "text-black"
              }`}
            >
              Profile
            </button>
            <button onClick={logout}>Log out</button>
          </nav>
          <section className="flex-grow overflow-y-auto p-4">
            {activeTab === "chats" && <ChatSidebar />}
            {activeTab === "settings" && <Settings />}
            {activeTab === "profile" && <Profile />}
          </section>
        </aside>
        <section className="bg-blue-500 max-w-full w-full">
          <header></header>
          <main></main>
          <footer>
            <input type="text" className="w-full" />
          </footer>
        </section>
      </div>
    </main>
  );
}
