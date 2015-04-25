Template.SignUp.onCreated(function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'SignUp')
			Overlay.close();
	});

	this.errors = new ReactiveVar({});
});

Template.SignUp.helpers({
	errorMessages: function() {
		return _.values(Template.instance().errors.get());
	},

	errorClass: function(key) {
		return Template.instance().errors.get()[key] && 'error';
	}
});

Template.SignUp.events({
	'click .submit': function(e, tmpl) {
		e.preventDefault();

		var email = tmpl.find('#signup-email').value;
		var password = tmpl.find('#signup-password').value;
		var repassword = tmpl.find('#signup-repassword').value;

		var errors = {};

		if (!email) {
			errors.email = 'Email required';
		} else {
			if (!App.helpers.validateFormatEmail(email)) {
				errors.email = 'Invalid email format';
			}
		}
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

		Template.instance().errors.set(errors);

		if (_.keys(errors).length) return;

		Meteor.call('validateEmailAddress', email, function(error, response) {
			if (error) {
				errors.etc = error.reason;
			} else if (response) {
				if (!response.is_valid) {
					if (response.parts && !response.parts.domain) {
						errors.email = 'Not exist doamin';
					} else {
						errors.email = 'Email is invalid value';
					}

					if (response.did_you_mean) {
						errors.email += '. Did you mean ' + response.did_you_mean + '?';
					}
				}
			} else {
				errors.etc = 'Unknown Error';
			}

			tmpl.errors.set(errors);

			if (_.keys(errors).length) return;

			var user = {
				email: email,
				password: password
			};

			Accounts.createUser(user, function(error) {
				if (error) {
					return tmpl.errors.set({etc: error.reason});
				}

				Overlay.close();
			});
		});
	}
});
