import dotenv from "dotenv";
dotenv.config();

//console.log("url is ", process.env.DATABASE_URL);
const knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432, // ✅ Default PostgreSQL port
      user: "postgres", // Change to your PostgreSQL username
      password: "itsmine", // Change to your PostgreSQL password
      database: "lucky_draw", // Change to your database name
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      sslmode: "require",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
export default knexConfig;
