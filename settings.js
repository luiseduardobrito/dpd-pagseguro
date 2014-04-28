var Settings = {};

Settings.basicDashboard = {
	
	settings: [{
		name: 'storeEmail',
		type: 'text',
		description: "PagSeguro email for the current store"
	}, {
		name: 'storeToken',
		type: 'text',
		description: "PagSeguro token for the current store"
	}, {
		name: 'currency',
		type: 'text',
		description: "Currency for the transactions. Default: 'BRL'"
	}, {
		name: 'redirUrl',
		type: 'text',
		description: "URL for user redirection after payment flow is complete"
	}, {
		name: 'notificationUrl',
		type: 'text',
		description: "URL for notification after payment is aproved"
	}]
}

Settings.parse = function(config) {

	config = config || {};
	config.currency = config.currency || "BRL";
	return config;
}

module.exports = Settings;