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
	firstName: function() {
		return this.writer.name;
	},

	userAvatar: function() {
		return this.writer.avatar || Meteor.settings.public.emptyAvatarImage;
	},

	path: function() {
		return Router.path('recipe', {_id: this.recipeId}, {query: {feedId: this._id}});
	},

	image: function(id) {
		return new FS.File(FeedsImages.findOne(id));
	}
});