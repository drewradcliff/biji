import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./app";
import { SidebarProvider } from "./components/ui/sidebar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SidebarProvider>
    <App />
  </SidebarProvider>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event: any, message: any) => {
  console.log(message);
});
