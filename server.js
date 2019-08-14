const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var cors = require('cors');


const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-808177.okta.com/oauth2/default',
    client_id: '0oa143zdd2oP2WEoR357',
    assertClaims: {
        aud: 'api://default',
    },
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
    console.log('INSIDE AUTH');
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        return res.status(401).end();
    }

    const accessToken = match[1];
    const expectedAudience = 'api://default';

    return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience)
        .then((jwt) => {
            req.jwt = jwt;
            next();
        })
        .catch((err) => {
            res.status(401).send(err.message);
        });
}

const app = express();

/**
 * For local testing only!  Enables CORS for all domains
 */
app.use(cors());

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get('/secure', authenticationRequired, (req, res) => {
    res.json(req.jwt);
});

/**
 * Another example route that requires a valid access token for authentication, and
 * print some messages for the user if they are authenticated
 */
app.get('/api/messages', authenticationRequired, (req, res) => {
    console.log('HERE');
    res.status(200).json({
        message: ' This is secret message '
    });
});

app.listen(7000, () => {
    console.log('Serve Ready on port 7000');
});