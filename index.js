// if commandline arg is "cockroachdb", use cockroachdb
// else use sqlite3
let knex;
if (process.argv[2] === "sqlite") {
  console.log("Using sqlite3");
  knex = require("knex")({
    client: "sqlite3",
    connection: {
      filename: "./mydb.sqlite",
    },
    debug: true,
  });
} else {
  console.log("Using cockroachdb");
  knex = require("knex")({
    client: "cockroachdb",
    connection: {
      host: "127.0.0.1",
      port: 26257,
      user: "root",
      password: "",
      database: "knex",
    },
    debug: true,
  });
}

useNullAsDefault: true,
  (async () => {
    try {
      // check if table exists
      const tableExists = await knex.schema.hasTable("knex_test");
      tableExists ? await knex.schema.dropTable("knex_test") : null;
      await knex.schema.createTable("knex_test", (table) => {
        table.increments("id").notNullable();
        table.integer("blog_id");
        table.integer("comment_id");
        table.integer("blog_order");
        table.integer("comment_order");
      });

      let arr = [];
      for (let i = 0; i < 100; i++) {
        arr.push(i.toString());
      }
      Promise.all(arr.map((i) => addRows(i)));

      // Finally, add a catch statement
    } catch (e) {
      console.error(e);
    }
  })();

async function addRows(blog_id) {
  const trx = await knex.transaction();
  const maxResults = await knex
    .select("comment_id")
    .max("blog_order", { as: "max" })
    .whereIn("comment_id", [1])
    .where({})
    .groupBy("comment_id")
    .from("knex_test")
    .transacting(trx);

  console.log("maxResults", maxResults);
  const max = maxResults.length === 0 ? 0 : parseInt(maxResults[0].max) + 1;
  console.log("max", max);

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

  trx.commit();
}
