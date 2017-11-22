/*
	封装 APIFetch 请求
	------------------------
	options
	@data 		发送数据
*/
function APIFetch(data) {

	return new Promise((resolve, reject) => {
		fetch('/api', {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'x-access-token': localStorage.TOKEN,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( data )
		})
		.then(res => res.json())
		.then(data => {
			if (data.code === 10000 && !data.status) {
				localStorage.removeItem('TOKEN');
				location.reload()
			} else {
				resolve(data.data)
			}
		})
		.catch(err => reject(err))
	})
}

export default APIFetch;