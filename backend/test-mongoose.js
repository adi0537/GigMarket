import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  password: { type: String }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

async function test() {
  await mongoose.connect('mongodb://localhost:27017/test-mongoose');
  console.log("Connected");
  try {
    const user = await User.create({ password: "mypassword" });
    console.log("User created:", user.password);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit();
}
test();
