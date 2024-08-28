import { useAuth } from "../contexts/AuthProvider";

export default function Chats() {
  const { logout } = useAuth();

  return (
    <>
      <h1>Chats</h1>
      <button onClick={logout}>Log out</button>
    </>
  );
}
