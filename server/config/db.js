const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect("mongodb+srv://ithanave628_db_user:Naveen%404587@cluster0.diozprq.mongodb.net/agrorent?appName=Cluster0");

    console.log("MongoDB Connected");

  } catch (error) {

    console.error(error.message);
    process.exit(1);

  }
};

module.exports = connectDB;