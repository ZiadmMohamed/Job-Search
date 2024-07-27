import mongoose from "mongoose";

const connectionDb = async () => {
  return await mongoose
    .connect("mongodb://localhost:27017/jobFaire")
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log({ msg: "fail to connected to db", err });
    });
};

export default connectionDb;
