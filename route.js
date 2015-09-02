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

	router.post('/commit', koaBody, function*(next) {
		if (typeof this.request.body.commits !== 'undefined') {
			for (var commit of this.request.body.commits) {
				for (var add of commit.added) {
					if (add.indexOf('_posts/') > -1) {
						var text = yield request(config.baseurl + add);
						yield client.index({
							index: config.appname,
							type: config.collection,
							id: add.substring(18, add.length - 9),
							body: {
								title: text.body.split('\n')[2].slice(7),
								summary: text.body.split('\n')[1].slice(9),
								text: text.body,
								comments: []
							}
						});
					}
				}

				for (var add of commit.removed) {
					if (add.indexOf('_posts/') > -1) {
						yield client.delete({
							index: config.appname,
							type: config.collection,
							id: add.substring(18, add.length - 9)
						});
					}
				}

				for (var add of commit.modified) {
					if (add.indexOf('_posts/') > -1) {
						var text = yield request(config.baseurl + add);
						yield client.update({
							index: config.appname,
							type: config.collection,
							id: add.substring(18, add.length - 9),
							body: {
								doc: {
									title: text.body.split('\n')[2].slice(7),
									text: text.body,
									summary: text.body.split('\n')[1].slice(9)
								}
							}
						});
					}
				}
			}
		}
		this.body = true;
	});

	return router;
};