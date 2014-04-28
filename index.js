var util = require('util');

var internalClient = require('deployd/lib/internal-client');
var Resource = require('deployd/lib/resource')
var UserCollection = require('deployd/lib/resources/user-collection');
var Pagseguro = require("./pagseguro");
var Settings = require("./settings.js");

function PagSeguroResource(name, options) {
	Resource.apply(this, arguments);
}

// Resource Inheritance
util.inherits(PagSeguroResource, Resource);

// Resource settings
PagSeguroResource.events = ["get", "post"];
PagSeguroResource.basicDashboard = Settings.basicDashboard;

// Handle incoming requests
PagSeguroResource.prototype.handle = function (ctx, next) {

	var config = Settings.parse(this.config);

	var urls = {
		redirectUrl: config.redirUrl,
		notificationUrl: config.redirectUrl
	}
	
	this.pagseguro = new Pagseguro({

		email: config.storeEmail, 
		token: config.storeToken

	}, config.currency);

	if (ctx.method === "GET") {

		ctx.dpd.users.me(function(me, err) {

			console.log(me)

			if(err) {
				return ctx.done(err, null);
			}

			else if(!me) {
				ctx.res.statusCode = 403;
				return ctx.done('forbidden');
			}

			ctx.done(me);
		});	
	}

	// Nova transação
	else if (ctx.method === "POST" && this.events.post) {

		var _post = this.events.post;

		// ger user information
		ctx.dpd.users.me(function(me, err) {

			if(err) {
				return ctx.done(err, null);
			}

			else if(!me) {
				ctx.res.statusCode = 403;
				return ctx.done('forbidden');
			}

			var buyer = {
				name: me.name,
				email: me.email
			};

			this.pagseguro.order(ctx.body.items, buyer, urls, function(err, res) {

				if(err) console.log(err)

				var result = {};

				var domain = {

					request: {
						query: ctx.query,
						body: ctx.body
					},

					response: res,

					setResult: function(val) {
						result = val;
					}
				};

				_post.run(ctx, domain, function(err) {
					ctx.done(err, result);
				});
			})
		}); 
	} 

	else {
		next();
	}
}

module.exports = PagSeguroResource;