Template.Login.events({
	'submit #login': function(e, tmpl) {
		var username = tmpl.find('#login-username').value;
		var password = tmpl.find('#login-password').value;

		Meteor.loginWithPassword(username, password, function(error) {
			if (Meteor.user()) {
				Router.go('home');
			} else {
				var message = 'There was an error logging in: <strong>';
				tmpl.find('#form-messages').html(message);
			}

			return;
		});

		return false;
	}
})