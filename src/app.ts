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

// Define your Swagger specification here
/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         paymentDue:
 *           type: date
 *         description:
 *           type: string
 *         paymentTerms:
 *           type: int
 *         clientName:
 *           type: string
 *         status:
 *           type: string
 *         total:
 *           type: double
 *         clientEmail:
 *           type: string
 *         sendersAddress:
 *           type: object
 *         clientAddress:
 *           type: object
 *         items:
 *           type: array
 *
 * /invoice:
 *   get:
 *     summary: Retrieve all invoices
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *
 * /invoice/create:
 *   post:
 *     summary: Create a new invoice
 *     requestBody:
 *       description: Invoice object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Created
 *
 * /invoice/update/{id}:
 *   put:
 *     summary: Update an invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the invoice to update
 *     requestBody:
 *       description: Updated invoice object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 *
 * /invoice/mark/{id}:
 *   put:
 *     summary: Update the status of a single invoice.
 *     description: Update the status of a single invoice in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the invoice to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: status
 *         description: The new status of the invoice.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated invoice record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /invoice/delete/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the invoice to delete
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 * 
 * /invoice/filter/{status}:
 *   get:
 *     summary: Filter an invoice by status
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: STATUS
 *         required: true
 *         description: status name of the invoice to delete
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 *
 */

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
          url: "https://invoice-app-backend-dfaj.onrender.com/", // URL of the server hosting the API
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
