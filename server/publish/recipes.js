Meteor.publish('recipes', function (options) {
	check(options, {
		sort: {
			highlighted: Number,
			createdAt: Number
		},
		limit: Number
	});

	if (options.limit > Recipes.find().count()) {
		options.limit = 0;
	}

	var self = this;
	var handles = {};

	handles['recipes'] = Recipes.find({deleted: {$exists: false}}, options).observe({
		added: function(recipe) {
			self.added('recipes', recipe._id, recipe);

			handles['images'] = Images.find(recipe.imageId).observe({
				added: function(image) {
					self.added('recipesImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('recipesImage', image._id, image);
				},
				removed: function(image) {
					self.removed('recipesImage', image._id);
				}
			})
		},
		removed: function(recipe) {
			self.removed('recipes', recipe._id);

			handles['images'] && handles['images'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});

Meteor.publish('recipesByIds', function(ids) {
	check(ids, String);

	var self = this;
	var handles = {};

	handles['recipes'] = Recipes.find({_id: {$in: ids}, deleted: {$exists: false}}).observe({
		added: function(recipe) {
			self.added('recipes', recipe._id, recipe);

			handles['images'] = Images.find(recipe.imageId).observe({
				added: function(image) {
					self.added('recipesImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('recipesImage', image._id, image);
				},
				removed: function(image) {
					self.removed('recipesImage', image._id);
				}
			})
		},
		removed: function(recipe) {
			self.removed('recipes', recipe._id);

			handles['images'] && handles['images'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});

Meteor.publish('recipe', function(id) {
	check(id, String);

	var self = this;
	var handles = {};

	handles['recipes'] = Recipes.find({_id: id, deleted: {$exists: false}}).observe({
		added: function(recipe) {
			self.added('recipes', recipe._id, recipe);

			handles['images'] = Images.find(recipe.imageId).observe({
				added: function(image) {
					self.added('recipesImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('recipesImage', image._id, image);
				},
				removed: function(image) {
					self.removed('recipesImage', image._id);
				}
			})
		},
		removed: function(recipe) {
			self.removed('recipes', recipe._id);

			handles['images'] && handles['images'].stop();
		}
	});

	self.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});

