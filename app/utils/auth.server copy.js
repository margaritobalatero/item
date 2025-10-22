// app/utils/auth.server.js
import bcrypt from "bcryptjs";
import mongoose, { connectDB } from "../utils/db.server.js";

// make sure DB is connected before queries
await connectDB();

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Register user
export async function registerUser({ username, password }) {
  const existing = await User.findOne({ username });
  if (existing) throw new Error("Username already exists");

  const hashed = await hashPassword(password);
  const user = new User({ username, password: hashed });
  await user.save();
  return user;
}

// Login user
export async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid username or password");

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) throw new Error("Invalid username or password");

  return user;
}

// then define your schema and model
const userSchema = new mongoose.Schema({ username: String, password: String });


const User = mongoose.models.User || mongoose.model("User", userSchema);
