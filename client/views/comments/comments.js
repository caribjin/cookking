var COMMENTS_LIMIT = 'commentsLimitCount';
var COMMENTS_SUB_COMPLETED = 'commentsSubCompleted';

Template.Comments.onCreated(function() {
	Session.setDefault(COMMENTS_LIMIT, App.settings.defaultCommentsListLimit);

	this.data.totalCount = new ReactiveVar();

	var options = {
		sort: {
			createdAt: -1
		},
		limit: 1000 //Session.get(COMMENTS_LIMIT)
	};

	this.subscribe('comments', this.data._id, options);
});

Template.Comments.helpers({
	comments: function() {
		var result = Comments.find({recipeId: this._id}, {sort: {createdAt: -1}});
		this.totalCount.set(result.count());

		return result;
	},

	totalCount: function() {
		return this.totalCount.get();
	},

	isDeletable: function() {
		return this.writer.userId === Meteor.userId() || App.helpers.isAdmin()
	}
});

Template.Comments.events({
	'keypress .text-comment': function(e, tmpl) {
		if (e.keyCode === 13) $('#btn-submit').click();
	},

	'click #btn-submit': function(e, tmpl) {
		e.preventDefault();

		var text = tmpl.find('.text-comment').value;

		if (text) {
			var comment = {
				recipeId: this._id,
				writer: {
					userId: Meteor.userId(),
					userName: App.helpers.getCurrentUserName(),
					userAvatar: App.helpers.getCurrentUserAvatar()
				},
				text: text
			};

			Meteor.call('createComment', comment, function(error, result) {
				if (error) {
					App.helpers.error(error.reason);
				} else if (!result) {
					App.helpers.error('알 수 없는 오류가 발생했습니다');
				}

				tmpl.find('.text-comment').value = '';
			});
		}
	},

	'click .js-remove': function(e, tmpl) {
		e.preventDefault();

		var self = this;

		App.helpers.confirm(
			'이 댓글을 삭제하시겠습니까?', '', 'warning', true, function() {
				Meteor.call('deleteComment', self._id, self.recipeId, function(error, result) {
					if (error) {
						App.helpers.addNotification('오류가 발생했습니다', '확인', function() {}, 0);
					}
				});
			}
		);
	}
});