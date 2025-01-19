"use client";

import React from "react";

import { withRef } from "@udecode/cn";
import { type PlateEditor, ParagraphPlugin } from "@udecode/plate/react";
import { AIChatPlugin } from "@udecode/plate-ai/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { CodeBlockPlugin } from "@udecode/plate-code-block/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import {
  Code2,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrdered,
  PilcrowIcon,
  Quote,
  SparklesIcon,
  Square,
} from "lucide-react";

import { insertBlock } from "@/components/editor/transforms";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
import { PlateElement } from "./plate-element";

type Group = {
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;

  onSelect: (editor: PlateEditor, value: string) => void;

  value: string;
  className?: string;
  focusEditor?: boolean;
  keywords?: string[];
  label?: string;
}

const groups: Group[] = [
  {
    group: "AI",
    items: [
      {
        focusEditor: false,
        icon: <SparklesIcon />,
        value: "AI",
        onSelect: (editor) => {
          editor.getApi(AIChatPlugin).aiChat.show();
        },
      },
    ],
  },
  {
    group: "Basic blocks",
    items: [
      {
        icon: <PilcrowIcon />,
        keywords: ["paragraph"],
        label: "Text",
        value: ParagraphPlugin.key,
      },
      {
        icon: <Heading1Icon />,
        keywords: ["title", "h1"],
        label: "Heading 1",
        value: HEADING_KEYS.h1,
      },
      {
        icon: <Heading2Icon />,
        keywords: ["subtitle", "h2"],
        label: "Heading 2",
        value: HEADING_KEYS.h2,
      },
      {
        icon: <Heading3Icon />,
        keywords: ["subtitle", "h3"],
        label: "Heading 3",
        value: HEADING_KEYS.h3,
      },
      {
        icon: <ListIcon />,
        keywords: ["unordered", "ul", "-"],
        label: "Bulleted list",
        value: ListStyleType.Disc,
      },
      {
        icon: <ListOrdered />,
        keywords: ["ordered", "ol", "1"],
        label: "Numbered list",
        value: ListStyleType.Decimal,
      },
      {
        icon: <Square />,
        keywords: ["checklist", "task", "checkbox", "[]"],
        label: "To-do list",
        value: INDENT_LIST_KEYS.todo,
      },
      {
        icon: <Code2 />,
        keywords: ["```"],
        label: "Code Block",
        value: CodeBlockPlugin.key,
      },
      {
        icon: <Quote />,
        keywords: ["citation", "blockquote", "quote", ">"],
        label: "Blockquote",
        value: BlockquotePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
];

export const SlashInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props;

    return (
      <PlateElement
        ref={ref}
        as="span"
        className={className}
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox element={element} trigger="/">
          <InlineComboboxInput />

          <InlineComboboxContent>
            <InlineComboboxEmpty>No results</InlineComboboxEmpty>

            {groups.map(({ group, items }) => (
              <InlineComboboxGroup key={group}>
                <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

                {items.map(
                  ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                    <InlineComboboxItem
                      key={value}
                      value={value}
                      onClick={() => onSelect(editor, value)}
                      label={label}
                      focusEditor={focusEditor}
                      group={group}
                      keywords={keywords}
                    >
                      <div className="mr-2 text-muted-foreground">{icon}</div>
                      {label ?? value}
                    </InlineComboboxItem>
                  )
                )}
              </InlineComboboxGroup>
            ))}
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    );
  }
);
