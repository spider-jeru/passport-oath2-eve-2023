# Passport strategy for EVE Online SSO OAuth 2.0

[Passport](http://passportjs.org/) strategies for authenticating with [EVE Online](http://www.eveonline.com/)
using ONLY OAuth 2.0.

This module lets you authenticate using EVE Online SSO in your Node.js applications.
By plugging into Passport, EVE Online SSO authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-eveonline-oauth2-2023

## Usage of OAuth 2.0

#### Create an Application

Before using `passport-eveonline-sso`, you must register your application with
[EVE Online Developers site](https://developers.eveonline.com/)

You will also need to configure an Endpoint redirect URI (`callbackURL`) and scopes your application has access to.

#### Configure Strategy

The EVE Online SSO authentication strategy authenticates users using a EVE Online
account and OAuth 2.0 tokens.  The clientID and clientSecret obtained when creating an application are supplied as options when creating the strategy.  The strategy also requires a `verify` callback, which receives the access token and optional refresh token, as well as `profile` which contains the authenticated user's profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new EveOnlineSsoStrategy({
    clientID: EVEONLINE_CLIENT_ID,
    clientSecret: EVEONLINE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/eveonline'
    scope: ''
  },
  function(accessToken, refreshToken, profile, cb) {
    // We have a new authenticated session, you can now store and/or use the accessToken and refreshToken to call EVE Swagger Interface (ESI) end points.

    return done(null, profile);
  }
));
```

#### Note about Local environment

Avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication.

A workaround consist to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ for the callback
then edit your /etc/hosts on your computer and/or vm to point on your private IP.

Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and it will lead to lost your session

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eveonline-sso'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/eveonline',
  passport.authenticate('eveonline-sso'));

app.get( '/auth/eveonline/callback',
	passport.authenticate( 'eveonline-sso', {
		successRedirect: '/auth/eveonline/success',
		failureRedirect: '/auth/eveonline/failure'
}));
```

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)
  - [Johnny Splunk](http://github.com/johnnysplunk)
  - [Spider Jerusalem](https://github.com/spider-jeru)

## License

[The MIT License](http://opensource.org/licenses/MIT)

