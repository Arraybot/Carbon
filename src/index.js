// Dependencies.
const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

// Middleware components.
const middlewareError = require('./middlewares/error');
const middelwareLogger = require('./middlewares/logger');
const middlewarePanel = require('./middlewares/panel');
const middlewareEndpoints = require('./middlewares/endpoints');

// Routes - API.
const routeAnnouncements = require('./routes/api_announcements');
const routeCustomCommands = require('./routes/api_custom_commands');
const routeDisabledCommands = require('./routes/api_disabled_commands');
const routeFilter = require('./routes/api_filter');
const routeFilterBypass = require('./routes/api_filter_bypass');
const routeGuild = require('./routes/api_guild');

// Routes - Content.
const routeInfo = require('./routes/content_info');
const routeRender = require('./routes/content_render');

// Routes - Core.
const routeLogin = require('./routes/core_login');
const routeLogout = require('./routes/core_logout');

// Routes - OAuth2.
const routeAuthorized = require('./routes/oauth_authorized');

// Routes - Panel.
const routeSelect = require('./routes/panel_select');
const routeConfigure = require('./routes/panel_configure');

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
    store: new FileStore({
        logFn: () => {} // Disable logging.
    }),
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

// Static content.
app.use('/assets/', express.static(path.join(__dirname, 'assets')));

// General page routes.
app.get('/login/', routeLogin);
app.get('/logout/', routeLogout);
app.get('/authorized/', routeAuthorized);
app.get('/select/', routeSelect);
app.get('/panel/', routeRender('panel'));
app.get('/configure/:server/', routeConfigure);
app.get('/info/:page/', routeInfo);
app.get('/', routeRender('index', {
    title: 'Welcome to 2021...',
    subtitle: 'It\'s time to give Arraybot a new look.'
}));

// Set the error handler after everything.
app.use(middlewareError);

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});