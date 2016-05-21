'use strict';

var hapi   = require('hapi'),
	mol    = require('../'),
	sol    = require('hapi-sol'),
	server = new hapi.Server({ debug: { request: ['error'] } });


server.connection({port: 8000});

server.register([sol, mol], function (err){
	if (err) {
		throw err;
	}
	var App = {
		models: {},
		controllers: {}
	};

	server.auth.strategy('session', 'session', true, {
		redirectTo: '/login',
		isSecure: false
	});

	server.plugins.mol.load('models', App.models, function (path, base, ext, scope){
		scope[base] = require(path);
	}).then(function (){
		return server.plugins.mol.load('controllers', App.controllers, function (path, base, ext, scope, parts){
				var prefix,
					controller = require(path);
				scope[base] = controller;
				if (controller.setScope) {
					controller.setScope(App);
				}
				if (parts[0] === 'api') {
					prefix = parts.concat(base).join('/');
					controller.forEach(function (route){
						route.path = '/' + prefix + route.path;
					});
				}
				server.route(controller);
			});
	}).then(server.start.bind(server, function (err) {
		if (err) {
			console.error(err);
		} else {
			console.log('Server running at localhost:8000');
		}
	}));
});
