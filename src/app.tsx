import { AppSidebar } from "./components/app-sidebar";
import { NotesList } from "./components/notes-list";
import { SidebarTrigger } from "./components/ui/sidebar";

export function App() {
  return (
    <>
      <AppSidebar />
      <NotesList />
    </>
  );
}
