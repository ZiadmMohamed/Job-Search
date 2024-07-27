import express from "express";
import connectionDb from "./db/connection.js";
import userRouter from "./src/modules/user/user.routes.js";
import companyRouter from "./src/modules/company/company.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";
const app = express();
const port = 3000;
connectionDb();

app.use(express.json());
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.use("*", (req, res) => res.send("error 404 page not found!"));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
