import "server-only";
import { apiVersion, projectId } from "./env";

const EDITOR_ROLES = new Set(["administrator", "editor", "developer"]);

type SanityUser = { id: string; role?: string; roles?: { name: string }[] };

export async function verifyEditor(authorization: string | null): Promise<SanityUser | null> {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !projectId) return null;
  const response = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = (await response.json()) as SanityUser;
  const roles = [user.role, ...(user.roles ?? []).map((role) => role.name)].filter(Boolean);
  return roles.some((role) => EDITOR_ROLES.has(role as string)) ? user : null;
}
