import { EllipsisIcon, ShareIcon } from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
import { Editor } from "./components/editor";
import { NotesList } from "./components/notes-list";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

export function App() {
  return (
    <>
      <AppSidebar />
      <NotesList />
      <div className="flex-1">
        <div className="app-region-drag">
          <div className="flex justify-end items-center px-4 pt-2 gap-x-4">
            <Avatar className="size-6 app-region-no-drag cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <AvatarImage src="https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_200x200.jpg" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="p-2 flex flex-col">
                    <span className="font-semibold text-sm">Tim Cook</span>
                    <span className="text-xs font-light text-gray-500">
                      tim@apple.com
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘ ,</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Commands
                      <DropdownMenuShortcut>⌘ K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Avatar>
            <Button variant="ghost" size="icon">
              <ShareIcon className="size-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <EllipsisIcon className="size-6" />
            </Button>
          </div>
        </div>
        <div className="px-4">
          <h1 className="font-semibold text-xl">Project Ideas</h1>
          <h2 className="font-light text-sm text-gray-700">Jan 5, 2025</h2>
          <Editor />
        </div>
      </div>
    </>
  );
}
