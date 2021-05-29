// Dependencies.
const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const database = require('./database');

// Middleware components.
const middlewareApi = require('./middlewares/api');
const middlewareError = require('./middlewares/error');
const middelwareLogger = require('./middlewares/logger');
const middlewarePanel = require('./middlewares/panel');
const middlewareEndpoints = require('./middlewares/endpoints');

// Routes - API.
const routeAnnouncements = require('./routes/api_announcements');
const routeCustomCommands = require('./routes/api_custom_commands');
const routeDisabledCommands = require('./routes/api_disabled_commands');
const routeFilter = require('./routes/api_filter');
const routeGuild = require('./routes/api_guild');
const routeMeta = require('./routes/api_meta');

// Routes - Content.
const routeGo = require('./routes/content_go');
const routeRender = require('./routes/content_render');

// Routes - Core.
const routeLogin = require('./routes/core_login');
const routeLogout = require('./routes/core_logout');

// Routes - OAuth2.
const routeAuthorized = require('./routes/oauth_authorized');

// Routes - Panel.
const routeConfigure = require('./routes/panel_configure');
const routePanel = require('./routes/panel_panel');
const routeSelect = require('./routes/panel_select');

// Environment variables.
const PORT = process.env.PORT || 80;
const SECRET = process.env.SECRET || 'apple sauce';
const ENV = process.env.NODE_ENV || 'development';
const GO_DOCS = process.env.GO_DOCS || '/';
const GO_INVITE = process.env.GO_INVITE || '/';
const GO_SERVER = process.env.GO_SERVER || '/';

// Test database instance.
database.start().then(() => {
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
    // Not actually deprecated but seems to be a TS bug.
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
            maxAge: 345600 * 1000 // 4 days.
        }
    }));

    // Logging middleware.
    app.use(middelwareLogger);

    // The not-so-strict ratelimiter: 20/10s
    let limiterLoose = rateLimit({
        windowMs: 10000,
        max: 20
    });
    // The stricter ratelimiter: 5/5s.
    let limiterStrict = rateLimit({
        windowMs: 5000,
        max: 1
    });

    // Add authentication middelware for the panel and endpoints.
    // They just need to have logged in to Discord to see all the servers they need, so the panel middleware is enough.
    app.use('/select/', middlewarePanel);
    // They need to see the current server (with permission) which is included in the endpoint middleware.
    app.use('/panel/', middlewareEndpoints);
    // The endpoints use the endpoint middleware.
    app.use('/ep/', middlewareApi);
    // Apply different ratelimits.
    app.use('/ep/meta/refresh', limiterStrict);
    app.use('/ep/', limiterLoose);

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

    // Filter routes.
    app.get('/ep/filter/', routeFilter.get);
    app.put('/ep/filter/', routeFilter.put);

    // General guild setting route.
    app.get('/ep/guild/', routeGuild.get);
    app.put('/ep/guild/', routeGuild.put);

    // Global guild information retrieval.
    app.get('/ep/meta/refresh', routeMeta.generatorGet(false));
    app.get('/ep/meta/', routeMeta.generatorGet(true));

    // Static content.
    app.use('/assets/', express.static(path.join(__dirname, 'assets')));

    // Main site content - redirects.
    app.get('/go/docs/', routeGo(GO_DOCS));
    app.get('/go/invite/', routeGo(GO_INVITE));
    app.get('/go/server/', routeGo(GO_SERVER));

    // Core app functionality.
    app.get('/login/', routeLogin);
    app.get('/logout/', routeLogout);

    // OAuth2.
    app.get('/authorized/', routeAuthorized);

    // Panel endpoints.
    app.get('/configure/:server/', routeConfigure);
    app.get('/select/', routeSelect);
    app.get('/panel/', routePanel);
    app.get('/panel/:dash/', routePanel);

    // Index page.
    app.get('/', routeRender('index', {
        title: 'Welcome to 2021...',
        subtitle: 'It\'s time to give Arraybot a new look.'
    }));

    // Set the error handler after everything.
    app.use(middlewareError);

    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
    });
})
.catch(error => {
    console.log('Could not connect to database!');
    console.log(error);
})