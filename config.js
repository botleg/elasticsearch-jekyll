module.exports = {
	ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	port: process.env.OPENSHIFT_NODEJS_PORT || 8000,
	hostname: process.env.APPBASE,
	appname: process.env.APPNAME,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	collection: process.env.COLLECTION,
};