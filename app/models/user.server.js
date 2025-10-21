import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { connect } = require('../utils/db.server');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

let User;

async function getModel() {
  await connect();
  if (!mongoose.models.User) {
    User = mongoose.model('User', UserSchema);
  } else {
    User = mongoose.models.User;
  }
  return User;
}

async function createUser(email, password) {
  const User = await getModel();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return User.create({ email, passwordHash: hash });
}

async function findUserByEmail(email) {
  const User = await getModel();
  return User.findOne({ email }).lean();
}

async function verifyPassword(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.passwordHash);
  return ok ? user : null;
}

export default mongoose;