import AppRoutes from "./routes/AppRoutes";
import ChatSocketManager from "./features/chat/ChatSocketManager";

function App() {
  return (
    <>
      <ChatSocketManager />
      <AppRoutes />
    </>
  );
}

export default App;
