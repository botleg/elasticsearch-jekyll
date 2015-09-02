module.exports = {
	ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: process.env.OPENSHIFT_NODEJS_PORT || 8000,
	hostname: process.env.APPBASE,
	appname: process.env.APPNAME,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	collection: process.env.COLLECTION,

	search: {
		query: {
			multi_match: {
				type: 'best_fields',
				fuzziness: 'AUTO',
				tie_breaker: 0.3,
				fields: ['title', 'text']
			}
		},
		_source: ['title', 'summary']
	}
};