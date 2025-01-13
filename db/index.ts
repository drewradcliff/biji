import { init } from "@instantdb/react";
import schema from "../instant.schema";

export const db = init({ appId: process.env.INSTANTDB_APP_ID!, schema });
