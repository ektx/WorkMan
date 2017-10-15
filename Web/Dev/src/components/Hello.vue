<template>
	<div class="hello">
	<h1>{{ msg }} jdksjdk</h1>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'hello',
	data () {
		return {
			msg: ''
		}
	},
	created: function() {
		this.msg = 'vue is created!';

		let url = localStorage.SERVER_ENV ? 
			'/api/demo/helloworld.json' :
			'/api/demo/helloworld';

		// fetch 请求demo
		// fetch(url, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json'
		// 	}
		// })
		// .then(res => res.json())
		// .then(data => {
		// 	this.msg = data.data.name
		// })
		// .catch(err => {
		// 	console.error(err)
		// })

		// axios 请求demo
		axios.get(url)
			.then( res => {
				console.log(res)

				this.msg = res.data.data.name
			})
			.catch(err => {
				console.log(err)
			})

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	font-weight: normal;
}

</style>
