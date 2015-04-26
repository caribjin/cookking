Template.Recipe.onCreated(function() {
	this.currentTab = new ReactiveVar('');
	this.favoritesCount = new ReactiveVar(this.data.favoritesCount || 0);

	if (Router.current().params.feedId)
		Template.Recipe.setTab('feeds');
	else
		Template.Recipe.setTab('recipe');
});

Template.Recipe.onRendered(function() {
	var self = this;

	this.$('.recipe').touchwipe({
		wipeDown: function() {
			if (self.currentTab.get() === 'recipe')
				Template.Recipe.setTab('ingredients', self)
		},
		preventDefaultEvents: false
	});
	this.$('.recipe-information').touchwipe({
		wipeUp: function() {
			if (self.currentTab.get() !== 'recipe')
				Template.Recipe.setTab('recipe', self)
		},
		preventDefaultEvents: false
	});
});

Template.Recipe.setTab = function(tab, templateInstance) {
	if (!templateInstance) templateInstance = Template.instance();

	var lastTab = templateInstance.currentTab.get();
	templateInstance.currentTab.set(tab);

	var $ingredient = $('.ingredient-scrollable');
	var $direction = $('.direction-scrollable');
	var $feed = $('.feed-scrollable');
	var $share = $('.js-share');

	// 패널이 위로 올라갈 때
	var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
	$ingredient.toggleClass('instant', fromRecipe);
	$direction.toggleClass('instant', fromRecipe);
	$feed.toggleClass('instant', fromRecipe);

	// 패널이 밑으로 내려갈 떄
	var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
	$ingredient.toggleClass('delayed', toRecipe);
	$direction.toggleClass('delayed', toRecipe);
	$feed.toggleClass('delayed', toRecipe);

	if (tab === 'feeds') {
		$share.velocity('transition.slideUpIn', {duration: Meteor.settings.public.defaultAnimationDuration});
	} else {
		$share.velocity('transition.slideDownOut', {duration: Meteor.settings.public.defaultAnimationDurationFast});
	}
};

Template.Recipe.helpers({
	isActiveTab: function(name) {
		return Template.instance().currentTab.get() === name;
	},

	isPrivate: function() {
		return !this.public;
	},

	activeTabClass: function() {
		return Template.instance().currentTab.get();
	},

	bookmarked: function() {
		return Meteor.user() && Bookmarks.find({recipeIds: this._id}).count() > 0;
	},

	favorited: function() {
		return Meteor.user() && Favorites.find({recipeIds: this._id}).count() > 0;
	},

	feeds: function() {
		return Feeds.find({recipeId: this._id}, {sort: {createdAt: -1}});
	},

	favoritesCount: function() {
		return Template.instance().favoritesCount.get();
	},

	commentsCount: function() {
		return this.commentsCount || 0;
	},

	sharedCount: function() {
		return this.sharedCount || 0;
	},

	category: function() {
		return Categories.getCategoryName(this.filter);
	},

	deletable: function() {
		if (App.helpers.isAdmin() || this.writer.id === Meteor.userId()) return true;
		else return false;
	},

	avatarImage: function() {
		return this.writer.avatar || Meteor.settings.public.emptyAvatarImage;
	},

	image: function(id) {
		return new FS.File(RecipesImage.findOne(id));
	}
});

Template.Recipe.events({
	'click .js-add-bookmark': function(e) {
		e.stopPropagation();

		Meteor.call('bookmarkRecipe', this._id);
	},

	'click .js-remove-bookmark': function(e) {
		e.stopPropagation();

		Meteor.call('unbookmarkRecipe', this._id);
	},

	'click .js-favorites': function(e, tmpl) {
		e.stopPropagation();

		var templateInstance = Template.instance();

		Meteor.call('favoriteRecipe', this._id, function(error, result) {
			if (!error) {
				templateInstance.favoritesCount.set(result);
				//$('.fa-heart').velocity('pulse');
			}
		});
	},

	'click .js-delete': function(e) {
		e.preventDefault();

		var self = this;

		App.helpers.confirm(
			'레시피 삭제',
			'이 레시피를 영구적으로 삭제하시겠습니까?',
			'', true, function() {
				Meteor.call('deleteRecipe', self._id, function (error, result) {
					if (error) {
						App.helpers.error(error.reason);
					} else {
						if (result) {
							Router.go('/');

							App.helpers.addNotification('삭제되었습니다', '실행취소', function() {
								tx.undo();
							}, 0);
						} else {
							App.helpers.error('일치하는 레시피를 찾을 수 없습니다');
						}
					}
				});
			});
	},

	'click .js-comments': function(e) {
		e.stopPropagation();
		Overlay.open('Comments', this);
	},

	'click .js-share': function(e) {
		_.extend(this, {
			purpose: 'feed'
		});
		e.stopPropagation();
		Overlay.open('Share', this);
	},

	'click .js-show-ingredients': function(e) {
		e.stopPropagation();
		Template.Recipe.setTab('ingredients');
	},

	'click .js-show-directions': function(e) {
		e.stopPropagation();
		Template.Recipe.setTab('directions')
	},

	'click .js-show-feeds': function(e) {
		e.stopPropagation();
		Template.Recipe.setTab('feeds')
	},

	'click .js-recipe': function() {
		Template.Recipe.setTab('recipe')
	}
});

