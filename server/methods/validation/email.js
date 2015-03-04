Future = Npm.require('fibers/future');

Meteor.methods({
	validateEmailAddress: function(email) {
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
	},

	sendWelcomeEmail: function(userData) {
		check(userData, {email: String, name: String});

		SSR.compileTemplate('welcomeEmail', Assets.getText('email/welcome-email.html'));

		var emailTemplate = SSR.render('welcomeEmail', {
			email: userData.email,
			name: userData.name,
			url: 'http://localhost:3000'
		});

		Email.send({
			from: 'Cookking Admin - <caribjin@gmail.com>',
			to: userData.email,
			subject: 'Welcome to Cookking!',
			html: emailTemplate
		});
	}
});
