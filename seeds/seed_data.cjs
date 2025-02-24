/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

module.exports.seed = async function (knex) {
  await knex("winners").del();
  await knex("participation").del();
  await knex("events").del();
  await knex("students").del();

  // Insert 20 students
  const students = [];
  for (let i = 1; i <= 20; i++) {
    students.push({
      name: `Student ${i}`,
      lcid: `LC${1000 + i}`,
      phone: `98${Math.floor(100000000 + Math.random() * 900000000)}`, // Random phone number
      password: `password${i}`,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  const studentIds = await knex("students").insert(students).returning("id");
  // Insert 10 completed events
  const events = [];

  for (let i = 10; i > 0; i--) {
    // Calculate the start date (Monday) of the week i weeks ago
    const start_date = new Date();
    start_date.setDate(
      start_date.getDate() - i * 7 - ((start_date.getDay() + 6) % 7)
    ); // Move to the previous Monday

    // Calculate the due date (Saturday) of the same week
    const due_date = new Date(start_date);
    due_date.setDate(start_date.getDate() + 5); // Move to Saturday

    // Ensure the due_date is before now
    if (due_date < new Date()) {
      events.push({
        start_date,
        due_date,
        participants_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  await knex("events").insert(events);

  const eventIds = await knex("events").insert(events).returning("id");

  // Insert participation
  const participation = [];
  for (const student of studentIds) {
    const event = eventIds[Math.floor(Math.random() * eventIds.length)];
    participation.push({
      student_id: student.id,
      event_id: event.id,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await knex("participation").insert(participation);

  // Assign 1 winner per event
  const winners = eventIds.map((event) => ({
    student_id: studentIds[Math.floor(Math.random() * studentIds.length)].id,
    event_id: event.id,
    rank: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }));
  await knex("winners").insert(winners);

  //console.log("✅ Seed data inserted successfully!");
};
