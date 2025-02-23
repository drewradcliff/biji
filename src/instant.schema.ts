import { i } from "@instantdb/react";

const _schema = i.schema({
  // This section lets you define entities: think `posts`, `comments`, etc
  // Take a look at the docs to learn more:
  // https://www.instantdb.com/docs/modeling-data#2-attributes
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      name: i.string(),
      createdAt: i.date(),
    }),
    roles: i.entity({
      type: i.string().unique(),
    }),
    notes: i.entity({
      body: i.string(),
      createdAt: i.date(),
    }),
    folders: i.entity({
      name: i.string(),
      isFavorite: i.boolean(),
      isShared: i.boolean(),
      createdAt: i.date(),
    }),
  },
  // You can define links here.
  // For example, if `posts` should have many `comments`.
  // More in the docs:
  // https://www.instantdb.com/docs/modeling-data#3-links
  links: {
    noteOwner: {
      forward: { on: "notes", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "notes" },
    },
    noteFolder: {
      forward: { on: "notes", has: "one", label: "folder" },
      reverse: { on: "folders", has: "many", label: "notes" },
    },
    folderUser: {
      forward: { on: "folders", has: "one", label: "owner" },
      reverse: { on: "profiles", has: "many", label: "folders" },
    },
    profileUser: {
      forward: { on: "profiles", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    userRoles: {
      forward: { on: "roles", has: "many", label: "users" },
      reverse: { on: "$users", has: "one", label: "role" },
    },
  },
  rooms: {
    shared: {
      presence: i.entity({
        name: i.string(),
        color: i.string(),
      }),
      topics: {},
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
