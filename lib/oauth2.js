/**
 * Module dependencies.
 */
var util = require('util'),
OAuth2Strategy = require('passport-oauth2'),
jwt = require('jsonwebtoken'),
Profile = require('./profile');

    OAuth2Strategy = require('passport-oauth2'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Google authentication strategy authenticates requests by delegating to
 * Google using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Google application's client id
 *   - `clientSecret`  your Google application's client secret
 *   - `callbackURL`   URL to which Google will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new GoogleStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/google/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL =
        options.authorizationURL ||
        'https://login.eveonline.com/v2/oauth/authorize';
    options.tokenURL =
        options.tokenURL || 'https://login.eveonline.com/v2/oauth/token';
    options.state = true;

    OAuth2Strategy.call(this, options, verify);
    this.name = 'eveonline-sso';
    this._oauth2.useAuthorizationHeaderforGET(true);
    this._options = options;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function (req, options) {
    options || (options = {});

    OAuth2Strategy.prototype.authenticate.call(this, req, options);
    options.loginHint = oldHint;
};

/**
 * Retrieve user profile from EVE Online SSO.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`            always set to `eveonline-sso`
 *   - `CharacterID`         the character's ID
 *   - `CharacterName`       the character's Name
 *   - `ExpiresOn`           the token expiration id
 *   - `Scopes`              the token scopes
 *   - `TokenType`           the token type
 *   - `CharacterOwnerHash`  the characters's CharacterOwnerHash will change if the character is transferred to a different user account
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    try {
        var self = this;

        const json = jwt.decode(accessToken);

        var profile = Profile.parse(json, 'Character', self._options.scope);
        profile.provider = 'eveonline-sso';
        profile._raw = accessToken;
        profile._json = json;

        done(null, profile);
    } catch (e) {
        done(e);
    }
};

/**
 * Return extra Google-specific parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
    var params = {};
    if (options.accessType) {
        params['access_type'] = options.accessType;
    }
    if (options.loginHint) {
        params['login_hint'] = options.loginHint;
    }
    if (options.userID) {
        params['user_id'] = options.userID;
    }
    return params;
};

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
