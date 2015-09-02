var router = require('koa-router')(),
	koaBody = require('koa-body')(),
	request = require('co-request');

module.exports = function(client, config) {
	router.get('/', function*(next) {
		this.body = null;
	});

	router.get('/count', function*(next) {
		this.body = yield client.count({
			index: config.appname
		});
	});

	return router;
};