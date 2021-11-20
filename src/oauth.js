// Dependency.
const DiscordOAuth2 = require('discord-oauth2');

// Environment variables.
const APP_ID = process.env.APP_ID || '123';
const APP_SECRET = process.env.APP_SECRET || 'def';
const REDIRECT = process.env.REDIRECT || 'http://localhost/authorized';

// Create the OAuth2 client.
const client = new DiscordOAuth2({
    version: 'v8',
    clientId: APP_ID,
    clientSecret: APP_SECRET,
    redirectUri: REDIRECT
});

module.exports = client;