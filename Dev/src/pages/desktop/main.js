import { mapMutations } from 'vuex'

export default {
    name: 'WorkmanDesktop',
    data () {
        return {
            navs: [
                {
                    title: '计划',
                    to: '/todo'
                },
                {
                    title: 'Mock',
                    to: '/mock'
                },
                {
                    title: '项目',
                    to: '/project'
                },
                {
                    title: '开发中心',
                    to: '/development'
                },
                {
                    title: 'Apple',
                    children: [
                        {
                            title: 'Mac',
                            children: [
                                {
                                    title: 'Macbook',
                                    href: '#'
                                },
                                {
                                    title: 'Macbook Air',
                                    href: '#'
                                },
                                {
                                    title: 'Macbook Pro',
                                    href: '#'
                                },
                                {
                                    type: 'separator'
                                },
                                {
                                    title: 'iMac',
                                    href: '#'
                                },
                                {
                                    title: 'iMac Pro',
                                    href: '#'
                                },
                                {
                                    title: 'Mac Pro',
                                    href: '#'
                                }
                            ]
                        },
                        {
                            title: 'iPhone',
                            href: '#'
                        },
                        {
                            title: 'iPad',
                            href: '#'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            title: 'help',
                            fun: () => {
                                alert('apple help')
                            }
                        }
                    ]
                },
                {
                    title: 'API',
                    href: 'http://localhost:9085/apiTest',
                    target: '_blank'
                }
            ]
        }
    },
    activated: function () {
        this['Main/setNav']({
            type: 'main',
            data: this.navs
        })
    },
    methods: {
        ...mapMutations(['Main/setNav']),
    }
}