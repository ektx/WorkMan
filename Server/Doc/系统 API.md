## 注册

- 地址: `/api`

```javascript
{
	query: 'mutation {
		userAdd(data: {
			account: "用户",
			pwd: "密码"	
		}) {
			account,
			pwd
		}
	}'
}
```


## 登录

- 地址: `/login`
- 方法: POST

```javascript
{
	user: "用户名",
	pwd: "密码"
}

```