import emojiMartData from "@emoji-mart/data";
import { withProps } from "@udecode/cn";
import {
  usePlateEditor,
  ParagraphPlugin,
  PlateElement,
  PlateLeaf,
  type CreatePlateEditorOptions,
} from "@udecode/plate/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import {
  ListPlugin,
  BulletedListPlugin,
  NumberedListPlugin,
  ListItemPlugin,
  TodoListPlugin,
} from "@udecode/plate-list/react";
import { ImagePlugin, MediaEmbedPlugin } from "@udecode/plate-media/react";
import { CaptionPlugin } from "@udecode/plate-caption/react";
import {
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import { DndPlugin } from "@udecode/plate-dnd";
import { EmojiInputPlugin, EmojiPlugin } from "@udecode/plate-emoji/react";
import { ExitBreakPlugin, SoftBreakPlugin } from "@udecode/plate-break/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { ResetNodePlugin } from "@udecode/plate-reset-node/react";
import { DeletePlugin } from "@udecode/plate-select";
import { TabbablePlugin } from "@udecode/plate-tabbable/react";
import { TrailingBlockPlugin } from "@udecode/plate-trailing-block";
import {
  SlashPlugin,
  SlashInputPlugin,
} from "@udecode/plate-slash-command/react";
import { DocxPlugin } from "@udecode/plate-docx";
import { CsvPlugin } from "@udecode/plate-csv";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { JuicePlugin } from "@udecode/plate-juice";
import { HEADING_KEYS } from "@udecode/plate-heading";

import { autoformatListPlugin } from "./plugins/autoformat-plugin";
import { linkPlugin } from "./plugins/link-plugin";
import { cursorOverlayPlugin } from "./plugins/cursor-overlay-plugin";

import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/components/plate-ui/code-block-element";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/plate-ui/code-syntax-leaf";
import { HrElement } from "@/components/plate-ui/hr-element";
import { ImageElement } from "@/components/plate-ui/image-element";
import { LinkElement } from "@/components/plate-ui/link-element";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { ListElement } from "@/components/plate-ui/list-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import { TodoListElement } from "@/components/plate-ui/todo-list-element";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { KbdLeaf } from "@/components/plate-ui/kbd-leaf";
import { withPlaceholders } from "@/components/plate-ui/placeholder";
import { EmojiInputElement } from "@/components/plate-ui/emoji-input-element";
import { SlashInputElement } from "@/components/plate-ui/slash-input-element";

export const useCreateEditor = (
  options: Omit<CreatePlateEditorOptions, "plugins">,
  deps?: React.DependencyList
) => {
  return usePlateEditor(
    {
      plugins: [
        BlockquotePlugin,
        CodeBlockPlugin,
        ParagraphPlugin,
        HeadingPlugin,
        HorizontalRulePlugin,
        linkPlugin,
        ListPlugin,
        ImagePlugin,
        CaptionPlugin.configure({
          options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
        }),
        TodoListPlugin,
        BoldPlugin,
        ItalicPlugin,
        StrikethroughPlugin,
        CodePlugin,
        SubscriptPlugin,
        SuperscriptPlugin,
        UnderlinePlugin,
        KbdPlugin,
        IndentPlugin.configure({
          inject: { targetPlugins: ["p", "h1", "h2", "h3"] },
        }),
        IndentListPlugin.configure({
          inject: { targetPlugins: ["p", "h1", "h2", "h3"] },
        }),
        autoformatListPlugin,
        DndPlugin.configure({
          options: { enableScroller: true },
        }),
        EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
        ExitBreakPlugin.configure({
          options: {
            rules: [
              {
                hotkey: "mod+enter",
              },
              {
                before: true,
                hotkey: "mod+shift+enter",
              },
              {
                hotkey: "enter",
                level: 1,
                query: {
                  allow: ["h1", "h2", "h3"],
                  end: true,
                  start: true,
                },
                relative: true,
              },
            ],
          },
        }),
        NodeIdPlugin,
        ResetNodePlugin.configure({
          options: {
            rules: [
              // Usage: https://platejs.org/docs/reset-node
            ],
          },
        }),
        DeletePlugin,
        SoftBreakPlugin.configure({
          options: {
            rules: [
              { hotkey: "shift+enter" },
              {
                hotkey: "enter",
                query: {
                  allow: ["code_block", "blockquote", "td", "th"],
                },
              },
            ],
          },
        }),
        TabbablePlugin,
        TrailingBlockPlugin.configure({
          options: { type: "p" },
        }),
        cursorOverlayPlugin,
        SlashPlugin,
        DocxPlugin,
        CsvPlugin,
        MarkdownPlugin,
        JuicePlugin,
      ],
      override: {
        components: withPlaceholders({
          [BlockquotePlugin.key]: BlockquoteElement,
          [CodeBlockPlugin.key]: CodeBlockElement,
          [CodeLinePlugin.key]: CodeLineElement,
          [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
          [EmojiInputPlugin.key]: EmojiInputElement,
          [HorizontalRulePlugin.key]: HrElement,
          [ImagePlugin.key]: ImageElement,
          [LinkPlugin.key]: LinkElement,
          [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
          [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
          [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
          [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
          [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
          [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
          [BulletedListPlugin.key]: withProps(ListElement, { variant: "ul" }),
          [NumberedListPlugin.key]: withProps(ListElement, { variant: "ol" }),
          [ListItemPlugin.key]: withProps(PlateElement, { as: "li" }),
          [ParagraphPlugin.key]: ParagraphElement,
          [SlashInputPlugin.key]: SlashInputElement,
          [TodoListPlugin.key]: TodoListElement,
          [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
          [CodePlugin.key]: CodeLeaf,
          [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
          [KbdPlugin.key]: KbdLeaf,
          [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
          [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
          [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
          [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
        }),
      },
      ...options,
    },
    deps
  );
};
