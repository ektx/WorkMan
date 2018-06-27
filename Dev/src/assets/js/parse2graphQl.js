/**
 * 将 json 转化成 graphql 使用的格式
 * @param {object} obj 要处理的JSON
 * 
 * eg: {a:"ok",b:false} => `{a:"ok",b:false}`
 */ 
export default function (obj) {
    let result = ''

    for (let key in obj) {
        let val = obj[key]
        if (typeof val === 'boolean') {
            result += `${key}:${val} `
        } else {
            result += `${key}:"${val}" `
        }
    }
    return `{${result}}`
}