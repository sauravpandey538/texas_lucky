/* eslint-disable @typescript-eslint/no-explicit-any */
import knex from "knex";
import knexConfig from "../../knexfile";

// console.log(process.env.DATABASE_URL);
// console.log(knexConfig.production);
const pg = knex(knexConfig.production);

console.log(pg);
pg.raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed", err));

export default pg;
