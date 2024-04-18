import mongoose from "mongoose";
 const connectDb = async () => {
  try {
    const url =
      "mongodb+srv://Aayushi_sharma:Ayu12345@cluster0.wqr9uuh.mongodb.net/authentication?retryWrites=true&w=majority";
    await mongoose.connect(url);
    console.log("Database connect sucessfully");
  } catch (error) {
    console.log("Database not conncted", error);
  }
};

export default connectDb;