/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return Promise.all([
    knex.schema.createTable("students", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("lcid").notNullable().unique();
      table.string("phone").notNullable();
      table.string("password").notNullable();
      table.timestamps(true, true); // Adds created_at and updated_at
    }),

    knex.schema.createTable("events", (table) => {
      table.increments("id").primary();
      table.datetime("start_date").notNullable();
      table.datetime("due_date").notNullable();
      table.timestamps(true, true);
    }),

    knex.schema.createTable("participation", (table) => {
      table.increments("id").primary();
      table.integer("student_id").unsigned().notNullable();
      table.integer("event_id").unsigned().notNullable();
      table.foreign("student_id").references("students.id").onDelete("CASCADE");
      table.foreign("event_id").references("events.id").onDelete("CASCADE");
      table.timestamps(true, true);
      table.unique(["student_id", "event_id"]); // Prevent duplicate participation
    }),

    knex.schema.createTable("winners", (table) => {
      table.increments("id").primary();
      table.integer("student_id").unsigned().notNullable();
      table.integer("event_id").unsigned().notNullable();
      table.integer("rank").unsigned().notNullable();
      table.foreign("student_id").references("students.id").onDelete("CASCADE");
      table.foreign("event_id").references("events.id").onDelete("CASCADE");
      table.timestamps(true, true);
      table.unique(["event_id", "rank"]); // Prevent duplicate ranks in same event
    }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("winners"),
    knex.schema.dropTable("participation"),
    knex.schema.dropTable("events"),
    knex.schema.dropTable("students"),
  ]);
};
