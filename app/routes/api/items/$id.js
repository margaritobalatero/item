const { json } = require('@remix-run/node');
const { getItemById, updateItem, deleteItem } = require('../../../models/item.server');

export async function loader({ params }) {
  const item = await getItemById(params.id);
  return json({ item });
}

export async function action({ request, params }) {
  if (request.method === 'PUT') {
    const data = await request.json();
    const updated = await updateItem(params.id, data);
    return json({ item: updated });
  }
  if (request.method === 'DELETE') {
    await deleteItem(params.id);
    return json({ ok: true });
  }
  return json({ error: 'Unsupported' }, { status: 400 });
}