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

const data = {
  nav: [
    {
      title: "Favorites",
      items: [
        {
          title: "daily",
          count: 3,
          isActive: true,
        },
      ],
    },
    {
      title: "Shared",
      items: [
        {
          title: "travel",
          count: 3,
          isActive: false,
        },
      ],
    },
    {
      title: "Folders",
      items: [
        {
          title: "journal",
          count: 21,
          isActive: false,
        },
        {
          title: "daily",
          count: 3,
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <div className="py-4 app-region-drag" />
      <SidebarContent>
        {data.nav.map(({ title, items }) => (
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
                  <SidebarMenu>
                    {items.map(({ title, count, isActive }) => (
                      <SidebarMenuItem key={title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <div className="flex items-center justify-between">
                            <span>{title}</span>
                            <span>{count}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
