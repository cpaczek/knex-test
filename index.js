// if commandline arg is "cockroachdb", use cockroachdb
// else use sqlite3

const { default: knex } = require("knex");

const knex_sqlite = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
  useNullAsDefault: true,
  debug: false,
});
const knex_cockroach = require("knex")({
  client: "pg",
  version: "9.6",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "knex",
  },
  debug: false,
});

(async () => {
  try {
    await createTable(knex_cockroach);
    await createTable(knex_sqlite);

    let arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push(i.toString());
    }
    await Promise.all(arr.map((i) => addRows(i, knex_cockroach)));
    await Promise.all(arr.map((i) => addRows(i, knex_sqlite)));

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("sqlite");
    await printRows(knex_sqlite);
    console.log("cockroach");
    await printRows(knex_cockroach);

    await knex_cockroach.destroy();
    await knex_sqlite.destroy();
  } catch (e) {
    console.error(e);
  }
})();

async function addRows(blog_id, knex) {
  const trx = await knex.transaction();
  const maxResults = await knex
    .select("comment_id")
    .max("blog_order", { as: "max" })
    .whereIn("comment_id", [1])
    .where({})
    .groupBy("comment_id")
    .from("knex_test")
    .transacting(trx);

  const max = maxResults.length === 0 ? 0 : parseInt(maxResults[0].max) + 1;

  // copy the above insert query and run it using knex
  await knex("knex_test")
    .insert({
      blog_id: blog_id,
      blog_order: max,
      comment_id: 1,
      comment_order: 1,
    })
    .returning("id")
    .transacting(trx);
  await trx.commit();
}

async function createTable(knex) {
  const tableExists = await knex.schema.hasTable("knex_test");
  tableExists ? await knex.schema.dropTable("knex_test") : null;
  await knex.schema.createTable("knex_test", (table) => {
    table.increments("id").notNullable();
    table.integer("blog_id");
    table.integer("comment_id");
    table.integer("blog_order");
    table.integer("comment_order");
  });
}

async function printRows(knex) {
  const rows = await knex.select("*").from("knex_test");
  // print the rows in a nice formatted table
  console.table(rows);
}
