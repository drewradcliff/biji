import { db } from "@/db";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarInput, SidebarTrigger } from "./ui/sidebar";

export function NotesList() {
  const { isLoading, error, data } = db.useQuery({ notes: {} });

  if (isLoading) return;
  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }

  return (
    <div className="w-72 border-r border-sidebar-border flex flex-col max-h-screen">
      <div className="p-2 flex gap-x-2 items-center border-b border-sidebar-border">
        <SidebarTrigger />
        <SidebarInput placeholder="Search..." />
      </div>
      <ScrollArea>
        {data.notes.map(({ id, title, body, createdAt }) => (
          <div
            key={id}
            className="flex flex-col gap-2 border-b p-4 leading-tight text-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{title}</span>
              <span>{createdAt}</span>
            </div>
            <span className="whitespace-break-spaces line-clamp-2">{body}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
