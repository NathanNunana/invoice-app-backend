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

export default router;
