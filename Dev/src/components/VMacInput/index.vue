<template>
    <div :class="['v-mac-input', {'showErr': showErr}]">
        <div :class="['main', {'focus': focus, 'hasVal': hasVal}]">
            <span class="title">{{title}}</span>
            <input 
                :type="type"
                @focus="VMacIntFocus($event)"
                @blur="VMacIntBlur($event)"
                @input="VMacIntInput($event)"
                @keyup="VMacIntKeyUp($event)"
                :value="defValue"
            />
        </div>
        <p class="err">something was error!</p>
    </div>
</template>

<script>
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
        }
    },
    data () {
        return {
            focus: false,
            hasVal: false,
            defValue: '',
            showErr: false
        }
    },
    mounted: function () {
        console.log(this.value)

        if (this.value) {
            this.hasVal = true
            this.defValue = this.value
        }
    },
    methods: {
        VMacIntFocus (evt) {
            this.focus = true
            this.showErr = false
        },

        VMacIntBlur (evt) {
            this.focus = false
        },

        VMacIntInput (evt) {
            let value = evt.target.value

            if (value.length > 0) {
                this.hasVal = true
                this.showErr = false
            } else {
                this.hasVal = false
            }
            this.defValue = value

            this.$emit('input', value)
        },

        VMacIntKeyUp (evt) {
            if (evt.which === 13 || evt.key === 'Enter') {
                if (!this.hasVal) {
                    this.showErr = true
                }
            }
        }
    }
}
</script>

<style lang="less">

.v-mac-input {
    position: relative;
    padding: 20px 0;
    overflow: hidden;

    p.err {
        position: absolute;
        visibility: hidden;
        font-size: 12px;
        color: #F44336;
        opacity: 0;
        transform: translate3d(0, -20px, 0);
        transition: opacity 300ms, transform 300ms, visibility 300ms;
    }

    .main {
        position: relative;
        border-bottom: 1px solid #ddd;

        .title {
            position: absolute;
            top: 0;
            left: 0;
            line-height: 30px;
            font-size: 14px;
            color: #333;
            box-sizing: border-box;
            transition: font-size 300ms, transform 300ms;
            pointer-events: none;
        }
        input {
            width: 100%;
            border: none;
            font-size: 14px;
            line-height: 28px;
            outline: none;
            background: transparent;
        }

        &:after {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 0%;
            height: 100%;
            border-bottom: 2px solid #2196F3;
            transition: width 300ms ease;
        }
        &.focus {
            &:after {
                width: 100%;
            }
        }
        &.focus,
        &.hasVal {
            .title {
                font-size: 12px;
                color: #666;
                transform: translate3d(0, -24px, 0);
            }
        }
    }

    &.showErr {
        .main::after {
            border-color: #F44336;
        }

        .err {
            visibility: visible;
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
}
</style>
