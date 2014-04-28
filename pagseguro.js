var hat = require('hat')
var PagSeguroGateway = require('pagseguro');

var PagSeguro = function(store, currency) {
	this.store = store;
	this.currency = currency;
};

PagSeguro.prototype.order = function(items, buyer, urls, fn) {

	fn = fn || function(){};
	this.urls = urls || {};

	// Prepare gateway
	this.gateway = new PagSeguroGateway(this.store.email, this.store.token);
	this.gateway.currency(this.currency || "BRL");

	// Order reference
	var reference = hat();
	this.gateway.reference(this.reference);

	// Buyer information
	this.gateway.buyer({
		name: buyer.name,
		email: buyer.email
	});
	
	// Populate with items
	for(var i = 0; i < items.length; i++) {

		var item = items[i];

		this.gateway.addItem({
			id: item.id,
			description: item.description,
			amount: item.value.toFixed(2).toString(),
			quantity: parseInt(item.quantity)
		});
	}

	// Redir e notification url
	if(this.urls.redirectUrl)
		this.gateway.setRedirectURL("http://www.lojamodelo.com.br/retorno");

	if(this.urls.notificationUrl)
		this.gateway.setNotificationURL("http://www.lojamodelo.com.br/notificacao");

	// Enviando o xml ao pagseguro
	this.gateway.send(function(err, xml) {

		if(err) {
			fn(err);
		}

		else {
			
			var parseString = require('xml2js').parseString;
			parseString(xml, fn);
		}
	});
}

PagSeguro.prototype.receipt = function(notificationCode, notificationType, fn) {
	// TODO: acessar pagseguro para retornar as informacoes da transacao
}

module.exports = PagSeguro;