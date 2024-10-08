## Development

Set up database:
```
# MariaDB
$ docker run --name mysql -p3306:3306 -d -e MARIADB_ROOT_PASSWORD=123456 -e MARIADB_USER=root -e MARIADB_DATABASE=idm -e MARIADB_PASSWORD=Admin@111 mariadb:latest

# MySQL
$ docker run --name mysql -p3306:3306 -d -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_USER=root -e MYSQL_DATABASE=idm -e MYSQL_PASSWORD=Admin@111 mysql:latest
```

> [Access denied for user 'root'@'172.17.0.1'](https://stackoverflow.com/questions/69903716/access-denied-for-user-root172-17-0-1-for-a-mysql-db-running-in-a-local-doc)
> `MYSQL_ROOT_HOST=localhost` should be left out, which then it defaults to `%` else it's not going to match `172.17.0.1`

Connecting to MySQL Server from within the Container:

```
$ docker exec -it mysql mysql -uroot -p
```

When asked, enter the root password.

After you have connected a `mysql` client to the server, you can reset the server root password:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Substitute `password` with the password of your choice. Once the password is reset, the server is ready for use.

Update the `as-api/configs/apiserver.yaml` file and start server:

```
$ go mod tidy
$ go run ./cmd/apiserver --config ./configs/apiserver.yaml
```