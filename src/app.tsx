import { AppSidebar } from "./components/app-sidebar";
import { Editor } from "./components/editor";
import { NotesList } from "./components/notes-list";

export function App() {
  return (
    <>
      <AppSidebar />
      <NotesList />
      <div className="p-6">
        <h1 className="font-semibold text-xl">Project Ideas</h1>
        <h2 className="font-light text-sm text-gray-700">Jan 5, 2025</h2>
        <Editor />
      </div>
    </>
  );
}
