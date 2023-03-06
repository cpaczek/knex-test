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

```shell
node ./index.js cockroachdb // run using cockroach db
```
    
```shell
node ./index.js sqlite // run using sqlite
```