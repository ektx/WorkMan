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
            iType: this.type,
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
        },
        type (val, old) {
            this.iType = val
        }
    },
    mounted: function () {
        if (this.value) {
            this.defValue = this.value
        }

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
            let val = evt.target.value

            
            this.defValue = val
            this.verification()
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
            // 清除现有状态提醒
            if (this.vhelp.status) {
                this.vhelp.status = ''
            }

            // 必填验证
            if (this.required) {
                if (!this.defValue) {
                    return this.vhelp = {
                        status: 'error',
                        mes: '此项不能为空'
                    }
                }
            }

            // 格式验证 - 数字
            if (this.iType === 'number' && isNaN(parseFloat(this.defValue))) {
                return this.vhelp = {
                    status: 'error',
                    mes: '您需要输入数字'
                }
            }

            // 格式难 - 邮箱
            if (
                this.iType === 'email' && 
                !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(this.defValue)
            ) {
                return this.vhelp = {
                    mes: '邮箱格式不对,格式为: example@abc.com',
                    status: 'error'
                }
            }


        }
    }
}