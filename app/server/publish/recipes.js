var checkParameters = function(condition, options) {
	//console.log(JSON.stringify(condition) + ' , ' + JSON.stringify(options));
	check(condition, {
		filter: Match.Optional(String),
		$or: Match.Optional(Array)
	});

	check(options, {
		sort: {
			highlighted: Number,
			createdAt: Match.Optional(Number),
			bookmarkedCount: Match.Optional(Number),
			favoritesCount: Match.Optional(Number)
		},
		limit: Number,
		fields: Object
	});
};

Meteor.publish('recipes', function (condition, options) {
	checkParameters(condition, options);

	//if (options.limit > Recipes.find().count()) {
	//	options.limit = 0;
	//}

	var self = this;
	var handles = {};
	var query = { deleted: {$exists: false} };
	var imageOptions = {
		fields: {
			"uploadedAt": 1,
			"copies.thumbs.key": 1,
			"copies.images.key": 1
		}
	};

	//if (condition.filter !== 'all') {
	//	_.extend(query, { filter: condition.filter });
	//}
	//
	//if (condition.public) {
	//	_.extend(query, { public: condition.public });
	//}

	_.extend(query, condition);

	handles['recipes'] = Recipes.find(query, options).observe({
		added: function(recipe) {
			self.added('recipes', recipe._id, recipe);

			handles['images'] = Images.find(recipe.imageId, imageOptions).observe({
				added: function(image) {
					self.added('recipesImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('recipesImage', image._id, image);
				},
				removed: function(image) {
					self.removed('recipesImage', image._id);
				}
			});
		},

		changed: function(recipe, oldRecipe) {
			self.changed('recipes', recipe._id, recipe);

			handles['images'] = Images.find(recipe.imageId, imageOptions).observe({
				added: function(image) {
					self.added('recipesImage', image._id, image);
				},
				changed: function(image, oldImage) {
					self.changed('recipesImage', image._id, image);
				},
				removed: function(image) {
					self.removed('recipesImage', image._id);
				}
			});
		},

		removed: function(recipe) {
			self.removed('recipes', recipe._id);

			handles['images'] && handles['images'].stop();
		}
	});

	this.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	self.ready();
});

Meteor.publish('recipesCount', function (condition, options) {
	checkParameters(condition, options);

	var query = { deleted: {$exists: false} };
	_.extend(query, condition);

	Counts.publish(this, 'recipesTotalCount', Recipes.find(query), {noReady: true, nonReactive: false});

	this.ready();
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

	this.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	this.ready();
});

Meteor.publish('recipe', function(condition) {
	check(condition, {
		id: String,
		admin: Boolean
	});

	var self = this;
	var handles = {};
	var query = {
		_id: condition.id,
		deleted: {$exists: false}
	};

	// 관리자가 아니라면 비공개 레시피는 볼 수 없다.
	if (!condition.admin) {
		_.extend(query, {
			public: true
		});
	}

	handles['recipes'] = Recipes.find(query).observe({
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

		changed: function(recipe, oldRecipe) {
			self.changed('recipes', recipe._id, recipe);

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
			});
		},

		removed: function(recipe) {
			self.removed('recipes', recipe._id);

			handles['images'] && handles['images'].stop();
		}
	});

	this.onStop(function() {
		_.each(handles, function(handle) {
			handle.stop();
		});
	});

	this.ready();
});

