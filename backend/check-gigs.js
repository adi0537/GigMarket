import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://adityaks920:Aditya12345@cluster537.fssziok.mongodb.net/?appName=Cluster537')
  .then(async () => {
    const gigs = await mongoose.connection.db.collection('gigs').find({}).toArray();
    console.log("Gigs:", gigs);
    process.exit(0);
  });
