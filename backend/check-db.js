import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://adityaks920:Aditya12345@cluster537.fssziok.mongodb.net/?appName=Cluster537')
  .then(async () => {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users:", users.map(u => ({ email: u.email, pwd: u.password })));
    process.exit(0);
  });
