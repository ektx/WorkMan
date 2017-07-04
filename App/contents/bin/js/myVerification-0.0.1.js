
/*
	表单验证
	=====================================
	options:
	@checkAll: {true|false} 验证方式,默认为全部验证-[true]
	@errHide: {function} 当你使用了errBox功能为function时
	@errBox: {class|id|function} 用于存放错误显示的地方,
			 使用这个标签将会从头验证表单,发现
			 错误就会停止,直到此错误解决才会验证下一个
	@show:   {class} 此属性用于指定错误时,对错误标签上加的显示样式
	@done:   {function} 请求成功时处理内容
	@fail:   {function} 请求失败或错误时
	@always: {function} 加载时
	--------------------------------------
	eg:

*/
$.fn.extend({
	myVerification : function(options) {

	// var _ = $(this);
		var hasErr = false;

		var ajaxFun = function(option) {
			if (options.always) options.always(option);

			$.ajax(option)
			.done(function(data) {
				/*
					data:
					option: {
						data: {object} ajax提交数据
						dataType: {string} 字符串
						postData: {object} 提交数据
						this: {jq obj} 当前表单
						btn: {jq obj}  当前点击的按钮
						type: {string} ajax类型
						url:  {string} ajax地址
					}
				*/
				if (options.done) options.done(data, option)
			})
			.fail(function(err){
				console.error(err)
				if (options.fail) options.fail(err)
			})
		}

		// 查看是否相同
		var sameAs = function(ele) {
			var _val = ele.val();
			var result = false;

			var _name = ele.attr('sameAs');
			var _brothers = $('input[name="'+_name+'"]');
			if ( _val !== _brothers.val() ) {
				setError(ele, ' 请确认输入内容!')
				setError(_brothers, ' 请确认输入内容!')
				result = true;
			} else {
				removeErr(ele)
				removeErr(_brothers)
			}
			

			return result;
		}
	

		/*
		@it 当前错误元素
		@info 错误信息
		*/
		var setError = function(it, info) {

			var errType = typeof options.errBox;

			if (errType === 'function') {
				options.errBox(it, info)
			} 
			else if (errType === 'undefined') {
				if (options.show) {
					it.parent().addClass(options.show);
					if ( it.next().length > 0 ) {
						it.next().text(info)
					} else {
						it.after('<span class="err-info">'+info+'</span>')
					}
				} else {
					if ( it.next().length > 0 ) {
						it.next().show().text(info)
					} else {
						it.after('<span class="err-info">'+info+'</span>').show()
					}
				}
			}

			hasErr = true
		}

		var removeErr = function(it) {
			hasErr = false;

			var errType = typeof options.errHide;
			if (errType === 'function') {
				options.errHide(it)
			}
			else if (errType === 'undefined') {
				if (options.show) {
					it.parent().removeClass(options.show)
				} else {
					it.next().hide()
				}
			}
		}


	var checkedVal = function(options, event, _) {
		var data = {};
		var postData = {};
		var options = options || {};
		var url = _.attr('action');
		var type = _.attr('method');
		var checkAll = options.checkAll || true;
		var intFileSize = _.find('input[type="file"]').length;

		var ajaxOption = {
			url: url,
			type: type,
			dataType: 'json'
		};
		
		// 文件上传形式
		if (intFileSize > 0) {
			data = new FormData();
			ajaxOption.processData = false;
			ajaxOption.contentType = false;
		}

		_.find('input').each(function(e) {

			var _this = $(this);
			var _name = _this.attr('name');

			if (event.type === 'keyup' && event.target.name !== _name) {
				return true
			}

			var _val = $.trim(_this.val());
			var _placeholder = _this.hasAttr('placeholder') ? _this.attr('placeholder') : '';


			// 非空验证
			if (_this.hasAttr('required')) {

				// 当指定了显示错误的容器时,此时逐个验证信息
				if ( _val === '' ) {
					setError(_this, _placeholder + '不能为空')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (checkAll) return false;
				} else {
					removeErr(_this)
				}


				// 密码验证
				if (_this.attr('type') === 'password' ) {
					if ( /\s/g.test(_val) ) {
						setError(_this, _placeholder + '不能出现空格')
						// 当指定了显示错误的容器时,此时逐个验证信息
						if (checkAll) return false;
					} else {
						removeErr(_this)
					}

				}
			}

			// pattern 验证
			if (_this.hasAttr('pattern')) {
				if (_val.length> 0 || _this.hasAttr('required')) {
					var newReg = new RegExp(this.pattern);
					if ( !newReg.test(this.value) ) {
						setError(_this, this.title);
					}
				} else {
					removeErr(_this)
				}
			}


			// 邮箱验证
			if (_this.attr('type') === 'email' ) {
				if ( _val.length > 0 || _this.hasAttr('required') ) {
					if ( !/\w+@\w+\.\w+/.test(_val) ) {
						setError(_this, _placeholder + '格式不正确')
						// 当指定了显示错误的容器时,此时逐个验证信息
						if (checkAll) return false;
					} else {
						removeErr(_this)
					}
					
				} else if (_val.length == 0 && !_this.hasAttr('required')) {
					removeErr(_this)
				}
			}

			// 数据取值
			if (_this.attr('type') === 'file') {
				if(this.hasAttribute('multiple')) {
					for(var i = 0, l= this.files.length; i < l; i++){
						data.append(_this.attr('name'), this.files[i]);
					}
				} else {
					data.append(_this.attr('name'), this.files[0]);
				}

			} else {
				if (intFileSize > 0) {
					data.append(_this.attr('name'), _val)

				} else {
					// 单选取值
					if (_this.attr('type') === 'radio') {
						if (!_this.is(':checked')) return true;
					}
				
					data[_this.attr('name')] = _val;

				}
			}

			postData[_this.attr('name')] = _val;

			if (event.type === 'submit' && _this.hasAttr('sameAs')) {
				hasErr = hasErr ? hasErr : sameAs(_this)
			}

		}) // End each


		if (event.type === 'submit' && !hasErr) {
			ajaxOption.data = data;
			ajaxOption.postData = postData;
			ajaxOption.this = _;
			ajaxOption.btn = _.find('[type="submit"]')

			ajaxFun(ajaxOption)
		}

	};


	// Add novalidate tag if HTML5.
	this.attr( "novalidate", "novalidate" );

	// 事件绑定
	this.on('submit', function(e) {
		e.preventDefault();

		checkedVal(options, e, $(this))
	}).on('keyup', function(e) {
		e.preventDefault();
		
		checkedVal(options, e, $(this))
	}).on('blur', 'input', function(e){
		e.preventDefault();
		
		var _t = $(this);
		var _val = _t.val();

		if (_t.hasAttr('ver-url')) {
			var _url = _t.attr('ver-url');
			var _type = _t.attr('ver-type');
			var _name = _t.attr('ver-name');

			if (_url && _type && _name) {

				var toDate = {};
				toDate[_name] = _val

				$.ajax({
					url: _url,
					type: _type,
					data: toDate
				})
				.done(function(data) {
					if (options.verDone) options.verDone(data, _t, _name)
				})
				.fail(function(err){
					console.log(err)
				})
				
			} else {
				console.log('您丢失部分参数:')
				console.log('ver-url:  请求地址')
				console.log('ver-type: 请求类型')
				console.log('ver-name: 请求名称')
			}
			
		} 

		if (_t.hasAttr('sameAs')) sameAs(_t);
	})

}});
