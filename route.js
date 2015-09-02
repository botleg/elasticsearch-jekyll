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

	router.get('/search/:q', function*(next) {
		config.search.query.multi_match.query = this.params.q;
		var result = [];

		var state = yield client.search({
			index: config.appname,
			body: config.search
		});

		for (var item of state.hits.hits) {
			item._source.id = item._id;
			result.push(item._source);
		}

		this.set('Access-Control-Allow-Origin', '*');
		this.set('Cache-Control', 'max-age=3600');
		this.type = 'application/json';
		this.body = result;
	});

	return router;
};