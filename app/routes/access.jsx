import { useLoaderData, Form, useFetcher } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
const { getSession } = require('../session.server');
const { getItems, createItem } = require('../models/item.server');
import Modal from '../components/Modal';
import { useState } from 'react';

export async function loader({ request }) {
  const session = await getSession(request);
  const userId = session.get('userId');
  if (!userId) return redirect('/login');
  const items = await getItems();
  return json({ items });
}

export async function action({ request }) {
  // handle create item from the form on the page
  const session = await getSession(request);
  const userId = session.get('userId');
  if (!userId) return redirect('/login');

  const form = await request.formData();
  const data = {
    item: form.get('item'),
    itemDescription: form.get('itemDescription'),
    quantity: Number(form.get('quantity') || 0),
    unit: form.get('unit'),
    unitPrice: Number(form.get('unitPrice') || 0),
    imageUrl: form.get('imageUrl')
  };
  await createItem(data);
  return redirect('/access');
}

export default function AccessPage() {
  const data = useLoaderData();
  const [modalItem, setModalItem] = useState(null);
  const fetcher = useFetcher();

  return (
    <div>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Items</h2>
        <Form method="post" action="/logout">
          <button className="button" type="submit">Logout</button>
        </Form>
      </header>

      <section style={{ marginTop:20 }}>
        <h3>Create new item</h3>
        <Form method="post">
          <div className="form-row"><input name="item" placeholder="Item" required /></div>
          <div className="form-row"><input name="itemDescription" placeholder="Description" /></div>
          <div className="form-row"><input name="quantity" placeholder="Quantity" type="number" /></div>
          <div className="form-row"><input name="unit" placeholder="Unit" /></div>
          <div className="form-row"><input name="unitPrice" placeholder="Unit price" type="number" step="0.01" /></div>
          <div className="form-row"><input name="imageUrl" placeholder="Image URL" /></div>
          <button className="button" type="submit">Create</button>
        </Form>
      </section>

      <section style={{ marginTop:30 }}>
        <table>
          <thead>
            <tr><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit price</th><th>Image</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.items.map(it => (
              <tr key={it._id}>
                <td>{it.item}</td>
                <td>{it.itemDescription}</td>
                <td>{it.quantity}</td>
                <td>{it.unit}</td>
                <td>{it.unitPrice}</td>
                <td>{it.imageUrl ? <img src={it.imageUrl} style={{ maxWidth:80, maxHeight:50 }} alt="thumb"/> : '-'}</td>
                <td>
                  <a className="button" href={`/api/items/${it._id}`} onClick={e=>{ e.preventDefault(); fetcher.load(`/api/items/${it._id}`); }}>Detail</a>
                  {' '}
                  <a className="button" href={`/access/edit/${it._id}`}>Edit</a>
                  {' '}
                  <fetcher.Form method="delete" action={`/api/items/${it._id}`} style={{ display:'inline' }}>
                    <button className="button button-danger" type="submit">Delete</button>
                  </fetcher.Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* when fetcher loads a single item, show modal */}
        {fetcher.data && fetcher.data.item && (
          <Modal onClose={() => fetcher.load('/access') }>
            <h3>{fetcher.data.item.item}</h3>
            <p>{fetcher.data.item.itemDescription}</p>
            <p>Quantity: {fetcher.data.item.quantity} {fetcher.data.item.unit}</p>
            <p>Unit Price: {fetcher.data.item.unitPrice}</p>
            {fetcher.data.item.imageUrl && <img className="detail-image" src={fetcher.data.item.imageUrl} alt="detail" />}
          </Modal>
        )}

      </section>
    </div>
  );
}