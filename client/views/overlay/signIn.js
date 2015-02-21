var ERRORS_KEY = 'signinErrors';

Template.SignIn.created = function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'SignIn')
			Overlay.close();
	});

	Session.set(ERRORS_KEY, {});
};

Template.SignIn.helpers({
	errorMessages: function() {
		return _.values(Session.get(ERRORS_KEY));
	},

	errorClass: function(key) {
		return Session.get(ERRORS_KEY)[key] && 'error';
	}
});

Template.SignIn.events({
	'click .js-signin': function() {
		Meteor.loginWithTwitter({loginStyle: 'redirect'});
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