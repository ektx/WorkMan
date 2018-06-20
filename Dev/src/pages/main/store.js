export default {
    namespaced: true,
    state: {
        mainNav: {},
        asideNav: {},
        root: [],
        _root: [
            {
                title: 'WM',
                children: [
                    {
                        title: '桌面',
                        to: '/'
                    },
                    {
                        title: '最近访问',
                        children: [
                            {
                                title: '主页',
                                to: '/'
                            }
                        ]
                    }
                ]
            }
        ],
        // 缓存内容
        alive: ['WorkmanDesktop'],
        aliveIndex: {
            WorkmanDesktop: 0
        }
    },
    mutations: {
        setNav (state, data) {
            let arr = []

            // 恢复选中效果
            data.data.map(val => {
                if (val.classes && val.classes.length) {
                    val.classes = {}
                }
                return val
            })
            
            // 默认添加头部主菜单
            if (data.type && data.type === 'main') {
                arr = state._root
            }
            state[`${data.type}Nav`] = [...arr, ...data.data]

        },
        setToAlive (state, key) {
            state.aliveIndex.key = state.alive.length
            state.alive.push(key)
        },
        removeAlive (state, key) {
            state.alive.splice(state.aliveIndex.key, 1)
            delete state.aliveIndex.key
        }
    }
}