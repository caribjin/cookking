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

	sendSignupWelcomeEmail: function(userData) {
		check(userData, {email: String, name: String});

		SSR.compileTemplate('welcomeEmail', Assets.getText('email/welcome-email.html'));

		var emailTemplate = SSR.render('welcomeEmail', {
			email: userData.email,
			name: userData.name,
			url: 'http://cookking.devcrow.com'
		});

		Email.send({
			from: 'Cookking Admin - <caribjin@gmail.com>',
			to: userData.email,
			subject: '쿡킹에 오신것을 환영합니다!',
			html: emailTemplate
		});
	}
});
