import app from "./app";
import errorHandler from "errorhandler";
import { Pool } from "pg";
import {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  DATABASE_URL,
} from "./utils/secrets";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

/**
 * handle development errors
 */
process.env.NODE_ENV === "development" ? errorHandler() : null;

/**
 * start server
 */
app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log(" Press CTRL-C to stop\n");
});

/**
 * db connection
 */
const pool = process.env.NODE_ENV === "development" ? new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT),
}) : new Pool({
  connectionString: DATABASE_URL,
});

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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default pool;
