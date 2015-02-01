'use strict';

module.exports = [{
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			reply('<h1>Hello world</h1>');
		}
	}, {
		method : 'GET',
		path   : '/{name}',
		handler: function (request, reply) {
			reply('<h1>Hello ' + request.params.name + '</h1>');
		}
}];