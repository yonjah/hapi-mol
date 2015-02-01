'use strict';
var scope;

function setScope (newScope) {
	scope = newScope;
}

function getModel() {
	return scope.models.user;
}
module.exports = [{
	method: ['POST', 'GET'],
	path: '/login',
	config: {
		handler: function (request, reply) {
			var message = '',
				account = null;

			if (request.auth.isAuthenticated) {
				return reply.redirect('/');
			}

			if (request.method === 'post') {

				if (!request.payload.username || !request.payload.password) {
					message = 'Missing username or password';
				} else {
					account = getModel().findBy('name', request.payload.username);
					if (!account || account.password !== request.payload.password) {
						message = 'Invalid username or password';
					}
				}
			}

			if (request.method === 'get' || message) {
				return reply('<html><head><title>Login page</title></head><body>' + (message ? '<h3>' + message + '</h3><br/>' : '') + '<form method="post" action="/login">' + 'Username: <input type="text" name="username"><br>' + 'Password: <input type="password" name="password"><br/>' + '<input type="submit" value="Login"></form></body></html>');
			} else {
				return request.auth.session.set(account, function () {
					return reply.redirect('/');
				});
			}
		},
		auth: {
			mode: 'try'
		},
		plugins: {
			'sol': {
				redirectTo: false
			}
		}
	}
}, {
	method : 'GET',
	path   : '/logout',
	handler: function (request, reply) {
		return request.auth.session.clear(function () {
			return reply.redirect('/');
		});
	}
}];

module.exports.setScope = setScope;