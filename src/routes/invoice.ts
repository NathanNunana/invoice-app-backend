import { Router } from "express";
import {
  createInvoice,
  readInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  readInvoiceById,
} from "../controllers/invoice";

const router = Router();

/**
 * create invoice route
 */
router.post("/create", createInvoice);

/**
 * fetch invoice route
 */
router.get("/", readInvoice);

/**
 * fetch invoice by id route
 */
router.get("/:id", readInvoiceById);

/**
 * update invoice route
 */
router.put("/update/:id", updateInvoice);

/**
 * delete invoice route
 */
router.delete("/remove/:id", deleteInvoice);

/**
 * mark invoice as paid route
 */
router.put("/mark/:id", markInvoiceAsPaid);

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

export default router;
