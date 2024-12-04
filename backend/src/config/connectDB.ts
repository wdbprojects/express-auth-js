import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URL!);
    if (connection) {
      console.log(`Successfully connected to DB: ${connection.name}`);
    }
  } catch (error: any) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
