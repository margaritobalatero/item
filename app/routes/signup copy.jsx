import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { registerUser } from "../utils/auth.server.js";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    await registerUser({ username, password });
    return redirect("/login");
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

export default function Signup() {
  const actionData = useActionData();

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Sign Up</h2>
      <Form method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
