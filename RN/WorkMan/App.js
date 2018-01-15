
import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { MainNavigator, LoginNavigator } from './src/routes/index.js'

export default class App extends Component {

	constructor () {
		super()

		this.state = {
			userInfo: ''
		}
	}

	componentWillMount() {
		this.getUserInfo()
	}

	async getUserInfo () {
		let userInfo = JSON.parse(await AsyncStorage.getItem('USER_INFO'))
		this.setState({userInfo})
	}

	render () {
		return (
			<View style={{flex: 1}}>
				{ this.state.userInfo && this.state.userInfo.token ? <MainNavigator/> : <LoginNavigator/>}
			</View>
		)
	}
}

