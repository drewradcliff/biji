import {
  EditorComponent,
  Remirror,
  useCommands,
  useRemirror,
  useActive,
} from "@remirror/react";
import {
  BoldExtension,
  HeadingExtension,
  ItalicExtension,
  UnderlineExtension,
} from "remirror/extensions";
import { Bold, Italic, Underline } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Editor() {
  const { manager } = useRemirror({
    extensions: () => [
      new HeadingExtension({}),
      new BoldExtension({}),
      new ItalicExtension({}),
      new UnderlineExtension({}),
    ],
    selection: "start",
  });

  return (
    <Remirror manager={manager}>
      <Toolbar />
      <EditorComponent />
    </Remirror>
  );
}

function Toolbar() {
  const { toggleBold, toggleItalic, toggleUnderline, focus } = useCommands();
  const active = useActive();

  return (
    <div className="space-x-2">
      <Button
        className={cn(active.bold() && "bg-gray-100")}
        value="bold"
        aria-label="Toggle bold"
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleBold();
          focus();
        }}
      >
        <Bold />
      </Button>
      <Button
        className={cn(active.italic() && "bg-gray-100")}
        value="italic"
        aria-label="Toggle italic"
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleItalic();
          focus();
        }}
      >
        <Italic />
      </Button>
      <Button
        className={cn(active.underline() && "bg-gray-100")}
        value="underline"
        aria-label="Toggle underline"
        variant="ghost"
        size="icon"
        onClick={() => {
          toggleUnderline();
          focus();
        }}
      >
        <Underline />
      </Button>
    </div>
  );
}
