var WriteIngredients,
	WriteDirections = null;

Template.RecipeWrite.setTab = function(tab) {
	Template.instance().currentTab.set(tab);

	var matrix = {
		'basic-info':   [0, '100%', '200%'],
		'ingredients':  ['-100%', 0, '100%'],
		'directions':   ['-200%', '-100%', 0]
	};

	$('.basic-info-scrollable').velocity({translateZ: 0, translateX: matrix[tab][0]}, {duration: App.settings.defaultAnimationDuration, easing: 'ease-out'});
	$('.ingredients-scrollable').velocity({translateZ: 0, translateX: matrix[tab][1]}, {duration: App.settings.defaultAnimationDuration, easing: 'ease-out', visibility: 'visible'});
	$('.directions-scrollable').velocity({translateZ: 0, translateX: matrix[tab][2]}, {duration: App.settings.defaultAnimationDuration, easing: 'ease-out', visibility: 'visible'});
};

/**
 * 재료 추가 버튼을 눌렀을 때 재료컬렉션에 행을 추가한다.
 * @param type  재료종류 (must: 필수재료, option: 선택재료)
 * @param text  재료내용
 */
Template.RecipeWrite.ingredientAdd = function(type, text) {
	var limitCount = App.settings.ingredientsCountLimit || 20;

	var currentCount = WriteIngredients.find({type: type}).count();

	if (currentCount < limitCount) {
		WriteIngredients.insert({type: type, text: text, createdAt: new Date()});
	}
};

/**
 * 재료 삭제 버튼을 눌렀을 때 재료컬렉션에서 해당 행을 삭제한다.
 * @param docId     삭제한 재료의 _id
 */
Template.RecipeWrite.ingredientRemove = function(docId) {
	WriteIngredients.remove(docId);
};

/**
 * 조리법 추가 버튼을 눌렀을 때 조리법컬렉션에 행을 추가한다.
 */
Template.RecipeWrite.directionAdd = function() {
	var limitCount = App.settings.directionsCountLimit || 20;

	var currentCount = WriteDirections.find().count();

	if (currentCount < limitCount) {
		WriteDirections.insert({text: '', imageData: '', createdAt: new Date()});
	}
};

/**
 * 조리법 삭제 버튼을 눌렀을 때 조리법컬렉션에서 해당 행을 삭제한다.
 * @param docId     삭제한 조리법의 _id
 */
Template.RecipeWrite.directionRemove = function(docId) {
	WriteDirections.remove(docId);
};

/**
 * 기준인원의 변경 시 수치 증가/감소의 규칙 설정
 * 최소값 1, 최대값 95
 * 1 ~ 10 : 1씩 증감 / * 10 ~ 20 : 2씩 증감 / * 20 ~ : 5씩 증감
 * @param value         현재 수치
 * @param direction     방향. 증가: up, 감소: down
 * @returns {number}    변화된 기준인원 값
 */
Template.RecipeWrite.servingRangeRole = function(value, direction) {
	if (direction === 'up') {
		if (value >= 95) return value;
		else {
			var inc;
			if (value < 10) inc = 1;
			else if (value >= 10 && value < 20) inc = 2;
			else inc = 5;
		}
		value = value + inc;
	} else if (direction === 'down') {
		if (value <= 1) return value;
		else {
			var dec;
			if (value <= 10) dec = 1;
			else if (value <= 20 && value > 10) dec = 2;
			else dec = 5;
		}
		value = value - dec;
	}

	return value;
};

/**
 * 저장 전 입력된 모든 데이터에 대한 유효성 검증
 */
Template.RecipeWrite.validateData = function(e, tmpl) {
	var errors = {};

	// 기본정보
	var recipeName = tmpl.find('#recipeName').value;

	// 필수재료
	var ingredientContent = tmpl.find('input[name=ingredients]:first').value;

	// 조리법
	var directionContent = tmpl.find('textarea[name=directions]:first').value;

	if (!recipeName) errors.recipeName = true;
	if (!ingredientContent) errors.mustIngredient = true;
	if (!directionContent) errors.direction = true;

	Template.instance().errors.set(errors);
	return _.keys(errors).length;
};

