import "server-only";
import { serverEnv } from "@/lib/env";
import { client } from "./client";

export function writeClient() {
  const token = serverEnv.sanityWriteToken();
  if (!token) throw new Error("NEXT_SANITY_API_WRITE_TOKEN is not set");
  return client.withConfig({ token, useCdn: false, perspective: "raw" });
}

export const freshClient = client.withConfig({ useCdn: false });
