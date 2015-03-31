Meteor.publish('version', function() {
	return Version.find();
})