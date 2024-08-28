import { authenticatedFetch } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

export default function Users() {
  const {
    isLoading,
    data: users,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => authenticatedFetch("/api/users"),
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users {error.message}</div>;

  return (
    <>
      <h1>Users</h1>

      <ul>
        {users.length > 0 ? (
          users.map((u) => <li key={u.id}>{u.firstName}</li>)
        ) : (
          <div>No users found</div>
        )}
      </ul>
    </>
  );
}
