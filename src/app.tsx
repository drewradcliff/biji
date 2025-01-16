import { SettingsIcon, ShareIcon } from "lucide-react";
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
import { db } from "./db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./components/ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export function App() {
  const { user } = db.useAuth();
  const [sentEmail, setSentEmail] = useState("");

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
        <div className="px-4">
          <h1 className="font-semibold text-xl">Project Ideas</h1>
          <h2 className="font-light text-sm text-gray-700">Jan 5, 2025</h2>
          <Editor />
        </div>
      </div>
    </>
  );
}

const signUpFormSchema = z.object({
  email: z.string().email(),
});

function SignUp({ setSentEmail }: { setSentEmail: (email: string) => void }) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = ({ email }: z.infer<typeof signUpFormSchema>) => {
    setSentEmail(email);
    db.auth.sendMagicCode({ email }).catch((_err) => {
      alert("Error sending magic code");
      setSentEmail("");
    });
  };

  return (
    <DialogContent className="max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <DialogTitle>
            <DialogHeader className="font-semibold text-xl">Login</DialogHeader>
            <DialogDescription>
              Enter email address and we will send you a verification code.
            </DialogDescription>
          </DialogTitle>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Send Code
          </Button>
          <div className="flex items-center my-2 gap-x-4">
            <div className="h-px bg-gray-200 w-full" />
            <span>or</span>
            <div className="h-px bg-gray-200 w-full" />
          </div>
        </form>
        <GoogleOAuth />
      </Form>
    </DialogContent>
  );
}

const magicCodeFormSchema = z.object({
  code: z.string().min(6, {
    message: "Code must be 6 characters",
  }),
});

function MagicCode({ sentEmail }: { sentEmail: string }) {
  const form = useForm<z.infer<typeof magicCodeFormSchema>>({
    resolver: zodResolver(magicCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = ({ code }: z.infer<typeof magicCodeFormSchema>) => {
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((_err) => {
      alert("Error sending magic code");
    });
  };

  return (
    <DialogContent className="max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <DialogTitle>
            <DialogHeader className="font-semibold text-xl">
              Enter Email Code
            </DialogHeader>
            <DialogDescription>
              Enter the 6-digit code sent to <strong>{sentEmail}</strong>
            </DialogDescription>
          </DialogTitle>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-full justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify Code
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}

function GoogleOAuth() {
  const [nonce] = useState(crypto.randomUUID());

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        nonce={nonce}
        width="400"
        onSuccess={({ credential }) => {
          db.auth.signInWithIdToken({
            clientName: import.meta.env.VITE_GOOGlE_CLIENT_NAME,
            idToken: credential!,
            nonce,
          });
        }}
      />
    </GoogleOAuthProvider>
  );
}
