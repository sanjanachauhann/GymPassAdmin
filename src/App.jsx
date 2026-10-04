import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#050505",
      }}
    >
      <Sidebar />

      <Dashboard />
    </div>
  );
}