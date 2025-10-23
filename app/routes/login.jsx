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

// ✅ Load Bootstrap from CDN
export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    },
  ];
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
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
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="form-label fw-semibold">Password:</label>
            <input
              type="password"
              name="password"
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>

          <div className="text-center mt-3">
            <a href="/signup" className="text-decoration-none text-primary">
              Don’t have an account? Sign up
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
