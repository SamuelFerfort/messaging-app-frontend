import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
import Login from "./Pages/Login";



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
