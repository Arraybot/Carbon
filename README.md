# Arraybot: Carbon

Carbon provides a modern front-end panel for [Arraybot](https://github.com/Arraying/Arraybot).

### Technologies

Client-side:
* HTML
* CSS, using the Bulma framework
* JavaScript

Server-side:
* Node.js
* Express.js
* Pug.js

Data:
* PostgreSQL

### Environment variables

These are the environment variables required to run the application properly:
* `ADMINS`: A list of semicolon separated admin user IDs
* `APP_ID`: The applicantion's client ID
* `APP_SECRET`: The application's client secret
* `BOT_TOKEN`: The application's bot's token
* `COOKIE_SECRET`: A secret used to generate session IDs
* `ENV`: The environment, `development` or `production`
* `GO_DOCS`: The URL for the documentation
* `GO_INVITE`: The URL to invite the bot
* `GO_SERVER`: The URL to join the bot server
* `PGDATABASE`: The database to use
* `PGHOST`: The host of the PostgreSQL server
* `PGPASSWORD`: The password for the user
* `PGPORT`: The port of the PostgreSQL server
* `PGUSER`: A user
* `PORT_MONITOR`: The port the monitor HTTP server runs on
* `PORT_PANEL`: The port to expose the HTTP server on
* `REDIRECT`: The OAuth2 redirect URL
