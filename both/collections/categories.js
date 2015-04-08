Categories = new Mongo.Collection(null);

Categories.getCategoryName = function(key) {
	var result = '기타';

	if (key) {
		result = this.findOne({key: key});

		if (result) result = result.value;
	}

	return result;
};