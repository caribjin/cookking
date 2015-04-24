Meteor.publish('images', function(id) {
	return Images.find({_id: id, deleted: {$exists: false}});
});