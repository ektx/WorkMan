export default {
	name: 'VPassword',
	data() {
		return {
			focus: false,
			currentValue: this.value,
			isError: false,
			errorText: ''
		}
	},
	props:{
		title: {
			type: String,
			default: 'password'
		},
		value: {
			type: String,
			default: ''
		},
		minlength: {
			type: [String,Number],
			default: 6
		},
		maxlength: {
			type: [String,Number],
			default: 16
		},
		isVisible: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		VFocus() {
			this.focus = true
		},
		VBlur() {
			this.focus = false
			this.verification()
		},
		verification() {
			if(!this.currentValue){
				this.isError = true;
				this.errorText = `此项为必填`
			}else if(this.currentValue.length<this.minlength){
				this.isError = true;
				this.errorText = `密码长度不能小于${this.minlength}`
			}else if(this.currentValue.length>this.maxlength){
				this.isError = true;
				this.errorText = `密码长度不能小大于${this.maxlength}`
			}else{
				this.isError = false;
			}
		},
		handleInput(evt) {
		    this.currentValue = evt.target.value;
		},
	}
}