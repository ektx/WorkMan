/*
    联系人列表模板

    @author: zwl <530675800@qq.com>
    @date: 2018-2-26 AM
*/
<template>
    <div>
        <div class="user-contact-list" v-for="(val, index) in data" :key="'tel' + index">
            <dl v-show="!isEdit">
                <dt>
                    <span>{{val.label}}</span>
                </dt>
                <dd>
                    <input type="text" :value="val.inner" :readonly="!isEdit">
                </dd>
            </dl>

            <div v-show="isEdit" class="user-edit-area-box">
                <dl class="user-edit-top-bar">
                    <dt>
                        <span>联系电话 {{index + 1}}</span>
                    </dt>
                    <dd>
                        <button class="del-data">删除</button>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>标题</span>
                    </dt>
                    <dd>
                        <input type="text" v-model="val.label">
                    </dd>
                </dl>
                <dl>
                    <dt>
                        <span>内容</span>
                    </dt>
                    <dd>
                        <input type="text" v-model="val.inner">
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VADRList',
    props: {
        data: {
            type: Array,
            default: null
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            
        }
    }
}
</script>

<style lang="scss">

.user-contact-list {
	width: 80%;
	margin: 5px auto 0;

	dl {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ccc;

		input {
			box-sizing: border-box;
		}

		dt {
			font-size: 14px;
			color: #666;

			input {
				width: 120px;
				text-align: right;
			}

			&:after {
				content: ':';
				margin: 0 5px 0 2px;
			}
		}

		dd {
			position: relative;
			z-index: 1;
			flex: 1;
			font-size: 16px;
			color: #333;

			input {
				width: 100%;
			}

			button.del-data {
				float: right;
				font-size: 12px;
				color: #999;
				border: none;
				outline: none;
				background: transparent;
				cursor: pointer;
			}
		}

        input {
            font-size: 14px;
            line-height: 2.5em;
            text-indent: 2px;
            border: none;
            outline: none;
        }

        input {
            width: 80%;
            background-color: rgba(0, 0, 0, 0);
        }

        input:read-only {
            background: transparent;
        }
    }
}

</style>
