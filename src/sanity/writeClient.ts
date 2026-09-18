import "server-only";
import { serverEnv } from "@/lib/env";
import { client } from "./client";

let cached: { token: string; client: ReturnType<typeof client.withConfig> } | null = null;

export function writeClient() {
  const token = serverEnv.sanityWriteToken();
  if (!token) throw new Error("NEXT_SANITY_API_WRITE_TOKEN is not set");
  if (cached?.token !== token) {
    cached = { token, client: client.withConfig({ token, useCdn: false, perspective: "raw" }) };
  }
  return cached.client;
}

export const freshClient = client.withConfig({ useCdn: false });