/**
 * 재료/조리법의 동적 입력항목들을 검사하고, 입력이 있는 항목들을 매칭되는 컬렉션에
 * 업데이트한다. 최종 업데이트된 컬렉션에서 text가 비어있지 않은 row들을 최종적으로
 * db에 업데이트한다.
 */
Template.RecipeWrite.syncDataToCollection = function() {
	var $ingredientInputs = $('input[type=text][name=ingredients]');    // 재료 입력요소들
	var $directionInputs = $('textarea[type=text][name=directions]');      // 조리법 입력요소들

	$ingredientInputs.each(function(index) {
		var value = $(this).val();

		// 입력값이 있는 요소들을 대상으로 id로 매칭되는 컬렉션 row를 업데이트
		if (value) {
			var id = $(this).data('id');
			WriteIngredients.update({_id: id}, {$set: {text: value}});
		}
	});

	$directionInputs.each(function(index) {
		var value = $(this).val();

		if (value) {
			var id = $(this).data('id');
			WriteDirections.update({_id: id}, {$set: {text: value}});
		}
	})
};

/**
 * 모든 입력정보를 저장한다.
 */
Template.RecipeWrite.save = function(e, tmpl) {
	var errorCount = Template.RecipeWrite.validateData(e, tmpl);
	var recipe = {};
	var errors = {};

	if (errorCount <= 0) {
		App.helpers.confirm('저장하시겠습니까?', '레시피를 저장합니다', 'info', true, function() {
			// 모든 동적입력값들을 컬렉션에 업데이트한다.
			Template.RecipeWrite.syncDataToCollection();

			recipe = {
				title: tmpl.find('#recipeName').value,
				description: tmpl.find('#description').value,
				imageId: '',
				public: App.helpers.isChecked('#checkbox-10-public'),
				serving: parseInt(tmpl.find('#serving').value, 10),
				cookTime: 0,
				source: {
					name: 'source.name',
					url: 'source.url'
				},
				filter: App.helpers.getCheckedValue('category'),
				ingredients: {
					must: _.map(WriteIngredients.find(
						{type: 'must', text: {$ne: ''}},
						{fields: {text: 1, _id: 0}},
						{sort: {createdAt: 1}}).fetch(), function(doc) {
						return doc.text;
					}),
					option: _.map(WriteIngredients.find(
						{type: 'option', text: {$ne: ''}},
						{fields: {text: 1, _id: 0}},
						{sort: {createdAt: 1}}).fetch(), function(doc) {
						return doc.text;
					})
				},
				directions: WriteDirections.find(
					{text: {$ne: ''}},
					{fields: {text: 1, imageData: 1, _id: 0}},
					{sort: {createdAt: 1}}).fetch(),
				highlighted: false,
				bookmarkedCount: 0
			};

			var imageData = tmpl.recipeImage.get();

			if (imageData) {
				var file = Template.Share.generateFileInfo('recipe', imageData);

				if (!file) {
					App.helpers.error('인식할 수 없는 유형의 파일입니다');
					return;
				}

				Images.insert(file, function(error, file) {
					tmpl.recipeImage.set(null);

					if (error) {
						console.log(error.reason);
						return;
					}

					recipe.imageId = file._id;

					Template.RecipeWrite.callCreateRecipe(recipe);
				});
			} else {
				Template.RecipeWrite.callCreateRecipe(recipe);
			}
		});
	}
};

Template.RecipeWrite.callCreateRecipe = function(recipe) {
	Meteor.call('createRecipe', recipe, function(error, result) {
		if (error) {
			App.helpers.error(error.reason);
		} else if (!result) {
			App.helpers.error('알 수 없는 오류가 발생했습니다.')
		}

		Router.go('home');
	});
};

