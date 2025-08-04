// migrations/20250804_create_users.js

export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.bigInteger('id').primary();        // id en bigint (timestamp)
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
}
