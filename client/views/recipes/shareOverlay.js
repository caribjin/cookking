var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.ShareOverlay.created = function() {
	Session.set(TWEETING_KEY, true);
	Session.set(IMAGE_KEY, null);
};

Template.ShareOverlay.helpers({
	attachedImage: function() {
		return Session.get(IMAGE_KEY);
	},

	avatarImage: function() {
		return App.helpers.getCurrentUserAvatar() || App.settings.emptyAvatarImage;
	},

	tweeting: function() {
		return Session.get(TWEETING_KEY);
	}
});

Template.ShareOverlay.events({
	'click .js-attach-from-album': function() {
		App.helpers.getPicture('album', function(error, data) {
			if (!error) {
				Session.set(IMAGE_KEY, data);
			}
		});
	},

	'click .js-attach-from-camera': function() {
		App.helpers.getPicture('camera', function(error, data) {
			if (!error) {
				Session.set(IMAGE_KEY, data);
			}
		})
	},

	'click .js-unattach-image': function() {
		Session.set(IMAGE_KEY, null);
	},

	'change [name=tweeting]': function(event) {
		Session.set(TWEETING_KEY, $(event.target).is(':checked'));
	},

	'submit': function(event, template) {
		var self = this;

		event.preventDefault();

		var text = $(event.target).find('[name=text]').val();
		var tweet = Session.get(TWEETING_KEY);

		Meteor.call('createFeed', {
			recipeId: self._id,
			text: text,
			image: Session.get(IMAGE_KEY)
		}, tweet, Geolocation.currentLocation(), function(error, result) {
			if (error) {
				App.helpers.error(error.reason);
			} else {
				App.helpers.addNotification('사진을 공유했습니다', '보기', function() {
					Router.go('recipe', {_id: self._id}, {query: {feedId: result}});
					Template.Recipe.setTab('feed');
				});
			}
		});

		Overlay.close();
	}
});

Template.ShareOverlay.destroyed = function() {
	Session.set(IMAGE_KEY, null);
};
