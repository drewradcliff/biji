import { init } from "@instantdb/react";
import schema from "../instant.schema";

export const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID,
  schema,
});

export const room = db.room("shared", "room-id");
