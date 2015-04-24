Template.SignIn.onCreated(function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'SignIn')
			Overlay.close();
	});

	this.errors = new ReactiveVar({});
});

Template.SignIn.helpers({
	errorMessages: function() {
		return _.values(Template.instance().errors.get());
	},

	errorClass: function(key) {
		return Template.instance().errors.get()[key] && 'error';
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
		Meteor.loginWithTwitter({requestPermissions: ['email'], loginStyle: 'popup'}, function(error) {
			if (error) {
				console.log(error.reason);
			}
		});
	},

	'click .submit': function(e, tmpl) {
		e.preventDefault();

		var email = tmpl.find('#signin-email').value;
		var password = tmpl.find('#signin-password').value;

		var errors = {};

		if (!email) errors.email = 'Email required';
		if (!password) errors.password = 'Password required';

		Template.instance().errors.set(errors);

		if (_.keys(errors).length) {
			return;
		}

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				return tmpl.errors.set({etc: error.reason});
			}

			Overlay.close();
		})
	}
});
