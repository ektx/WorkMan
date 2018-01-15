
import React, { Component } from 'react'
import { Button, AsyncStorage } from 'react-native'
import { TabNavigator, StackNavigator } from 'react-navigation'

import LoginScreen from '../screen/Login.js'
import { MainScreen, ChatScreen } from '../components/chat/App.js'

/*
	默认从登录页面开始
*/
export const LoginNavigator = StackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null
		}
	},
	Home: {
		screen: MainScreen,
		navigationOptions: {
			header: null
		}
	}
}, {
	initialRouteName: 'Login', 
	headerMode: 'screen'
})

/*
	从主页开始
*/
export const MainNavigator = StackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null
		}
	},
	Home: {
		screen: MainScreen,
		navigationOptions: ({ navigation }) => {
			console.log(navigation)

			return {
				headerTitle: 'Home'
			}
		}
	},
	Chat: {
		screen: ChatScreen,
		navigationOptions: ({ navigation }) => {
			alert(JSON.stringify(navigation))
			const { state, setParams } = navigation
			const isInfo = state.params.mode === '信息'
			const { user } = state.params

			return {
				headerTitle: isInfo ? `${user}信息` : user,
				headerRight: (
					<Button 
						title={isInfo ? '完成' : `${user}信息`}
						onPress={() => setParams({
							mode: isInfo ? 'none' : '信息'
						})}
					/>
				)
			}
		}
	}
}, {
	initialRouteName: 'Home'
})

// const defaultGetStateForAction = MainNavigator.router.getStateForAction

// MainNavigator.router.getStateForAction = (action, state) => {
	
// 	return defaultGetStateForAction(action, state)
// }
