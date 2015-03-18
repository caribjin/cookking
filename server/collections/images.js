Images.deny({
	insert: function() {
		return false;
	},
	update: function() {
		return false;
	},
	remove: function() {
		return true;
	},
	download: function() {
		return false;
	}
});

Images.allow({
	insert: function(userId, doc) {
		//return (userId && doc.metadata.owner === userId);
		return userId;
	},
	update: function(userId, doc, fieldNames, modifier){
		//return (userId === doc.metadata.owner);
		return userId;
	},
	remove: function(userId, doc) {
		return false;
	},
	download: function(userId) {
		return !!userId;
	}
});