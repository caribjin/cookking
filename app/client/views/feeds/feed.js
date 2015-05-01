Template.Feed.onRendered(function() {
	var self = this;

	if (Router.current().params.feedId === self.data._id) {
		var $activity = $(self.firstNode);
		var top = $activity.offset().top;
		var $parent = $(self.firstNode).closest('.content-scrollable');
		var parentTop = $parent.offset().top;
		$parent.scrollTop(top - parentTop);
	}
});

Template.Feed.helpers({
	getName: function() {
		return this.writer.name;
	},

	userAvatar: function() {
		return this.writer.avatar || Meteor.settings.public.emptyAvatarImage;
	},

	isDeletable: function() {
		return this.writer.id === Meteor.userId() || App.helpers.isAdmin()
	},

	path: function() {
		//return Router.path('recipe', {_id: this.recipeId}, {query: {feedId: this._id}});
		return Router.path('recipe', {_id: this.recipeId});
	},

	image: function(id) {
		return new FS.File(FeedsImages.findOne(id));
	}
});

Template.Feed.events({
	'click .js-remove': function(e, tmpl) {
		e.preventDefault();

		var self = this;

		App.helpers.confirm(
			'피드 삭제', '피드를 삭제하시겠습니까?', '', true, function() {
				Meteor.call('deleteFeed', self._id, self.imageId, function(error, result) {
					if (error) {
						App.helpers.addNotification('오류가 발생했습니다', null, false, null, 0);
					}
				});
			}
		);
	}
});