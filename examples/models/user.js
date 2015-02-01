'use strict';

var hoek    =  require('hoek'),
	STORAGE = [
		{id: 1, name: 'alice', password: 'password'},
		{id: 2, name: 'bob',   password: 'password1'}
	];


module.exports = {
	findBy: function userFindBy (param, value) {
		return  STORAGE.reduce(function (res, item) {
			return res || (item[param] === value && hoek.clone(item));
		}, false) || null;
	}
};