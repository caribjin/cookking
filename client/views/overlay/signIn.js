var ERRORS_KEY = 'signinErrors';

Template.SignIn.onCreated(function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'SignIn')
			Overlay.close();
	});

	Session.set(ERRORS_KEY, {});
});

Template.SignIn.helpers({
	errorMessages: function() {
		return _.values(Session.get(ERRORS_KEY));
	},

	errorClass: function(key) {
		return Session.get(ERRORS_KEY)[key] && 'error';
	}
});

Template.SignIn.events({
	'click .btn-facebook': function() {
		Meteor.loginWithFacebook({requestPermissions: ['email']}, function(error) {
			if (error) {
				console.log(error.reason);
			}
		});
	},

	'click .btn-github': function() {
		Meteor.loginWithGithub({requestPermissions: ['email']}, function(error) {
			if (error) {
				console.log(error.reason);
			}
		});
	},

	'click .btn-google': function() {
		Meteor.loginWithGoogle({requestPermissions: ['email']}, function(error) {
			if (error) {
				console.log(error.reason);
			}
		});
	},

	'click .btn-twitter': function() {
		//Meteor.loginWithTwitter({loginStyle: 'redirect'});
		Meteor.loginWithTwitter(function(error) {
			if (error) {
				console.log(error.reason);
			}
		});
	},

	'submit': function(e, tmpl) {
		e.preventDefault();

		var email = tmpl.find('#signin-email').value;
		var password = tmpl.find('#signin-password').value;

		var errors = {};

		if (!email) errors.email = 'Email required';
		if (!password) errors.password = 'Password required';

		Session.set(ERRORS_KEY, errors);

		if (_.keys(errors).length) {
			return;
		}

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				return Session.set(ERRORS_KEY, {'none': error.reason});
			}

			Overlay.close();
		})
	}
});
