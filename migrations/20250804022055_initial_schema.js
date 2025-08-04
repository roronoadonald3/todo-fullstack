// ./migrations/20250804_initial_schema.js

export function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('name');
    })
    .createTable('todos', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.boolean('status').defaultTo(false);
      table.string('date');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.text('description');
    })
    .createTable('codes', (table) => {
      table.string('mail', 50).primary();
      table.integer('code').notNullable();
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('codes')
    .dropTableIfExists('todos')
    .dropTableIfExists('users');
}
