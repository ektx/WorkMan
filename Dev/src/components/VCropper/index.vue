<template>
    <div class="v-cropper-mod">
        <div v-if="!imgURL" class="file-select-box">
            <input type="file" title="请选择图片" @change="inputChange">
            <p>{{helpInfo}}</p>
        </div>
        <div class="img-cropper-box">
            <img class="origin-img" :src="imgURL">
        </div>
    </div>
</template>

<script>
export default {
    name: 'VCropper',
    data () {
        return {
            helpInfo: '请选择图片',
            imgURL: '',
            imgInfo: null,
            // 选择区的大小信息
            boxBCR: {},
            // 图片信息
            imgEl: null,
            imgBCR: {},

        }
    },
    mounth: function () {
        this.boxBCR = this.$el.getBoundingClientRect()
    },
    methods: {
        inputChange ({type, target}) {
            let file = target.files[0]

            this.helpInfo = '请选择图片'

            if (/image\/.*/i.test(file.type)) {

                let reader = new FileReader()
    
                reader.readAsDataURL(file)
    
                reader.onload = readEvt => {
                    this.imgInfo = readEvt
                    this.imgURL = readEvt.target.result

                    this.setImgPosition()
                }


            } else {
                this.helpInfo = '你选择的文件不是图片，请选择图片文件'
            }
        },

        setImgPosition () {
            this.imgEl = this.$el.querySelector('.origin-img')

            this.$nextTick(function () {
                this.imgBCR = this.imgEl.getBoundingClientRect()

                console.log(this.imgEl, this.imgBCR)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.v-cropper-mod {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;

    .file-select-box {
        position: relative;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #999;

        input[type=file] {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            outline: none;
            border: none;
            opacity: 0;
            cursor: pointer;
        }
    }

    .img-cropper-box {
        .origin-img {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
}
</style>
