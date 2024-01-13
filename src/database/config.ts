import mongoose from "mongoose";

// 331

const dbConnection = async () => {
  try {
    // @ts-ignore
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de inicializar BD");
  }
};

module.exports = {
  dbConnection,
};
