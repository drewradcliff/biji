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
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import { db } from "@/db";
import { useAtom } from "jotai";
import { selectedFolderAtom, selectedNoteAtom } from "@/atoms";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedFolder, setSelectedFolder] = useAtom(selectedFolderAtom);
  const [, setSelectedNote] = useAtom(selectedNoteAtom);
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

  const handleSelectFolder = (id: string) => {
    if (id === selectedFolder) return;
    setSelectedFolder(id);
    setSelectedNote("");
  };

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
                        <SidebarMenuItem key={id}>
                          <SidebarMenuButton
                            asChild
                            isActive={id === selectedFolder}
                            onClick={() => handleSelectFolder(id)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{name}</span>
                              <span>{notes.length}</span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
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
