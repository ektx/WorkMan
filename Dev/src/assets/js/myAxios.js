import axios from 'axios'
import router from '../../router'

axios.defaults.baseURL = ''

// 请求拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.hasOwnProperty('TOKEN')) {
            config.headers['X-Access-Token'] = localStorage.TOKEN
        } else {
            // 
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// 返回数据拦截器
axios.interceptors.response.use(
    res => res.data,
    err => {
        if (err.response) {
            switch (err.response.status) {
                case 401:
                localStorage.removeItem('TOKEN')
                router.replace({
                    path: '/login'
                })
            }
        }
        return Promise.reject(err)
    }
)

export default axios