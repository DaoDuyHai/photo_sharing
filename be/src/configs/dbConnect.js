import mongoose from "mongoose";

async function dbConnect() {
  const connectionString = process.env.MONGO_URI || process.env.DB_URL;

  if (!connectionString) {
    console.error("Lỗi: Không tìm thấy MONGO_URI hoặc DB_URL trong biến môi trường.");
    return;
  }

  try {
    await mongoose.connect(connectionString);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Unable to connect to MongoDB Atlas!");
    console.error(error);
  }
}

export default dbConnect;
