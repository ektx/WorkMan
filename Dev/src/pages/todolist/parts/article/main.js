import { quillEditor } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Quill.register('modules/imageResize', ImageResize)

export default {
    name: 'TodoArticle',
    props: [ 'event' ],
    components: { quillEditor },
    data () {
        return {
            content: '',
            editorOption: {
                // theme: 'bubble',
                modules: {
                    toolbar: [
                        [{'header': [1,2,3,4,5,6,false]}],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['link', {'list': 'ordered'}, {'list': 'bullet'}],
                        ['blockquote', 'code-block'],
                        [{'color': []}, {'background': []}]
                    ],
                    imageResize: {
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                      }
                }
            },
            editSaveLayzy: null
        }
    },
    watch: {
        event (val, old) {
            if (val.id) {
                this.$axios.post('/api', {
                    query: `{findTodoEvent(id: "${val.id}"){ inner }}`
                }).then(result => {
                    this.content = result.data.findTodoEvent.inner
                })
            }
        }
    },
    methods: {
        onChange ({quill, html, text }) {
            clearTimeout(this.editSaveLayzy)

            this.editSaveLayzy = setTimeout(() => {
                this.content = html
                this.saveArticle()
            }, 1000)
        },

        saveArticle () {
            this.$axios.post('/api/v1/todoEvent/saveArticle', {
                inner: this.content,
                id: this.event.id
            })
        }
    }
}