// If the auth overlay is on the screen but the user is logged in,
//   then we have come back from the loginWithTwitter flow,
//   and the user has successfully signed in.
//
// We have to use an autorun for this as callbacks get lost in the
//   redirect flow.
Template.AuthOverlay.created = function() {
	this.autorun(function() {
		if (Meteor.userId() && Overlay.template() === 'AuthOverlay')
			Overlay.close();
	});
}

Template.AuthOverlay.events({
	'click .js-signin': function() {
		Meteor.loginWithTwitter({loginStyle: 'redirect'});
	},

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
});