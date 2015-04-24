Accounts.onCreateUser(function(options, user) {
	var userEmail = determineEmail(user);
	var avatar = '';

	if (!options.profile || !options.profile.name) {
		options.profile = {
			name: userEmail.substring(0, userEmail.indexOf('@'))
		};
	}

	if (user.services.twitter) {
		avatar = user.services.twitter.profile_image_url_https;
	} else if (user.services.google) {
		avatar = user.services.google.picture;
	}

	options.profile.avatar = avatar;
	options.profile.role = Meteor.users.find().count() === 0 ? 'admin' : 'user';        // 최초 등록자라면 관리자로 저정

	user.profile = options.profile;

	sendSignupWelcomeEmail(userEmail, options);;

	return user;
});

//Accounts.onLogin(function(result) {
//	// TODO: 데이터 확인용. 삭제할 것
//	/console.dir(result);
//});

var sendSignupWelcomeEmail = function(email, options) {
	var userData = {
		email: email,
		name: options.profile.name
	};

	if (userData.email) {
		if (Meteor.settings.app.sendSignupWelcomeEmail) {
			Meteor.call('sendSignupWelcomeEmail', userData, function (error) {
				if (error) {
					console.log(error);
				}
			});
		}
	}
}

var determineEmail = function(user) {
	var email = '';

	if (user.emails && user.emails.length > 0) {
		email = user.emails[0].address;
	} else if (user.services) {
		var services = user.services;

		if (services.facebook) email = services.facebook.email;
		else if (services.github) email = services.github.email;
		else if (services.google) email = services.google.email;
		else if (services.twitter) email = null;
	}

	return email;
};