Template.RecipeWrite.onCreated(function() {
	WriteIngredients = new Meteor.Collection(null);
	WriteDirections = new Meteor.Collection(null);

	Session.set(App.sessions.shareImageData, null);
	Session.set(App.sessions.shareImagePurpose, null);

	this.recipeImage = new ReactiveVar(null);
	this.directionId = new ReactiveVar(null);

	this.currentTab = new ReactiveVar('basic-info');

	// 최초 재료 입력행에 필수재료 행을 한 개 추가
	Template.RecipeWrite.ingredientAdd('must', '');

	// 최초 조리법 입력행에 행을 한 개 추가
	Template.RecipeWrite.directionAdd();

	var self = this;
	Tracker.autorun(function() {
		var imageData = Session.get(App.sessions.shareImageData);
		var purpose = Session.get(App.sessions.shareImagePurpose);

		if (imageData) {
			if (purpose === 'recipe') {
				self.recipeImage.set(imageData);

				Session.set(App.sessions.shareImageData, null);
				Session.set(App.sessions.shareImagePurpose, null);
			} else if (purpose === 'direction') {
				var directionId = self.directionId.get();
				if (directionId) {
					WriteDirections.update({_id: directionId}, {$set: {imageData: imageData}});

					self.directionId.set(null);
					Session.set(App.sessions.shareImageData, null);
					Session.set(App.sessions.shareImagePurpose, null);
				}
			}
		}
	});

	// 에러 개체를 초기화
	this.errors = new ReactiveVar({});
});

Template.RecipeWrite.onRendered(function() {
	this.$('.content-scrollable').touchwipe({
		wipeLeft: function() {
			//alert('wipe left');
		},
		wipeRight: function() {
			//alert('wipe right');
		},
		preventDefaultEvents: false
	});

	// 최초 선택탭을 기본정보 탭으로 설정
	Template.RecipeWrite.setTab('basic-info');

	// 요리 종류 중 처음 항목을 기본 선택
	this.$('input[type=radio][name=category]')[0].checked = true;
});

Template.RecipeWrite.helpers({
	/**
	 * 해당 탭이 현재 활성화중인지를 확인
	 * @param name          탭 이름
	 * @returns {boolean}   활성화된 상태라면 true, 아니라면 false
	 */
	isActiveTab: function(name) {
		return Template.instance().currentTab.get() === name;
	},

	/**
	 * 현재 활성화되어 있는 탭 이름을 리턴
	 * @returns {string}   현재 활성화된 탭 이름
	 */
	activeTabClass: function() {
		return Template.instance().currentTab.get();
	},

	/**
	 * 요리 종류 리스트
	 * 요리 종류 정보를 좌/우 두개의 그룹으로 분리한 뒤 배열로 리턴
	 * @returns {array}     요리 종류 배열
	 */
	categories: function() {
		var categories = Categories.find({}, {sort: {key: 1}}).fetch();

		categories = _.groupBy(categories, function(el, index) {
			return Math.floor(index / 2);
		});

		return _.toArray(categories);
	},

	/**
	 * 이 재료 정보가 첫 번째 재료가 아닌지 여부를 확인
	 * @param ingredient    재료 개체
	 * @returns {boolean}   첫 번째 재료라면 false, 아니라면 true
	 */
	isNotFirstIngredient: function(ingredient) {
		return ingredient.index !== 1;
	},

	isFirstIngredient: function(ingredient) {
		return ingredient.index === 1;
	},

	ingredients: function(type) {
		var items = WriteIngredients.find({type: type}, {sort: {createdAt: 1}}).map(function(doc, index, cursor) {
			return _.extend(doc, {index: index + 1});
		});

		return items;
	},

	isNotFirstDirection: function(direction) {
		return direction.index !== 1;
	},

	isFirstDirection: function(direction) {
		return direction.index === 1;
	},

	directions: function() {
		var items = WriteDirections.find({}, {sort: {createdAt: 1}}).map(function(doc, index, cursor) {
			return _.extend(doc, {index: index + 1});
		});

		return items;
	},

	errorClass: function(key) {
		return Template.instance().errors.get()[key] && 'error';
	},

	completeImage: function() {
		var imageData = Template.instance().recipeImage.get();

		if (imageData) return imageData;
		else return App.settings.defaultRecipeWriteCompleteImage;
	}
});

