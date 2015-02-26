Future = Npm.require('fibers/future');

Meteor.methods({
	validateEmailAddress: function (email) {
		check(email, String);

		var f = new Future();

		HTTP.call('GET', Meteor.settings.mailgun.uri, {
			auth: 'api:' + Meteor.settings.mailgun.pubkey,
			params: {
				address: email
			}
		}, function(error, response) {
			if (!error && response.statusCode == 200) {
				return f.return(response.data);
			} else {
				f.throw(error);
			}
		});

		return f.wait();
	}
});