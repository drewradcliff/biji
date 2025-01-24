import type { InstantRules } from "@instantdb/react";

const rules = {
  notes: {
    allow: {
      view: "auth.id != null",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
  },
  folders: {
    allow: {
      view: "auth.id != null",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
  },
} satisfies InstantRules;

export default rules;
