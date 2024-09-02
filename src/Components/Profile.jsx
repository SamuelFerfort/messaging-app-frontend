import { useAuth } from "../contexts/AuthProvider";
import AvatarIcon from "./AvatarIcon";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import { Edit2, Check } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [about, setAbout] = useState(user.about || "");
  const [isEditing, setIsEditing] = useState(false);

  async function handleAvatarSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const result = await authenticatedFetch("/api/user/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (result.success) {
      setUser({ ...user, avatar: result.user.avatar });
    }
  }

  async function handleAboutSubmit() {
    try {
      const result = await authenticatedFetch("/api/user/about-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:{ about },
      });

      if (result.success) {
        setUser({ ...user, about });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update about:", error);
    }
  }
  console.log(user)
  return (
    <section className="bg-gray-100 h-full">
      <h1 className="font-bold text-xl pl-2 h-14 p-4">Profile</h1>
      <div className="w-full">
        <div className="mx-auto w-full flex justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-48 h-48 rounded-full object-cover"
            />
          ) : (
            <AvatarIcon size={192} />
          )}
        </div>
        <form onSubmit={handleAvatarSubmit} className="p-4">
          <input
            className="text-sm mt-2"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="mt-2 bg-green-400 text-white px-4 py-2 rounded"
          >
            Change avatar
          </button>
        </form>
      </div>

      <div className="mt-5 h-15 p bg-white p-4">
        <h1 className="text-green-400">Name</h1>
        <p>{user.name}</p>
      </div>
      <div className="mt-4 bg-white p-4">
        <div className="flex flex-col">
          <label htmlFor="about" className="text-green-400 text-base mb-2">
            About
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="about"
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write something about you..."
              className="outline-none focus:border-b-green-400 focus:border-b-2 flex-grow mr-2 bg-white"
              disabled={!isEditing}
            />
            {isEditing ? (
              <Check
                size={20}
                className="text-green-400 cursor-pointer"
                onClick={handleAboutSubmit}
              />
            ) : (
              <Edit2
                size={20}
                className="text-gray-400 cursor-pointer"
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
