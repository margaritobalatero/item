import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { loginUser } from "../utils/auth.server.js";
import { createUserSession, destroyUserSession } from "../session.server.js";

export async function action({ request }) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const user = await loginUser(username, password);
  if (!user) {
    return json({ error: "Invalid username or password" }, { status: 400 });
  }

  return createUserSession(user._id, "/dashboard");
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      <Form method="post">
        <div>
          <label>Username</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </Form>
      <p>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}