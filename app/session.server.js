// app/session.server.js
import { redirect, json } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: false, // set true if using HTTPS
    domain: undefined, // allows localhost and 192.168.x.x both
  },
});

export function getSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export function commitSession(session) {
  return storage.commitSession(session);
}

export function destroySession(session) {
  return storage.destroySession(session);
}

// ✅ Create a new session after login
export async function createUserSession(userId, redirectTo = "/dashboard") {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// ✅ Require user session (protect routes)
export async function requireUserSession(request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}

// ✅ Optional: for logout route
export async function destroyUserSession(request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
