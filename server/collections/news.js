News.allow({
	insert: function (userId, doc) {
		var user = Meteor.users.findOne(userId);
		return user && user.admin;
	},

	update: function (userId, doc, fieldNames, modifier) {
		return true;
	},

	remove: function (userId, doc) {
		return true;
	}
});
