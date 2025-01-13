import { ScrollArea } from "./ui/scroll-area";
import { SidebarInput, SidebarTrigger } from "./ui/sidebar";

const data = [
  {
    id: "1",
    title: "Meeting Notes - Q4 Planning",
    preview: "Discussed quarterly objectives",
    date: "3d",
    isSelected: true,
  },
  {
    id: "2",
    title: "Project Ideas",
    preview:
      "1. Mobile app for task management\n2. Web-based collaboration tool for teams\n3. Personal finance tracker",
    date: "24d",
  },
  {
    id: "3",
    title: "Reading List",
    preview:
      "Books to read:\n- The Pragmatic Programmer\n- Clean Code\n- Design Patterns",
    date: "6/05/24",
  },
  {
    id: "4",
    title: "Travel Plans",
    preview: "Flight options:\n1. Direct flight - $599\n2. One stop - $432",
    date: "6/05/24",
  },
  {
    id: "5",
    title: "Recipe Collection",
    preview:
      "Ingredients:\n- 2 cups flour\n- 1 cup sugar\n- 3 eggs\n- 1 tsp vanilla...",
    date: "6/05/24",
  },
  {
    id: "6",
    title: "Workout Routine",
    preview:
      "Monday:\n- Bench Press: 3x10\n- Squats: 3x12\n- Deadlifts: 3x8...",
    date: "6/05/24",
  },
  {
    id: "7",
    title: "Gift Ideas",
    preview:
      "Mom:\n- Cookbook\n- Garden tools\n- Spa day\nDad:\n- Golf clubs...",
    date: "6/05/24",
  },
  {
    id: "8",
    title: "Home Improvement",
    preview: "To-do:\n1. Paint living room\n2. Fix kitchen sink\n3. Replace...",
    date: "6/05/24",
  },
  {
    id: "9",
    title: "Journal Prompts",
    preview: "1. Write about a recent challenge you overcame.\n2. What are...",
    date: "6/05/24",
  },
  {
    id: "10",
    title: "New Music",
    preview:
      "Albums to check out:\n- Sour by Olivia Rodrigo\n- Happier Than...",
    date: "6/05/24",
  },
];

export function NotesList() {
  return (
    <div className="w-72 border-r border-sidebar-border flex flex-col max-h-screen">
      <div className="p-2 flex gap-x-2 items-center border-b border-sidebar-border">
        <SidebarTrigger />
        <SidebarInput placeholder="Search..." />
      </div>
      <ScrollArea>
        {data.map(({ id, title, preview, date }) => (
          <div
            key={id}
            className="flex flex-col gap-2 border-b p-4 leading-tight text-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{title}</span>
              <span>{date}</span>
            </div>
            <span className="whitespace-break-spaces line-clamp-2">
              {preview}
            </span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
