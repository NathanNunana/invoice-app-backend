import { Response, Request } from "express";
import { v4 } from "uuid";
import pool from "../server";
import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD } from "../utils/secrets";
import Mailgen from "mailgen";

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: APP_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    // Create a Mailgen instance
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Amalitech",
        link: "https://amalitech.org",
        logo: "https://amalitech.org/wp-content/uploads/2020/01/Logo-1.png",
      },
    });

    // Create email content
    const email = {
      body: {
        name: data.clientName,
        intro: "Thank you for your purchase! Here is your invoice:",
        table: {
          data: data.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
          columns: {
            customWidth: {
              name: "15%",
              quantity: "15%",
              price: "15%",
              total: "15%",
            },
            customAlignment: {
              total: "right",
            },
          },
        },
        outro: `Payment is due by ${data.paymentDue.substring(
          0,
          10
        )}. If you have any questions, please contact us at support@example.com.`,
        signature: "Thank you,",
        action: {
          instructions: "To make a payment, please click the button below:",
          button: {
            color: "#7c5dfa",
            text: `Pay £${data.total.toFixed(2)}`,
            link: "https://paystack.com/gh/demo/checkout",
          },
        },
      },
    };
    // Generate the HTML email using Mailgen
    const emailBody = mailGenerator.generate(email);

    require("fs").writeFileSync("preview.html", emailBody, "utf8");

    // Define the email options
    const mailOptions = {
      from: `${APP_EMAIL}`,
      to: `${data.clientEmail}`,
      subject: "Invoice for your request",
      html: emailBody,
    };

    await transporter
      .sendMail(mailOptions)
      .then(() =>
        res.status(201).json({
          msg: "You should receive an email",
        })
      )
      .catch((e) => res.status(500).json({ error: e }));

    // json response
    res.json({
      success: true,
      message: `invoice with id: ${id.substring(0, 6).toUpperCase()} created.`,
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
    console.log(id)
    // select query
    const query = `SELECT * FROM invoices WHERE id = '${id}'`;
    // run query
    const invoices = await pool.query(query);
    console.log(invoices)
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

/**
 * filter invoices by status
 */
export const filterByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const query = `
        SELECT * FROM invoices 
        WHERE 
            status = '${status}';
    `;
    const invoice = await pool.query(query);
    // json response
    res.json({
      success: true,
      message: `${status} invoices`,
      invoice: invoice.rows,
    });
  } catch (e) {
    console.log(e);
  }
};
