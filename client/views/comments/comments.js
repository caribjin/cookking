Template.Comments.onCreated(function() {
	this.totalCount = new ReactiveVar();

	var options = {
		sort: {
			createdAt: -1
		},
		limit: 1000
	};

	var self = this;
	setTimeout(function() {
		self.subscribe('comments', self.data._id, options);
	}, 400);
	//this.subscribe('comments', this.data._id, options);
});

Template.Comments.onRendered(function() {
});

Template.Comments.helpers({
	comments: function() {
		var result = Comments.find({recipeId: this._id}, {sort: {createdAt: -1}});
		Template.instance().totalCount.set(result.count());

		return result;
	},

	userAvatar: function() {
		return this.writer.avatar || App.settings.emptyAvatarImage;
	},

	totalCount: function() {
		return Template.instance().totalCount.get();
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
					id: Meteor.userId(),
					name: App.helpers.getCurrentUserName(),
					avatar: App.helpers.getCurrentUserAvatar()
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
						App.helpers.addNotification('오류가 발생했습니다', '확인', null, 0);
					}
				});
			}
		);
	}
});