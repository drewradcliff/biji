import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { db } from "@/db";
import { InstaQLEntity } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";

export function PlateEditor({
  note,
}: {
  note: InstaQLEntity<AppSchema, "notes">;
}) {
  const [editorValue, setEditorValue] = useState(note.body);
  const editor = useCreateEditor(
    {
      value: note.body ? JSON.parse(note.body) : undefined,
    },
    [note.id]
  );
  const debouncedValue = useDebounce(editorValue);

  useEffect(() => {
    db.transact(db.tx.notes[note.id]!.update({ body: debouncedValue }));
    // serialize the editor value
    // editor.api.markdown.serialize();
  }, [debouncedValue]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={({ value }) => setEditorValue(JSON.stringify(value))}
      >
        <EditorContainer>
          <Editor />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
