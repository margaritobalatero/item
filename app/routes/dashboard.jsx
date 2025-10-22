import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { requireUserSession } from "../session.server.js";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} from "../models/item.server.js";
import { useState, useEffect } from "react";

// Format numbers to PHP currency
function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value || 0);
}

export async function loader({ request }) {
  await requireUserSession(request);
  const items = await getItems();
  return json({ items });
}

export async function action({ request }) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  const data = {
    item: formData.get("item"),
    description: formData.get("description"),
    quantity: Number(formData.get("quantity")),
    unit: formData.get("unit"),
    unitPrice: Number(formData.get("unitPrice")),
    imageUrl: formData.get("imageUrl"),
  };

  if (_action === "create") {
    await createItem(data);
  } else if (_action === "update") {
    const id = formData.get("id");
    await updateItem(id, data);
  } else if (_action === "delete") {
    const id = formData.get("id");
    await deleteItem(id);
  } else if (_action === "logout") {
    return redirect("/login");
  }

  return redirect("/dashboard");
}

export default function Dashboard() {
  const { items } = useLoaderData();
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
    description: "",
    quantity: "",
    unit: "",
    unitPrice: "",
    imageUrl: "",
    id: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (editItem) {
      setFormData({
        item: editItem.item,
        description: editItem.description,
        quantity: editItem.quantity,
        unit: editItem.unit,
        unitPrice: editItem.unitPrice,
        imageUrl: editItem.imageUrl,
        id: editItem._id,
      });
    } else {
      setFormData({
        item: "",
        description: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        imageUrl: "",
        id: "",
      });
    }
  }, [editItem]);

  // Open centered pop-up detail window
const openDetailWindow = (item) => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;
  const detailWindow = window.open(
    "",
    "_blank",
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
  );
  detailWindow.document.write(`
    <html>
      <head>
        <title>${item.item} - Detail</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          .close-btn-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
        </style>
      </head>
      <body class="p-4">
        <h3 class="text-primary mb-3">${item.item}</h3>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Unit:</strong> ${item.unit}</p>
        <p><strong>Unit Price:</strong> ${formatPeso(item.unitPrice)}</p>
        ${
          item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.item}" class="img-fluid rounded mt-2" style="max-width:100%"/>`
            : ""
        }
        <div class="close-btn-container">
          <button onclick="window.close()" class="btn btn-secondary">Close</button>
        </div>
      </body>
    </html>
  `);
};

  const totalItems = items.length;

  return (
    <div>
      {/* Bootstrap CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        <nav
          className={`bg-primary text-white p-3 flex-shrink-0 ${
            sidebarOpen ? "d-block" : "d-none"
          }`}
          style={{ width: "220px" }}
        >
          <h2 className="text-light">My Dashboard</h2>
          <ul className="nav flex-column mt-4">
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#summary">
                Summary
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#crud">
                Manage Items
              </a>
            </li>
            <li className="nav-item mt-4">
              <Form method="post">
                <button
                  type="submit"
                  name="_action"
                  value="logout"
                  className="btn btn-danger w-100"
                >
                  Logout
                </button>
              </Form>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            </button>
            <span className="h3 text-primary">Dashboard CRUD</span>
          </div>

          {/* Dashboard Summary */}
          <div id="summary" className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card text-white bg-success shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Items</h5>
                  <p className="card-text fs-3">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CRUD Form */}
          <div id="crud" className="card mb-4 shadow-sm">
            <div className="card-body">
              <Form method="post" className="row g-2">
                <div className="col-md-3">
                  <input
                    name="item"
                    placeholder="Item"
                    required
                    className="form-control"
                    value={formData.item}
                    onChange={(e) =>
                      setFormData({ ...formData, item: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <input
                    name="description"
                    placeholder="Description"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-1">
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Qty"
                    required
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-1">
                  <input
                    name="unit"
                    placeholder="Unit"
                    className="form-control"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    name="unitPrice"
                    type="number"
                    placeholder="Unit Price (₱)"
                    required
                    className="form-control"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    name="imageUrl"
                    placeholder="Image URL"
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>

                {editItem && <input type="hidden" name="id" value={formData.id} />}
                <div className="col-12 d-flex gap-2 mt-2">
                  <button
                    type="submit"
                    name="_action"
                    value={editItem ? "update" : "create"}
                    className="btn btn-success"
                  >
                    {editItem ? "Update Item" : "Add Item"}
                  </button>
                  {editItem && (
                    <button
                      type="button"
                      onClick={() => setEditItem(null)}
                      className="btn btn-secondary"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </Form>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id}>
                    <td>{i.item}</td>
                    <td>{i.description}</td>
                    <td>{i.quantity}</td>
                    <td>{i.unit}</td>
                    <td>{formatPeso(i.unitPrice)}</td>
                    <td>
                      {i.imageUrl && (
                        <img
                          src={i.imageUrl}
                          alt={i.item}
                          className="img-thumbnail"
                          style={{ width: "70px", height: "70px", objectFit: "cover" }}
                        />
                      )}
                    </td>
                    <td className="d-flex gap-1">
                      <button
                        onClick={() => setEditItem(i)}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </button>

                      <Form method="post">
                        <input type="hidden" name="id" value={i._id} />
                        <button
                          type="submit"
                          name="_action"
                          value="delete"
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </Form>

                      <button
                        onClick={() => openDetailWindow(i)}
                        className="btn btn-info btn-sm text-white"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}