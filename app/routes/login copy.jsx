import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { loginUser } from "../utils/auth.server.js";
import { createUserSession } from "../session.server.js";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const user = await loginUser({ username, password });
    return createUserSession(user._id, "/dashboard");
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Login</h2>
      <Form method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
