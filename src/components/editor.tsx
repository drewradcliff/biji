import {
  EditorComponent,
  Remirror,
  useActive,
  useChainedCommands,
  useRemirror,
} from "@remirror/react";
import {
  BoldExtension,
  HeadingExtension,
  ItalicExtension,
  UnderlineExtension,
} from "remirror/extensions";
import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

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

const toolbarItems = [
  { Icon: Bold, mark: "bold", command: "toggleBold" },
  { Icon: Italic, mark: "italic", command: "toggleItalic" },
  { Icon: Underline, mark: "underline", command: "toggleUnderline" },
] as const;

function Toolbar() {
  const active = useActive();
  const chain = useChainedCommands();

  return (
    <div className="space-x-2">
      {toolbarItems.map(({ Icon, mark, command }) => (
        <Toggle
          key={mark}
          aria-label={`Toggle ${mark}`}
          pressed={active[mark]()}
          onPressedChange={() => chain[command]().focus().run()}
        >
          <Icon className="size-4" />
        </Toggle>
      ))}
    </div>
  );
}
