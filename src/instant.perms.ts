import type { InstantRules } from "@instantdb/react";

const rules = {
  notes: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: [
      "isOwner",
      "data.id in auth.ref('$user.notes.id')",
      "isAdmin",
      "'admin' in auth.ref('$user.role.type')",
    ],
  },
  folders: {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
  },
} satisfies InstantRules;

export default rules;
