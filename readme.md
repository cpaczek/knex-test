Create CRDB in a docker container
```shell
docker volume create roach-single
```
```shell
docker run --name=roach-single -p 26257:26257 -p 8080:8080 -v "roach-single:/cockroach/cockroach-data" cockroachdb/cockroach:latest start-single-node --insecure
```

Get an SQL shell
```shell
docker exec -it roach-single ./cockroach sql --url="postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable"
```

Run the test

Create a `knex` database. 

This will run the same exact code on sqlite and cockroach db and print out the amount of rows that get added. As you will see only 12(ish) rows get added to cockroach db. whereas 100 rows get added to sqlite. 


```shell
node ./index.js
```
