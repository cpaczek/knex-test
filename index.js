const knex = require('knex')({
    client: 'cockroachdb',
    connection: {
        host : '127.0.0.1',
        port : 26257,
        user : 'root',
        password : '',
        database : 'knex'
    },
    debug: true
});
(async () => {
try {
    await knex.schema
        .createTable('knex_test', table => {
            table.increments('id').notNullable();
            table.string('user_name');
        })
    await knex.schema.alterTable('knex_test', table => {
        table.increments('id').alter({ alterNullable: false, alterType: true });
    })

    // Finally, add a catch statement
} catch(e) {
    console.error(e);
}
})();
