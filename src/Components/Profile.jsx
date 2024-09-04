import { useAuth } from "../contexts/AuthProvider";
import AvatarIcon from "./AvatarIcon";
import { authenticatedFetch } from "../utils/api";
import { useState } from "react";
import { Edit2, Check } from "lucide-react";
import useTitle from "../hooks/useTitle";
import ActionButton from "./ActionButton";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [about, setAbout] = useState(user.about || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(null);

  useTitle("Profile");

  async function handleAvatarSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const result = await authenticatedFetch("/api/user/upload-avatar", {
      method: "POST",
      body: formData,
    });
    setLoading(false);

    if (result.success) {
      refreshUser();
    }
  }

  async function handleAboutSubmit() {
    try {
      const result = await authenticatedFetch("/api/user/about-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { about },
      });

      if (result.success) {
        refreshUser();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update about:", error);
    }
  }

  return (
    <section className="bg-gray-100 h-full">
      <h1 className="font-bold text-xl h-14 p-4 bg-white mb-4 shadow-sm">
        Profile
      </h1>
      <div className="w-full">
        <div className="mx-auto w-full flex justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-48 h-48 rounded-full object-cover"
            />
          ) : (
            <AvatarIcon size={192} />
          )}
        </div>
        <form
          onSubmit={handleAvatarSubmit}
          className="mt-2 flex flex-col gap-4"
        >
          <input
            className="text-sm mt-2"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <ActionButton
            loading={loading}
            idleText={"Change Avatar"}
            loadingText={"Changing Avatar...."}
          />
        </form>
      </div>

      <div className="mt-5 h-15 p bg-white p-4 shadow-sm">
        <h1 className="text-green-400">Name</h1>
        <p>{user.name || `${user.firstName} ${user.lastName}`}</p>
      </div>
      <div className="mt-4 bg-white p-4 shadow-sm">
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
