// app/session.server.js
import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

const storage = createCookieSessionStorage({
  cookie: {
    name: "user_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

export async function createUserSession(userId, redirectTo) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

export async function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request) {
  const session = await getUserSession(request);
  return session.get("userId");
}

export async function requireUserSession(request) {
  const userId = await getUserId(request);
  if (!userId) throw redirect("/login");
  return userId;
}

export async function destroyUserSession(request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
