Template.Navigation.helpers({
	isTransparent: function() {
		return this.transparent ? this.transparent : false;
	},

	back: function() {
		return this.back && !(history.state && history.state.initial);
	}
});
