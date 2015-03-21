Accounts.onCreateUser(function(options, user) {
	var userData = {
		email: determineEmail(user),
		name: options.profile && options.profile.name ? options.profile.name : ''
	};

	if (userData.email) {
		//Meteor.call('sendWelcomeEmail', userData, function(error) {
		//	if (error) {
		//		console.log(error);
		//	}
		//});
	}

	if (options.profile) {
		user.profile = options.profile;
	}

	return user;
});

//Accounts.onLogin(function(result) {
//	// TODO: 데이터 확인용. 삭제할 것
//	/console.dir(result);
//});

var determineEmail = function(user) {
	var email = '';

	if (user.email && user.email.length > 0) {
		email = user.email[0].address;
	} else if (user.services) {
		var services = user.services;

		if (services.facebook) email = services.facebook.email;
		else if (services.github) email = services.github.email;
		else if (services.google) email = services.google.email;
		else if (services.twitter) email = null;
	}

	return email;
};