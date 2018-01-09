
import React, { Component } from 'react'
import { TabNavigator, StackNavigator } from 'react-navigation'

import LoginScreen from './src/screen/Login.js'
import ChatScreen from './src/components/chat/App.js'

const MainNavigator = StackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null
		}
	},
	Main: {
		screen: ChatScreen,
		navigationOptions: {
			header: null
		}
	}
})

export default MainNavigator