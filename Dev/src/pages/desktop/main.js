import { mapMutations } from 'vuex'

export default {
    name: 'WorkmanDesktop',
    data () {
        return {
            navs: [
                {
                    title: '计划',
                    to: '/todoList'
                },
                {
                    title: 'Mock',
                    to: '/mock'
                },
                {
                    title: '通讯录',
                    to: '/addressBook'
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
        this.MutaionMacOSTopbar({
            type: 'main',
            data: this.navs
        })
    },
    methods: {
        ...mapMutations(['MutaionMacOSTopbar']),
    }
}