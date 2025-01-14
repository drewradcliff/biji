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
    notes: i.entity({
      title: i.string(),
      body: i.string(),
      createdAt: i.date(),
    }),
  },
  // You can define links here.
  // For example, if `posts` should have many `comments`.
  // More in the docs:
  // https://www.instantdb.com/docs/modeling-data#3-links
  links: {
    noteAuthor: {
      forward: { on: "notes", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "authoredNotes" },
    },
  },
  // If you use presence, you can define a room schema here
  // https://www.instantdb.com/docs/presence-and-topics#typesafety
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
