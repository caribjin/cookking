var ERRORS_KEY = 'errors';

Template.ProfileEdit.onCreated(function() {
	Session.set(ERRORS_KEY, {});
});

Template.ProfileEdit.helpers({
	userAvatar: function() {
		return App.helpers.getCurrentUserAvatar('large');
	},

	errorClass: function(key) {
		return Session.get(ERRORS_KEY)[key] && 'error'
	},

	profile: function() {
		return Meteor.user().profile;
	}
});

Template.ProfileEdit.events({
	'click .js-profile-save': function(e, tmpl) {
		var errors = {};

		var nickname = tmpl.find('.nickname').value;
		var introduction = tmpl.find('.introduction').value;

		if (!nickname) errors.nickname = true;

		Session.set(ERRORS_KEY, errors);

		var errorCount = _.keys(errors);

		if (errorCount <= 0) {
			var user = {
				id: Meteor.userId(),
				profile: {
					name: nickname,
					introduction: introduction,
					avatar: ''
				}
			};

			Meteor.call('updateUser', user, function(error, result) {
				if (error) {
					App.helpers.error(error.reason);
				} else {
					App.helpers.addNotification('프로필 정보가 저장되었습니다', '확인');
					history.back();
				}
			});
		}
	},

	'click .js-edit-avatar': function(e, tmpl) {
		//App.helpers.alert('지원하지 않는 기능입니다.', '프로필 이미지 편집 기능은 아직 지원하지 않는 기능입니다', 'info', true);
	}
});