export default {
    name: 'VMacInput',
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        title: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        help: {
            type: Object,
            default: function () {
                return {
                    // inof success error warn
                    status: '',
                    mes: ''
                }
            }
        },
        error: {
            type: String,
            default: ''
        },
        clearbtn: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            focus: false,
            defValue: '',
            // 显示密码，默认 false 不显示
            showPwd: false,
            // 默认的文本类型 text
            iType: 'text',
            vhelp: {}
        }
    },
    watch: {
        // 动态跟踪值的变化
        value (val, old) {
            this.defValue = val
        },
        // 输出值的内容
        defValue (val, old) {
            this.$emit('input', val)
        },
        showPwd (val, old) {
            if (val) {
                this.iType = 'text'
            } else {
                this.iType = 'password'
            }
        },
        help (val, old) {
            this.vhelp = val
        }
    },
    mounted: function () {
        if (this.value) {
            this.defValue = this.value
        }

        this.iType = this.type
        this.vhelp = this.help
    },
    methods: {
        VMacIntFocus (evt) {
            this.focus = true
        },

        VMacIntBlur (evt) {
            this.focus = false
            this.$emit('blur', evt)
            this.verification()
        },

        VMacIntInput (evt) {
            this.defValue = evt.target.value
        },

        VMacIntKeyUp (evt) {
            this.$emit('keyup', evt)
        },

        // 清空内容
        clearVal (evt) {
            this.defValue = ''
            this.verification()
        },

        verification () {
            if (!this.defValue) {
                if (this.required) {
                    this.vhelp = {
                        status: 'error',
                        mes: '此项不能为空'
                    }
                }
            }
        }
    }
}