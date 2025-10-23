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

// ✅ Load Bootstrap CDN
export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    },
  ];
}

export default function Signup() {
  const actionData = useActionData();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h2 className="text-center mb-4 text-success">Sign Up</h2>
        {actionData?.error && (
          <div className="alert alert-danger text-center">{actionData.error}</div>
        )}

        <Form method="post" className="d-grid gap-3">
          <div>
            <label className="form-label fw-semibold">Username:</label>
            <input
              type="text"
              name="username"
              required
              className="form-control"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              name="password"
              required
              className="form-control"
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Sign Up
          </button>

          <div className="text-center mt-3">
            <a href="/login" className="text-decoration-none text-success">
              Already have an account? Login
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
