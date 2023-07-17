var vows = require('vows');
var assert = require('assert');
var util = require('util');
var EveStrategy = require('../');

vows.describe('EVEStrategy')
    .addBatch({
        strategy: {
            topic: function () {
                return new EveStrategy(
                    {
                        clientID: 'ABC123',
                        clientSecret: 'secret',
                    },
                    function () {}
                );
            },

            'should be named eveonline-sso': function (strategy) {
                assert.equal(strategy.name, 'eveonline-sso');
            },
        },

        'strategy authorization params': {
            topic: function () {
                return new EveStrategy(
                    {
                        clientID: 'ABC123',
                        clientSecret: 'secret',
                    },
                    function () {}
                );
            },

            'should return empty object when parsing invalid options':
                function (strategy) {
                    var params = strategy.authorizationParams({ foo: 'bar' });
                    assert.lengthOf(Object.keys(params), 0);
                },
            'should return access_type': function (strategy) {
                var params = strategy.authorizationParams({
                    accessType: 'offline',
                });
                assert.equal(params.access_type, 'offline');
            },
            'should return user_id': function (strategy) {
                var params = strategy.authorizationParams({
                    userID: 'bobby',
                });
                assert.equal(params.user_id, 'bobby');
            },
        },
    })
    .export(module);
