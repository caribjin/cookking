Meteor.publish('images', function(id) {
	return Images.find(id);
});