import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import router from "./routes/invoice";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

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
 * swagger js doc
 */
const swaggerSpec = swaggerJSDoc({
    // Specify the Swagger version to use (default is 2)
    definition: {
      openapi: "3.0.0", // for OpenAPI 3.0.0 specification
      info: {
        title: "Invoice Backend Service", // Name of the API
        version: "1.0.0", // Version of the API
        description: "Amalitech Invoice App Backend Service Documentation", // Description of the API
      },
      servers: [
        {
          url: "http://localhost:3000", // URL of the server hosting the API
        },
      ],
      // Add security definitions (e.g. API key, OAuth2)
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    // Specify the file(s) that contain the API routes
    apis: [__filename],
  });
  
  // Serve the Swagger UI
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  

/**
 * Not found route
 */
app.all('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

export default app;
