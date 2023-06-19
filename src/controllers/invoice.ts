import { Response, Request } from "express";
import { v4 } from "uuid";
import pool from "../server";
import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD } from "../utils/secrets";
import Mailgen from "mailgen";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

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

    console.log(query);
    // run query
    const invoice = await pool.query(query);

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

    data.status.toLowerCase() === "draft"
      ? null
      : await transporter
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
    console.log(id);
    // select query
    const query = `SELECT * FROM invoices WHERE id = '${id}'`;
    // run query
    const invoices = await pool.query(query);
    console.log(invoices);
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

    const data = await pool.query(`SELECT * FROM invoices WHERE id = '${id}'`);

    console.log(data.rows[0]);

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    const generateTableRow = (
      doc: any,
      y: number,
      c1: string,
      c3: string,
      c4: string,
      c5: string
    ) => {
      doc
        .fontSize(10)
        .text(c1, 50, y)
        .text(c3, 280, y, { width: 90, align: "right" })
        .text(c4, 370, y, { width: 90, align: "right" })
        .text(c5, 0, y, { align: "right" });
    };

    const generateInvoiceTable = (doc: any, invoice: any) => {
      let i;
      const invoiceTableTop = 330;

      doc.font("Helvetica-Bold");
      generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Unit Cost",
        "Quantity",
        "Total"
      );
      generateHr(doc, invoiceTableTop + 20);
      doc.font("Helvetica");

      for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          position,
          item.name,
          item.price,
          item.quantity,
          (item.quantity * item.price).toString()
        );

        generateHr(doc, position + 20);
      }

      const subtotalPosition = invoiceTableTop + (i + 1) * 30;
      generateTableRow(doc, subtotalPosition, "", "Total", "", invoice.total);

      const paidToDatePosition = subtotalPosition + 20;
      generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "Status",
        "",
        invoice.status
      );

      // const duePosition = paidToDatePosition + 25;
      // doc.font("Helvetica-Bold");
      // generateTableRow(doc, duePosition, "", "Balance Due", "", "0");
      // doc.font("Helvetica");
    };

    const generateHr = (doc: any, y: number) => {
      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
    };

    doc
      .image(`src/assets/logo.png`, 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("Amalitech.", 110, 57)
      .fontSize(10)
      .text("Amalitech.", 200, 50, { align: "right" })
      .text("123 Main Street", 200, 65, { align: "right" })
      .text("Takoradi, TD, 10025", 200, 80, { align: "right" })
      .moveDown();

    doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text("Invoice Number:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(data.rows[0].id, 150, customerInformationTop)
      .font("Helvetica")
      .text("Invoice Date:", 50, customerInformationTop + 15)
      .text(
        data.rows[0].createdat.toString().substring(0, 10),
        150,
        customerInformationTop + 15
      )
      .text("Balance Due:", 50, customerInformationTop + 30)
      .text(data.rows[0].total, 150, customerInformationTop + 30)

      .font("Helvetica-Bold")
      .text(data.rows[0].name, 300, customerInformationTop)
      .font("Helvetica")
      .text(data.rows[0].clientaddress.street, 300, customerInformationTop + 15)
      .text(
        data.rows[0].clientaddress.city +
          ", " +
          data.rows[0].clientaddress.postcode +
          ", " +
          data.rows[0].clientaddress.country,
        300,
        customerInformationTop + 30
      )
      .moveDown();

    generateHr(doc, 252);

    generateInvoiceTable(doc, data.rows[0]);

    doc
      .fontSize(10)
      .text(
        `Payment is due ${data.rows[0].paymentDue}. Thank you for your business.`,
        50,
        780,
        { align: "center", width: 500 }
      );

    doc.end();

    const invoicePath = `src/pdfs/invoice_${data.rows[0].id}.pdf`;

    const directory = path.dirname(invoicePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    doc.pipe(fs.createWriteStream(invoicePath));

    console.log(`client: ${data.rows[0].clientemail}`);

    await transporter
      .sendMail({
        from: `${APP_EMAIL}`,
        to: `${data.rows[0].clientemail}`,
        subject: "Invoice for your request",
        text: "Please find attached PDF copy of paid invoice",
        attachments: [
          {
            filename: "invoice.pdf",
            path: invoicePath,
            contentType: "application/pdf",
          },
        ],
      })
      .then(() => {
        res.status(201).json({
          success: true,
          message: `invoice #${id} paid`,
          invoice: invoice.rows,
        });
      })
      .catch((e) => {
        res.status(500).json({ error: e });
      });

    // json response
    // res.json({
    //   success: true,
    //   message: `invoice #${id} paid`,
    //   invoice: invoice.rows,
    // });
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
