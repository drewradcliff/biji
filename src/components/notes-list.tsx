import { db } from "@/db";
import { ScrollArea } from "./ui/scroll-area";
import { SidebarInput, SidebarTrigger } from "./ui/sidebar";
import { EditIcon, FolderPlusIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  selectedNote: string | null;
  setSelectedNote: (id: string) => void;
  selectedFolder: string | null;
  setSelectedFolder: (id: string) => void;
};

export function NotesList({
  selectedNote,
  setSelectedNote,
  selectedFolder,
  setSelectedFolder,
}: Props) {
  const { user } = db.useAuth();
  const { data, error } = db.useQuery(
    user?.id && selectedFolder
      ? {
          $users: {
            profile: {
              folders: {
                $: {
                  where: {
                    id: selectedFolder,
                  },
                },
                notes: {},
              },
            },
          },
        }
      : null
  );

  if (error) {
    return;
  }

  const handleCreateNote = () => {
    if (!user) {
      alert("No user found");
      return;
    }

    if (!selectedFolder) {
      alert("No folder selected");
      return;
    }

    if (!data.$users[0]?.profile) {
      alert("No profile found");
      return;
    }

    const noteId = crypto.randomUUID();
    db.transact(
      db.tx.notes[noteId]!.update({
        createdAt: new Date().toISOString(),
        body: "",
      }).link({
        author: data.$users[0].profile.id,
        folder: selectedFolder,
      })
    );
    setSelectedNote(noteId);
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    if (!db.tx.notes[selectedNote]) return;
    db.transact(db.tx.notes[selectedNote].delete());
  };

  const handleCreateFolder = async () => {
    if (!user) {
      alert("No user found");
      return;
    }

    if (!data.$users[0]?.profile) {
      alert("No user profil found");
      return;
    }

    const id = crypto.randomUUID();
    await db.transact(
      db.tx.folders[id]!.update({
        name: "New Folder",
        createdAt: new Date().toISOString(),
        isShared: false,
        isFavorite: false,
      }).link({
        owner: data.$users[0]?.profile.id,
      })
    );
    setSelectedFolder(id);
  };

  return (
    <div className="w-72 border-r border-sidebar-border flex flex-col max-h-screen">
      <div className="app-region-drag pt-2 px-2 flex justify-end">
        <div className="fixed left-20 top-2 z-50 space-x-3">
          <SidebarTrigger className="app-region-no-drag" />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 app-region-no-drag"
            onClick={handleCreateFolder}
          >
            <FolderPlusIcon />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 app-region-no-drag"
            onClick={handleCreateNote}
          >
            <EditIcon />
          </Button>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 app-region-no-drag"
          onClick={handleDeleteNote}
        >
          <TrashIcon />
        </Button>
      </div>
      <div className="p-2 border-b border-sidebar-border">
        <SidebarInput placeholder="Search..." />
      </div>
      <ScrollArea>
        {data?.$users[0]?.profile?.folders[0]?.notes ? (
          data.$users[0].profile.folders[0].notes.map(
            ({ id, body, createdAt }) => (
              <div
                key={id}
                onClick={() => setSelectedNote(id)}
                className="flex flex-col gap-2 border-b last:border-none leading-tight text-sm p-2"
              >
                <div
                  className={cn([
                    selectedNote === id && "bg-gray-100",
                    "p-4 rounded-lg",
                  ])}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {body ? (
                        <span>{JSON.parse(body)[0]?.children[0]?.text}</span>
                      ) : (
                        <span>New Note</span>
                      )}
                    </span>
                    <span>
                      {Intl.DateTimeFormat().format(new Date(createdAt))}
                    </span>
                  </div>
                  {body && (
                    <span className="whitespace-break-spaces line-clamp-2">
                      <span>{JSON.parse(body)[1]?.children[0]?.text}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          )
        ) : (
          <div className="text-center italic pt-8 text-gray-400">No notes</div>
        )}
      </ScrollArea>
    </div>
  );
}
