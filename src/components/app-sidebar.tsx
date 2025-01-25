import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import { db } from "@/db";
import { useAtom } from "jotai";
import { selectedFolderAtom, selectedNoteAtom } from "@/atoms";
import { useState, useEffect, useRef, Ref, RefObject } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, error } = db.useQuery({
    folders: {
      notes: {},
    },
  });

  if (error) return;

  const folderTypeList = [
    {
      title: "Favorites",
      folders: data?.folders.filter(({ isFavorite }) => isFavorite),
    },
    {
      title: "Shared",
      folders: [],
    },
    {
      title: "Folders",
      folders: data?.folders,
    },
  ];

  return (
    <Sidebar {...props}>
      <div className="py-4 app-region-drag" />
      <SidebarContent>
        {folderTypeList.map(({ folders, title }) => (
          <Collapsible
            key={title}
            title={title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {!isLoading && (
                    <SidebarMenu>
                      {folders.map(({ id, name, notes }) => (
                        <SidebarInput
                          key={id}
                          id={id}
                          name={name}
                          notes={notes}
                        />
                      ))}
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarInput({
  id,
  name,
  notes,
}: {
  id: string;
  name: string;
  notes: any[];
}) {
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const [, setSelectedNote] = useAtom(selectedNoteAtom);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const showInput = editingFolderId === id;

  const handleRenameSubmit = async (id: string) => {
    if (editingName.trim()) {
      // await db.update({
      //   folders: {
      //     where: { id },
      //     data: { name: editingName.trim() },
      //   },
      // });
    }
    setEditingFolderId(null);
    setEditingName("");
  };

  const handleSelectFolder = (id: string) => {
    if (id === selectedFolder) return;
    setSelectedFolder(id);
    setSelectedNote("");
  };

  const handleRename = (id: string, currentName: string) => {
    setEditingFolderId(id);
    setEditingName(currentName);
    console.log("rename");
    // if (inputRef.current) {
    //   console.log("rename focus");
    //   inputRef.current.focus();
    // }
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showInput]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={id === selectedFolder}
            onClick={() => {
              handleSelectFolder(id);
            }}
          >
            <div className="flex items-center justify-between">
              {showInput ? (
                <input
                  ref={inputRef}
                  defaultValue="test"
                  // ref={(current) => {
                  //   console.log(id === editingFolderId);
                  //   // console.log("ref focus");
                  //   // console.log(current);
                  //   current?.focus();
                  //   current?.select();
                  // }}
                  // value={editingName}
                  // onChange={(e) => setEditingName(e.target.value)}
                  // onBlur={() => handleRenameSubmit(id)}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") handleRenameSubmit(id);
                  //   if (e.key === "Escape") {
                  //     setEditingFolderId(null);
                  //     setEditingName("");
                  //   }
                  // }}
                />
              ) : (
                <span>{name}</span>
              )}
              <span>{notes.length}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={({ currentTarget }) => {
            handleRename(id, name);
            // if (editingFolderId !== id) return;

            // const input = currentTarget.querySelector("input");
            // console.log(input);
            // input?.focus();
            // input?.select();
          }}
        >
          Rename
        </ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function Input() {
  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (inputRef.current) {
  //     console.log("input select");
  //     console.log(inputRef.current);
  //     inputRef.current.focus();
  //   }
  // }, [inputRef.current]);

  return (
    <input
      // ref={inputRef}
      // ref={(current) => {
      //   // console.log("ref focus");
      //   // console.log(current);
      //   if (!current) return;
      //   current.focus();
      //   current.select();
      // }}
      type="text"
      // value={editingName}
      defaultValue="test"
      // onChange={(e) => setEditingName(e.target.value)}
      // onBlur={() => handleRenameSubmit(id)}
      // onKeyDown={(e) => {
      //   if (e.key === "Enter") handleRenameSubmit(id);
      //   if (e.key === "Escape") {
      //     setEditingFolderId(null);
      //     setEditingName("");
      //   }
      // }}
      onFocus={(e) => {
        console.log("focus");
        e.currentTarget.select();
      }}
      // className="bg-gray-50 w-full rounded-sm"
      // autoFocus
    />
  );
}
