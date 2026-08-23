import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
mongoose.connect('mongodb+srv://adityaks920:Aditya12345@cluster537.fssziok.mongodb.net/?appName=Cluster537').then(async () => {
  const schema = new mongoose.Schema({ password: { type: String }, name: { type: String } });
  schema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  const Model = mongoose.models.Test5 || mongoose.model('Test5', schema);
  
  let doc = new Model({ password: 'test', name: 'original' });
  await doc.save();
  console.log("After create:", doc.password);
  
  let found = await Model.findById(doc._id);
  found.name = "updated";
  await found.save();
  console.log("After update in memory:", found.password);

  let final = await Model.findById(doc._id);
  console.log("In DB after update:", final.password);
  
  process.exit(0);
});
