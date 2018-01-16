
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { TabNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

class EventScreen extends Component {
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

export const EventsScreen = TabNavigator({
	Home: {
		screen: EventScreen,
		navigationOptions: {
			tabBarLabel: '事件',
			tabBarIcon: ({tintColor, focused}) => (
				<Ionicons
					name={focused ? 'ios-home' : 'ios-home-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			)
		}
	},
	List: {
		screen: EventListScreen,
		navigationOptions: {
			tabBarLabel: '列表',
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