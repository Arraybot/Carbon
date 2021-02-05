// Dependencies.
const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const oauth = require('./oauth');

// Middleware components.
const middlewareError = require('./middlewares/error');
const middelwareLogger = require('./middlewares/logger');
const middlewarePanel = require('./middlewares/panel');
const middlewareEndpoints = require('./middlewares/endpoints');

// Routes.
const routeAnnouncements = require('./routes/announcements');
const routeCustomCommands = require('./routes/custom_commands');
const routeDisabledCommands = require('./routes/disabled_commands');
const routeFilter = require('./routes/filter');
const routeFilterBypass = require('./routes/filter_bypass');
const routeGuild = require('./routes/guild');
const routeInfo = require('./routes/info');
const routeAuthorized = require('./routes/authorized');
const routeLogin = require('./routes/login');
const routeRender = require('./routes/render');
const routeSelect = require('./routes/select');

// Environment variables.
const PORT = process.env.PORT || 80;
const SECRET = process.env.SECRET || 'apple sauce';
const ENV = process.env.NODE_ENV || 'development';

// Create app instance.
const app = express();

// Using Pug as the view engine.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// We're probably running behind a proxy.
if (ENV === 'production') {
    // Explicitly allow the proxy.
    app.set('trust proxy', 1);
}

// Allow for form + JSON bodies.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware.
app.use(session({
    store: new FileStore(),
    name: 'sid',
    secret: SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}));

// Logging middleware.
app.use(middelwareLogger);

// Add authentication middelware for the panel and endpoints.
// They just need to have logged in to Discord to see all the servers they need, so the panel middleware is enough.
app.use('/select/', middlewarePanel);
// They need to see the current server (with permission) which is included in the endpoint middleware.
app.use('/panel/', middlewareEndpoints);
// The endpoints use the endpoint middleware.
app.use('/ep/', middlewareEndpoints);

// Announcement related routes.
app.get('/ep/announcements/', routeAnnouncements.get);
app.post('/ep/announcements/', routeAnnouncements.post);
app.delete('/ep/announcements/', routeAnnouncements.delete);

// Custom command related routes.
app.get('/ep/customcommands/', routeCustomCommands.get);
app.post('/ep/customcommands/', routeCustomCommands.post);
app.put('/ep/customcommands/', routeCustomCommands.put);
app.delete('/ep/customcommands/', routeCustomCommands.delete);

// Disabled command related routes.
app.get('/ep/disabledcommands/', routeDisabledCommands.get);
app.post('/ep/disabledcommands/', routeDisabledCommands.post);
app.delete('/ep/disabledcommands/', routeDisabledCommands.delete);

// Filter bypass routes.
app.get('/ep/filterbypass/', routeFilterBypass.get);
app.post('/ep/filterbypass/', routeFilterBypass.get);
app.delete('/ep/filterbypass/', routeFilterBypass.get);

// Filter routes.
app.get('/ep/filter/', routeFilter.get);
app.post('/ep/filter/', routeFilter.post);
app.delete('/ep/filter/', routeFilter.delete);

// General guild setting route.
app.put('/ep/guild/', routeGuild.put);

// General page routes.
app.get('/login/', routeLogin);
app.get('/authorized/', routeAuthorized);
app.get('/select/', routeSelect);
app.get('/panel/', routeRender('panel'));
app.get('/info/:page', routeInfo);
app.get('/', routeRender('index'));

// Set the error handler after everything.
app.use(middlewareError);

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});