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
* `ENV`: The environment, `development` or `production`
* `PORT`: The port to expose the HTTP server on
* `SECRET`: A secret used to generate session IDs
* `CLIENT_ID`: the applicantion's client ID
* `CLIENT_SECRET`: the application's client secret
* `REDIRECT`: the OAuth2 redirect URL
* `TOKEN`: the application's bot's token
* `PGHOST`: the host of the PostgreSQL server
* `PGPORT`: the port of the PostgreSQL server
* `PGUSER`: a user
* `PGPASSWORD`: the password for the user
* `PGDATABASE`: the database to use
* `GO_DOCS`: The URL for the documentation
* `GO_INVITE`: The URL to invite the bot
* `GO_SERVER`: The URL to join the bot server
