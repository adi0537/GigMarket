import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String });
schema.pre('save', function(next) {
  console.log('hook called');
  next();
});
const Model = mongoose.model('Test2', schema);
const doc = new Model({ name: 'test' });
doc.save().then(() => {console.log('saved'); process.exit(0);}).catch(e => console.error(e));
