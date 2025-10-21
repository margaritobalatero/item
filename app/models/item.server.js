// app/models/item.server.js
import mongoose from "../utils/db.server.js";

const itemSchema = new mongoose.Schema({
  item: String,
  description: String,
  quantity: Number,
  unit: String,
  unitPrice: Number,
  imageUrl: String,
  userId: String,
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export async function getItems() {
  return await Item.find();
}

export async function createItem(data) {
  const newItem = new Item(data);
  await newItem.save();
  return newItem;
}

export async function deleteItem(id) {
  return await Item.findByIdAndDelete(id);
}

export async function getItemById(id) {
  return await Item.findById(id);
}

export async function updateItem(id, data) {
  return await Item.findByIdAndUpdate(id, data, { new: true });
}
