import express from "express";
import bodyParser from "body-parser";
import router from "./routes/invoice";
import cors from "cors";

const app = express();

/**
 * middlewares
 */
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

/**
 * routes
 */
app.use("/invoice", router);

export default app;
