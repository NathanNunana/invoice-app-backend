import { Response, Request } from "express";
import { v4 } from "uuid";
import pool from "../server";

/**
 * create invoice controller
 * @param req
 * @param res
 */
export const createInvoice = async (req: Request, res: Response) => {
  try {
    // json body
    const data = req.body;
    // unique id generation
    const id = v4().replace(/-/g, "");
    // query
    const query = `INSERT INTO invoices(
        id, 
        paymentDue,
        description,
        paymentTerms,
        clientName,
        status, 
        total, 
        clientEmail, 
        sendersAddress, 
        clientAddress, 
        items
        ) VALUES (
            '${id.substring(0, 6).toUpperCase()}', 
            '${data.paymentDue}', 
            '${data.description}', 
            ${data.paymentTerms}, 
            '${data.clientName}', 
            '${data.status}', 
            ${data.total}, 
            '${data.clientEmail}', 
            '${JSON.stringify(data.sendersAddress)}', 
            '${JSON.stringify(data.clientAddress)}', 
            '${JSON.stringify(data.items)}')`;
    // run query
    const invoice = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `invoice with id: ${id.substring(0, 6).toUpperCase()} created`,
      invoice: invoice,
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 * read invoice controller
 * @param req
 * @param res
 */
export const readInvoice = async (req: Request, res: Response) => {
  try {
    // select query
    const query = "SELECT * FROM invoices";
    // run query
    const invoices = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `${invoices.rows.length} invoices retrieved`,
      invoice: invoices.rows,
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 * read invoice by id controller
 * @param req
 * @param res
 */
export const readInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // select query
    const query = `SELECT * FROM invoices WHERE id = ${id}`;
    // run query
    const invoices = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `${invoices.rowCount} invoices retrieved`,
      invoice: invoices.rows,
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 * update invoice controller
 * @param req
 * @param res
 */
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // json body
    const data = req.body;
    // invoice update query
    const query = `
    UPDATE invoices 
    SET paymentDue = '${data.paymentDue}', 
        description = '${data.description}', 
        paymentTerms = ${data.paymentTerms}, 
        clientName = '${data.clientName}', 
        status = '${data.status}', 
        total = ${data.total}, 
        clientEmail = '${data.clientEmail}', 
        sendersAddress = '${JSON.stringify(data.sendersAddress)}', 
        clientAddress = '${JSON.stringify(data.clientAddress)}', 
        items = '${JSON.stringify(data.items)}'
    WHERE 
        id = '${id}';
`;
    // run query
    const invoice = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `invoice #${data.id} updated`,
      invoice: invoice.rows,
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 * delete invoice controller
 * @param req
 * @param res
 */
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // delete query
    const query = `
        DELETE FROM invoices
        WHERE id = '${id}';
    `;
    // run query
    const invoice = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `invoice #${id} deleted`,
      invoice: invoice.rows,
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 * mark invoice as paid
 */
export const markInvoiceAsPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // invoice update query
    const query = `
        UPDATE invoices 
        SET status = 'Paid' 
        WHERE 
            id = '${id}';
    `;
    console.log(query);
    console.log(id);
    // run query
    const invoice = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `invoice #${id} paid`,
      invoice: invoice.rows,
    });
  } catch (e) {
    console.log(e);
  }
};
