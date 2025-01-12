import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./app";
import { Sidebar, SidebarProvider } from "./components/ui/sidebar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event: any, message: any) => {
  console.log(message);
});
