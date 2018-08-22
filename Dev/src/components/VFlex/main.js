export default {
    props: {
        height:  String,
        width:  String,
    },
    data () {
        return {

        }
    },
    computed: {
        colStyle: function () {
            let result = ''

            if (this.height) {
                result += `max-height: ${this.height}; min-height: ${this.height};`
            }

            if (this.width) {
                result += `max-width: ${this.width}; min-width: ${this.width};`
            }

            return result
        }
    }
}