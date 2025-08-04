export async function up(knex) {
  // users
  await knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary(); // id auto-incrémenté
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('name');
  });

  // todos
  await knex.schema.createTable('todos', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.boolean('status').defaultTo(false);
    table.text('description');
    table.text('date');
    table.integer('user_id')
         .unsigned()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE')
         .onUpdate('CASCADE');
  });

  // codes
  await knex.schema.createTable('codes', (table) => {
    table.string('mail', 50).primary();
    table.integer('code').notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('codes');
  await knex.schema.dropTableIfExists('todos');
  await knex.schema.dropTableIfExists('users');
}
