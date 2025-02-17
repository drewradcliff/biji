import { db } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const signUpFormSchema = z.object({
  email: z.string().email(),
});

export function SignUp({
  setSentEmail,
}: {
  setSentEmail: (email: string) => void;
}) {
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
        <Button className="w-full" variant="outline">
          Continue with Google
        </Button>
      </Form>
    </DialogContent>
  );
}
