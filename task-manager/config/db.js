import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });
};

export default connectDB;