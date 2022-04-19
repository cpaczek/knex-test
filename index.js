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
const {isNil, prop, omit, castArray} = require('lodash/fp');
(async () => {
try {
    let object = {
        name: 'id',
        type: 'increments',
        args: [ { primary: true, primaryKey: true } ],
        defaultTo: null,
        notNullable: true,
        unsigned: false
    }
    // Create a table
    await knex.schema
        .createTable('knex_test', table => {
            table.increments('id').notNullable();
            table.string('user_name');
        })
        // ...and another

    await knex.schema.alterTable('knex_test', table => {
        createColumn(table, object).alter({ alterNullable: false, alterType: true });
    })

    // Finally, add a catch statement
} catch(e) {
    console.error(e);
}
})();

const createColumn = (tableBuilder, column) => {
    const { type, name, args = [], defaultTo, unsigned, notNullable } = column;

    const col = tableBuilder[type](name, ...args);

    if (unsigned === true) {
        col.unsigned();
    }
    //
    if (!isNil(defaultTo)) {
        const [value, opts] = castArray(defaultTo);

        if (prop('isRaw', opts)) {
            col.defaultTo(db.connection.raw(value), omit('isRaw', opts));
        } else {
            col.defaultTo(value, opts);
        }
    }
    if (notNullable === true) {
        col.notNullable();
    } else {
        col.nullable();
    }

    return col;
};
