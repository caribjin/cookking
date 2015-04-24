Template.Settings.onRendered(function() {
});

Template.Settings.helpers({
	versionNumber: function() {
		return App.helpers.version();
	}
});

Template.Settings.events({
	'click .js-profile': function(e, tmpl) {
		Router.go('profile.edit');
	},

	'click .js-signout': function(e, tmpl) {
		App.helpers.confirm('로그아웃 하시겠습니까?',
			'시스템에서 로그아웃합니다', '', true, function() {
			Router.go('signout');
		});
	}
});