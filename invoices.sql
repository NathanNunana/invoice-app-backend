DROP DATABASE IF EXISTS invoice_db;

CREATE DATABASE invoice_db;

CREATE TYPE STATUS AS ENUM ('Pending', 'Paid', 'Draft');

CREATE TABLE invoices(
    id VARCHAR(100) PRIMARY KEY NOT NULL,
    createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
    paymentDue DATE,
    description VARCHAR(255),
    paymentTerms INT,
    clientName VARCHAR(255),
    clientEmail VARCHAR(255),
    status STATUS,
    sendersAddress JSON,
    clientAddress JSON,
    items JSONB,
    total MONEY
);


INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'RT3080', '2021-08-19', 'Re-branding', 1, 'Jensen Huang','Paid', 1800.90, 'jensenh@mail.com', '{
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    }',
    '{
      "street": "106 Kendell Street",
      "city": "Sharrington",
      "postCode": "NR24 5WQ",
      "country": "United Kingdom"
    }',
    '[
      {
        "name": "Brand Guidelines",
        "quantity": 1,
        "price": 1800.90,
        "total": 1800.90
      }
    ]'
);

-- run the following
INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items 
) VALUES (
    'XM9141', '2021-09-20', 'Graphic Design', 30, 'Alex Grim','Pending', 556.00, 'alexgrim@mail.com', '{"street": "19 Union Terrace","city": "London","postCode": "E1 3EZ","country": "United Kingdom"}', '{"street": "84 Church Way","city": "Bradford","postCode": "BD1 9PB","country": "United Kingdom"}', '[
      {
        "name": "Banner Design",
        "quantity": 1,
        "price": 156.00,
        "total": 156.00
      },
      {
        "name": "Email Design",
        "quantity": 2,
        "price": 200.00,
        "total": 400.00
      }
    ]'
);

INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'RG0314', '2021-10-01', 'Website Redesign', 7, 'John Morrison','Paid', 14002.33, 'jm@myco.com', '{"street": "19 Union Terrace","city": "London","postCode": "E1 3EZ","country": "United Kingdom"}', '{"street": "79 Dover Road","city": "Westhall","postCode": "IP19 3PF","country": "United Kingdom"}', '[
      {
        "name": "Website Redesign",
        "quantity": 1,
        "price": 14002.33,
        "total": 14002.33
      }
    ]'
);

INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'RT2080', '2021-10-12', 'Logo Concept', 1, 'Alysa Werner','Pending', 102.04, 'alysa@email.co.uk','{"street": "19 Union Terrace","city": "London","postCode": "E1 3EZ","country": "United Kingdom"}','{"street": "63 Warwick Road","city": "Carlisle","postCode": "CA20 2TG","country": "United Kingdom"}', '[
      {
        "name": "Logo Sketches",
        "quantity": 1,
        "price": 102.04,
        "total": 102.04
      }
    ]'
);

INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'AA1449', '2021-10-14', 'Re-branding', 7, 'Mellisa Clarke','Pending', 4032.33, 'mellisa.clarke@example.com', '{
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    }', '{
      "street": "46 Abbey Row",
      "city": "Cambridge",
      "postCode": "CB5 6EG",
      "country": "United Kingdom"
    }', '[
      {
        "name": "New Logo",
        "quantity": 1,
        "price": 1532.33,
        "total": 1532.33
      },
      {
        "name": "Brand Guidelines",
        "quantity": 1,
        "price": 2500.00,
        "total": 2500.00
      }
    ]'
);

INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'TY9141', '2021-10-31', 'Landing Page Design', 30, 'Thomas Wayne','Pending', 6155.91, 'thomas@dc.com','{
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    }', '{
      "street": "3964  Queens Lane",
      "city": "Gotham",
      "postCode": "60457",
      "country": "United States of America"
    }', '[
      {
        "name": "Web Design",
        "quantity": 1,
        "price": 6155.91,
        "total": 6155.91
      }
    ]'
);

INSERT INTO invoices(
    id, paymentDue,description,paymentTerms,clientName,status, total, clientEmail, sendersAddress, clientAddress, items
) VALUES (
    'FV2353', '2021-11-12', 'Logo Re-design', 7, 'Anita Wainwright','Draft', 3102.04, '', '{
      "street": "19 Union Terrace",
      "city": "London",
      "postCode": "E1 3EZ",
      "country": "United Kingdom"
    }', '{
      "street": "",
      "city": "",
      "postCode": "",
      "country": ""
    }', '[
      {
        "name": "Logo Re-design",
        "quantity": 1,
        "price": 3102.04,
        "total": 3102.04
      }
    ]'
);





-- CREATE TABLE invoice_items (
--     id SERIAL PRIMARY KEY,
--     invoice_id VARCHAR(100),
--     name VARCHAR(255),
--     quantity INT,
--     total MONEY,
-- 	CONSTRAINT fk_invoice_id
-- 		FOREIGN KEY(invoice_id) 
-- 			REFERENCES invoices(id)
-- );

-- CREATE TABLE client_addresses (
--     id SERIAL PRIMARY KEY,
--     invoice_id VARCHAR(100),
--     street VARCHAR(255),
--     city VARCHAR(255),
--     postCode VARCHAR(255),
--     country VARCHAR(255),
-- 	CONSTRAINT fk_invoice_id
-- 		FOREIGN KEY(invoice_id) 
-- 			REFERENCES invoices(id)
-- );

-- CREATE TABLE sender_addresses (
--     id SERIAL PRIMARY KEY,
--     invoice_id VARCHAR(100),
--     street VARCHAR(255),
--     city VARCHAR(255),
--     postCode VARCHAR(255),
--     country VARCHAR(255),
-- 	CONSTRAINT fk_invoice_id
-- 		FOREIGN KEY(invoice_id) 
-- 			REFERENCES invoices(id)
-- );

