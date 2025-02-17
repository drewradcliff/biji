import { CheckIcon, SettingsIcon, ShareIcon } from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
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
import { db } from "./db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { PlateEditor } from "./components/editor/plate-editor";
import { useAtom } from "jotai";
import { selectedNoteAtom } from "./atoms";
import { SignUp } from "./components/sign-up";
import { MagicCode } from "./components/magic-code";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { useExternalState } from "./hooks/useExternalState";
import { llmState } from "./state/llmState";
import { electronLlmRpc } from "./rpc/llmRpc";

export function App() {
  const { user } = db.useAuth();
  const [sentEmail, setSentEmail] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedNote] = useAtom(selectedNoteAtom);
  const { model } = useExternalState(llmState);
  const { data, isLoading } = db.useQuery({
    notes: {
      $: {
        where: {
          id: selectedNote,
        },
      },
    },
  });

  const openSelectModelFileDialog = useCallback(async () => {
    await electronLlmRpc.selectModelFileAndLoad();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ",") {
        e.preventDefault();
        setOpenSettings(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <AppSidebar />
      <NotesList />
      <div className="flex-1">
        <div className="app-region-drag">
          <div className="flex justify-end items-center px-4 pt-2 gap-x-4">
            <Button
              className="app-region-no-drag cursor-pointer"
              variant="ghost"
              size="icon"
            >
              <ShareIcon className="size-4" />
            </Button>
            {user ? (
              <Avatar className="size-6 app-region-no-drag cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <AvatarImage src="https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_200x200.jpg" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="p-2 flex flex-col">
                      <span className="text-xs font-light text-gray-500">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Dialog>
                        <DropdownMenuItem onClick={() => setOpenSettings(true)}>
                          Settings
                          <DropdownMenuShortcut>⌘ ,</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Settings</DialogTitle>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuItem>
                        Commands
                        <DropdownMenuShortcut>⌘ K</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        db.auth.signOut();
                        setSentEmail("");
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Avatar>
            ) : (
              <>
                <Button
                  className="app-region-no-drag cursor-pointer"
                  variant="ghost"
                  size="icon"
                >
                  <SettingsIcon className="size-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="app-region-no-drag cursor-pointer"
                      variant="ghost"
                      size="sm"
                    >
                      Sign up
                    </Button>
                  </DialogTrigger>
                  {!sentEmail ? (
                    <SignUp setSentEmail={setSentEmail} />
                  ) : (
                    <MagicCode sentEmail={sentEmail} />
                  )}
                </Dialog>
              </>
            )}
          </div>
        </div>
        <div className="px-4 w-full" data-registry="plate">
          {!isLoading && data?.notes[0] && (
            <>
              <h2 className="font-light text-sm text-gray-700">
                {Intl.DateTimeFormat().format(
                  new Date(data.notes[0].createdAt)
                )}
              </h2>
              <PlateEditor note={data.notes[0]} />
            </>
          )}
        </div>
      </div>
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="model-path">Local Model</Label>
                <div className="relative">
                  <Input
                    id="model-path"
                    placeholder="/models/model.gguf"
                    className="w-full"
                    defaultValue={model.name}
                    onClick={openSelectModelFileDialog}
                    disabled={openSelectModelFileDialog == null}
                  />
                  {model.loadProgress && model.loadProgress < 1 ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600">
                        {model.loadProgress}
                      </div>
                    </div>
                  ) : model.loadProgress === 1 ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
