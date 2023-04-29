import express, {Request, Response} from "express";
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

/**
 * Not found route
 */
app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

export default app;
