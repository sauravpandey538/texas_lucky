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
    connection: {
      host: process.env.POSTGRES_HOST,
      port: 5432, // ✅ Default PostgreSQL port
      user: process.env.POSTGRES_USER, // Change to your PostgreSQL username
      password: process.env.POSTGRES_PASSWORD, // Change to your PostgreSQL password
      database: process.env.POSTGRES_DATABASE, // Change to your database name
    },
    // ssl: {
    //   rejectUnauthorized: false,
    //   sslmode: "require",
    // },
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