Template.RecipeWrite.events({
	// 기본정보 탭 클릭
	'click .js-show-basic-info': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('basic-info');
	},

	// 재료 탭 클릭
	'click .js-show-ingredients': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('ingredients');
	},

	// 조리법 탭 클릭
	'click .js-show-directions': function(e, tmpl) {
		e.stopPropagation();
		Template.RecipeWrite.setTab('directions');
	},

	// 필수재료 추가 버튼 클릭
	'click .js-add-must-ingredient': function(e, tmpl) {
		Template.RecipeWrite.ingredientAdd('must', '');
	},

	// 선택재료 추가 버튼 클릭
	'click .js-add-option-ingredient': function(e, tmpl) {
		Template.RecipeWrite.ingredientAdd('option', '');
	},

	// 재료버튼 삭제 버튼 클릭
	'click .js-remove-ingredient': function(e, tmpl) {
		// 필수재료는 최소 1개 이상은 있어야 한다.
		if (this.type !== 'must' || this.index > 1) {
			Template.RecipeWrite.ingredientRemove(this._id);
		}
	},

	// 조리법 추가 버튼 클릭
	'click .js-add-direction': function(e, tmpl) {
		Template.RecipeWrite.directionAdd();
	},

	// 조리법 삭제 버튼 클릭
	'click .js-remove-direction': function(e, tmpl) {
		Template.RecipeWrite.directionRemove(this._id);
	},

	// 완성사진 등록 버튼 클릭
	'click .js-add-complete-image': function(e, tmpl) {
		var data = {
			purpose: 'recipe'
		};

		Overlay.open('Share', data);
	},

	// 저장 버튼 클릭
	'click .js-recipe-save': function(e, tmpl) {
		Template.RecipeWrite.save(e, tmpl);
	},

	// 기준인원 증가 버튼 클릭
	'click #servingUp': function(e, tmpl) {
		var value = tmpl.find('#serving').value;
		value = parseInt(value, 10);

		value = Template.RecipeWrite.servingRangeRole(value, 'up');

		tmpl.find('#serving').value = value;
	},

	// 기준인원 감소 버튼 클릭
	'click #servingDown': function(e, tmpl) {
		var value = tmpl.find('#serving').value;
		value = parseInt(value, 10);

		value = Template.RecipeWrite.servingRangeRole(value, 'down');

		tmpl.find('#serving').value = value;
	},

	// 조리법 이미지 추가 버튼 클릭
	'click .js-add-direction-image': function(e, tmpl) {
		var data = {
			purpose: 'direction'
		};

		tmpl.directionId.set(this._id);
		Overlay.open('Share', data);
	},

	'click #recipeName': function(e) {
		e.stopPropagation();
	},

	'click .header': function(e, tmpl) {
		var status = tmpl.isHeaderExpanded;

		if (!status) {
			$('.content-scrollable').velocity({top: '100%'}, {
				duration: App.settings.defaultAnimationDuration,
				complete: function (e) {
					tmpl.isHeaderExpanded = true;
				}
			});
			$('.header').velocity({height: '100%'}, {
				duration: App.settings.defaultAnimationDuration
			});
			$('.btns-group').velocity({bottom: -48}, {
				duration: App.settings.defaultAnimationDuration
			});
			$('#recipeName').velocity({top: '90%', color: '#ffffff', fontSize: '2rem', backgroundColorAlpha: 0}, {
				duration: App.settings.defaultAnimationDuration * 2
			});
			$('.header').addClass('noblur');
		} else {
			$('.content-scrollable').velocity({top: '31%'}, {
				duration: App.settings.defaultAnimationDuration,
				complete: function(e) {
					tmpl.isHeaderExpanded = false;
				}
			});
			$('.header').velocity({height: '31%'}, {
				duration: App.settings.defaultAnimationDuration
			});
			$('.btns-group').velocity({bottom: 0}, {
				duration: App.settings.defaultAnimationDuration,
				delay: 200
			});
			$('#recipeName').velocity({top: '39%', color: '#000000', fontSize: '1rem', backgroundColorAlpha: 100}, {
				duration: App.settings.defaultAnimationDuration
			});
			$('.header').removeClass('noblur');
		}
	}
});

/**
 * 템플릿 소멸시 이벤트 핸들러
 * 재료와 조리법을 위한 컬렉션의 메모리를 초기화한다.
 */
Template.RecipeWrite.onDestroyed(function() {
	WriteIngredients = null;
	WriteDirections = null;

	Session.set(App.sessions.shareImageData, null);
	Session.set(App.sessions.shareImagePurpose, null);
});