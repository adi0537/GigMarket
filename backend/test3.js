import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://adityaks920:Aditya12345@cluster537.fssziok.mongodb.net/?appName=Cluster537').then(() => {
  const schema = new mongoose.Schema({ name: String });
  schema.pre('save', async function(next) {
    console.log('hook called');
  });
  const Model = mongoose.model('Test3', schema);
  const doc = new Model({ name: 'test' });
  doc.save().then(() => {console.log('saved'); process.exit(0);}).catch(e => console.error(e));
});
