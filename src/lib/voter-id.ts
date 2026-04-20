import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "brownie-voter-id";

export async function getVoterId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  return "unknown";
}

export async function getOrCreateVoterId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}
