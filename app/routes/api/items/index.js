const { json } = require('@remix-run/node');
const { getItems, createItem } = require('../../../models/item.server');

export async function loader() {
  const items = await getItems();
  return json({ items });
}

export async function action({ request }) {
  const method = request.method;
  if (method === 'POST') {
    const form = await request.formData();
    const data = {
      item: form.get('item'),
      itemDescription: form.get('itemDescription'),
      quantity: Number(form.get('quantity') || 0),
      unit: form.get('unit'),
      unitPrice: Number(form.get('unitPrice') || 0),
      imageUrl: form.get('imageUrl')
    };
    const created = await createItem(data);
    return json({ item: created });
  }
  return json({ error: 'Unsupported' }, { status: 400 });
}