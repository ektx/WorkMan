# WorkMan Web

```shell
# 运行
yarn run start

# 运行测试环境
yarn run dev
```

## 添加自己的配置文件
1. 新建一个 `config.json`
2. 添加以下内容

```json
{
	"db": {
		"useDev": false,
		"prod": {
			"user": "线上用户数据库服务器",
			"work": "线上当前项目数据库服务器"
		},
		"dev": {
			"user": "测试用户数据库服务器",
			"work": "测试当前项目数据库服务器"
		}
	}
}
```