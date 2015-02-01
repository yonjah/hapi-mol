'use strict';
var scope;

function setScope (newScope) {
	scope = newScope;
}

function getModel() {
	return scope.models.user;
}

module.exports = [{
	method: 'GET',
	path: '/me',
	handler: function (request, reply) {
		var user = getModel().findBy('id', request.auth.credentials.id);
		user.password = null;
		reply(user);
	}
}];

module.exports.setScope = setScope;