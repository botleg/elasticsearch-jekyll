var app = require('koa')(),
	elasticsearch = require('elasticsearch'),
	config = require('./config');

var client = new elasticsearch.Client({
	host: 'https://'+config.username+":"+config.password+"@"+config.hostname,
});

var router = require('./route.js')(client, config);

app.use(function *(next){
	var start = new Date();
	yield next;
	var ms = new Date() - start;
	this.set('X-Response-Time', ms + 'ms');
});

app.use(function *(next){
	var start = new Date();
	yield next;
	var ms = new Date() - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(router.routes())
	.use(router.allowedMethods());

app.listen(config.port, config.ip);