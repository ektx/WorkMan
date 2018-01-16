
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { TabNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

class HomeScreen extends Component {
	constructor(props) {
		super(props)
	}

	render () {
		return (
			<View>
				<Text>Hello world</Text>
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