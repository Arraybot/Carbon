// Dependency.
const DiscordOAuth2 = require('discord-oauth2');

// Environment variables.
const CLIENT_ID = process.env.CLIENT_ID || 'abc';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'def';
const REDIRECT = process.env.REDIRECT || 'http://localhost/authorized';

// Create the OAuth2 client.
const client = new DiscordOAuth2({
    version: 'v8',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT
});

module.exports = client;