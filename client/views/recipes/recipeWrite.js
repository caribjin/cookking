var WriteIngredients,
	WriteDirections = null;

var TAB_KEY = 'recipeWriteShowTab';

Template.RecipeWrite.setTab = function(tab) {
	Session.set(TAB_KEY, tab);
};

Template.RecipeWrite.ingredientAdd = function(type, text) {
	var limitCount = App.settings.ingredientsCountLimit || 20;

	var currentCount = WriteIngredients.find({type: type}).count();

	if (currentCount < limitCount) {
		WriteIngredients.insert({type: type, text: text, createAt: new Date()});
	}
};

Template.RecipeWrite.ingredientRemove = function(docId) {
	WriteIngredients.remove(docId);
};

Template.RecipeWrite.created = function() {
	WriteIngredients = new Meteor.Collection(null);
	WriteDirections = new Meteor.Collection(null);

	Template.RecipeWrite.setTab('basic-info');

	Template.RecipeWrite.ingredientAdd('must', '');
};

Template.RecipeWrite.rendered = function() {
	this.$('.content-scrollable').touchwipe({
		wipeLeft: function() {
			//alert('wipe left');
		},
		wipeRight: function() {
			//alert('wipe right');
		},
		preventDefaultEvents: false
	});
};

Template.RecipeWrite.helpers({
	isActiveTab: function(name) {
		return Session.equals(TAB_KEY, name);
	},

	activeTabClass: function() {
		return Session.get(TAB_KEY);
	},

	categories: function() {
		var categories = Categories.find({}, {sort: {key: 1}}).fetch();

		categories = _.groupBy(categories, function(el, index) {
			return Math.floor(index / 2);
		});

		return _.toArray(categories);
	},

	ingredients: function(type) {
		var items = WriteIngredients.find({type: type}, {sort: {createdAt: 1}}).map(function(doc, index, cursor) {
			return _.extend(doc, {index: index + 1});
		});

		return items;
	}
});

Template.RecipeWrite.events({
	'click .js-show-basic-info': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('basic-info');
	},

	'click .js-show-ingredients': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('ingredients');
	},

	'click .js-show-directions': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('directions');
	},

	'click .js-add-must-ingredient': function(e, tmpl) {
		Template.RecipeWrite.ingredientAdd('must', '');
	},

	'click .js-add-option-ingredient': function(e, tmpl) {
		Template.RecipeWrite.ingredientAdd('option', '');
	},

	'click .js-remove-ingredient': function(e, tmpl) {
		// 필수재료는 최소 1개 이상은 있어야 한다.
		if (this.type !== 'must' || this.index > 1) {
			Template.RecipeWrite.ingredientRemove(this._id);
		}
	}
});

Template.RecipeWrite.destroyed = function() {
	WriteIngredients = null;
	WriteDirections = null;
};