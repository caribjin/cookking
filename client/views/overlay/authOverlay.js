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
		//Meteor.loginWithTwitter({loginStyle: 'redirect'});
	}
});