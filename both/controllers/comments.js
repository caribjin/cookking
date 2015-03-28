var COMMENTS_LIMIT = 'commentsLimitCount';
var COMMENTS_SUB_COMPLETED = 'commentsSubCompleted';

CommentsController = RouteController.extend({
	option: function() {
		Session.setDefault(COMMENTS_LIMIT, App.settings.defaultCommentsListLimit);

		return {
			sort: {
				createdAt: -1
			},
			limit: Session.get(COMMENTS_LIMIT)
		};
	},

	subscriptions: function() {
		this.commentsSubscribe = Meteor.subscribe('comments', this.params._id, this.option());
	},

	data: function() {
		var self = this;
		return {
			comments: function() {
				return Comments.find({}, self.option());
			},
			ready: self.commentsSubscribe.ready
		}
	},

	action: function() {
		if (this.data().ready()) {
			Session.get(COMMENTS_SUB_COMPLETED, true);
		}
		this.render();
	}
});