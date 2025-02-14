import {
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  Form,
} from "./ui/form";
import { InputOTPGroup, InputOTPSlot, InputOTP } from "./ui/input-otp";
import { db } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";

const magicCodeFormSchema = z.object({
  code: z.string().min(6, {
    message: "Code must be 6 characters",
  }),
});

export function MagicCode({ sentEmail }: { sentEmail: string }) {
  const form = useForm<z.infer<typeof magicCodeFormSchema>>({
    resolver: zodResolver(magicCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async ({
    code,
  }: z.infer<typeof magicCodeFormSchema>) => {
    const { user } = await db.auth.signInWithMagicCode({
      email: sentEmail,
      code,
    });
    db.transact(
      db.tx.profiles[crypto.randomUUID()]!.update({
        createdAt: user.created_at,
      }).link({
        $user: user.id,
      })
    );
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
