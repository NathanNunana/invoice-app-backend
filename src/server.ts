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
const pool =
  process.env.NODE_ENV === "development"
    ? new Pool({
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT),
      })
    : new Pool({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        }
      });

export default pool;
