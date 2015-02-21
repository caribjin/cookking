var ERRORS_KEY = 'signupErrors';

Template.SignUp.created = function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'SignUp')
			Overlay.close();
	});

	Session.set(ERRORS_KEY, {});
};

Template.SignUp.helpers({
	errorMessages: function() {
		return _.values(Session.get(ERRORS_KEY));
	},

	errorClass: function(key) {
		return Session.get(ERRORS_KEY)[key] && 'error';
	}
});

Template.SignUp.events({
	'submit': function(e, tmpl) {
		e.preventDefault();

		var email = tmpl.find('#signup-email').value;
		var password = tmpl.find('#signup-password').value;
		var repassword = tmpl.find('#signup-repassword').value;

		var errors = {};

		if (!email) errors.email = 'Email required';
		if (!password) {
			errors.password = 'Password required';
		} else {
			if (password !== repassword) errors.repassword = 'Please confirm your password';
			else {
				var passwordTest = new RegExp("(?=.{6,}).*", "g");
				if (passwordTest.test(password) == false) {
					errors.password = 'Your password is too weak';
				}
			}
		}

		Session.set(ERRORS_KEY, errors);

		if (_.keys(errors).length) {
			return;
		}

		var user = {
			email: email,
			password: password
		};

		Accounts.createUser(user, function(error) {
			if (error) {
				return Session.set(ERRORS_KEY, {'none': error.reason});
			}

			Overlay.close();
		});
	}
});
