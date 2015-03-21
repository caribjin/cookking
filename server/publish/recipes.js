Meteor.publish('recipes', function (options) {
	return Recipes.find({deleted: {$exists: false}}, options);
});

Meteor.publish('recipesByIds', function(ids) {
	return Recipes.find({_id: {$in: ids}, deleted: {$exists: false}});
});

Meteor.publish('recipe', function(id) {
	check(id, String);
	return Recipes.find({_id: id, deleted: {$exists: false}});
});

