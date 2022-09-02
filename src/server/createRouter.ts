import { router } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./createContext";

export function createRouter() {
  //   TODO: add context to generic
  return router<Context>().transformer(superjson);
}
