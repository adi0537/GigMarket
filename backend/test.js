import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String });
schema.pre('save', async function(next) {
  console.log('hook called');
});
const Model = mongoose.model('Test', schema);
const doc = new Model({ name: 'test' });
doc.save().then(() => console.log('saved')).catch(e => console.error(e));
