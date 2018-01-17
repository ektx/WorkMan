
import React, { Component } from 'react'
import { View, Text, Button, AsyncStorage } from 'react-native'
import { TabNavigator, NavigationActions } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

class HomeScreen extends Component {
	constructor(props) {
		super(props)
	}

	async loginout (navigation) {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'Login' })
			],
			key: this.state
		})
		const info = await AsyncStorage.removeItem('USER_INFO')
		this.props.navigation.dispatch(resetAction)
	}

	render () {
		return (
			<View>
				<Text>Hello world</Text>
				<Button
					onPress={() => this.loginout()}
					title="Exit"
				/>
			</View>
		)
	}
}

class EventListScreen extends Component {
	constructor(props) {
		super(props)
	}

	render () {
		return (
			<View>
				<Text>List Arr</Text>
			</View>
		)
	}
}

export const MainScreen = TabNavigator({
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			title: '事件',
			tabBarLabel: '事件',
			tabBarIcon: ({tintColor, focused}) => (
				<Ionicons
					name={focused ? 'ios-list' : 'ios-list-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			)
		}
	},
	List: {
		screen: EventListScreen,
		navigationOptions: {
			title: '我',
			tabBarLabel: '我',
			tabBarIcon: ({tintColor, focused}) => (
				<Ionicons
					name={focused ? 'ios-person': 'ios-person-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			)
		}
	}
})