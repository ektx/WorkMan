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
                                title: '桌面',
                                to: '/'
                            }
                        ],
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
        /**
         * 
         * @param {object} state store state
         * @param {string} title APP标题
         * @param {string} path APP路由
         * @param {string} cache 缓存路由
         */
        setToAlive (state, {title, path, cache}) {
            // 添加索引
            state.aliveIndex[cache] = state.alive.length
            // 添加缓存
            state.alive.push( cache )
            // 追加到最近访问
            state._root[0].children[1].children.push({
                title,
                to: path
            })
        },
        removeAlive (state, key) {
            state.alive.splice(state.aliveIndex[key], 1)
            delete state.aliveIndex[key]
        }
    }
}