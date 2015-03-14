Meteor.publish('recipes', function (options) {
	return Recipes.find({}, options);
});

Meteor.publish('recipesByIds', function(ids) {
	return Recipes.find({_id: {$in: ids}});
});

Meteor.publish('recipe', function(id) {
	check(id, String);
	return Recipes.find(id);
});

