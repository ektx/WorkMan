/**
 * react navigation demo
 * https://reactnavigation.org/docs/intro/quick-start
 * 简单的抽屉页面切换
 * RN > 0.49.3
 */

import React, { Component } from 'react'
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'


export const ChatScreen = ({navigation}) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Text>你好!{navigation.state.params.user}!</Text>
	</View>
)

// 写法一
// const RecentChatsScreen = ({navigation}) => (
// 	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
// 		<Text>最近聊天</Text>
// 		<Button
// 			// 动态传值
// 			onPress={() => navigation.navigate('Chat', { user: '宝宝' })}
// 			title="和 宝宝 聊天"
// 		/>
// 		<Text></Text>
// 	</View>
// )

// 写法二
class RecentChatsScreen extends Component {

	constructor(props) {
		super(props)

		this.state = {
			abc: 1
		}

		AsyncStorage.getItem('USER_INFO')
		.then(res => {
			console.log(res )
		})
		.catch(err => {
			console.error(err)
		})

	}


	async loginOut (navigation) {
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


	render() {
		return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<Text>最近聊天</Text>
				<Button
					// 动态传值
					onPress={() => this.props.navigation.navigate('Chat', { user: '宝宝' })}
					title="和 宝宝 聊天"
				/>
				<Button
					onPress={() => this.loginOut()}
					title="退出"
					/>
				<Text></Text>
			</View>		
		)
	}
}


const AllContactsScreen = ({navigation}) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Text>所有联系人</Text>
		<Button
			// 动态传值
			onPress={() => navigation.navigate('Chat', { user: '宝宝' })}
			title="宝宝"
		/>
		<Button
			// 动态传值
			onPress={() => navigation.navigate('Chat', { user: '蝴蝶' })}
			title="蝴蝶"
		/>
	</View>
)

export const MainScreen = TabNavigator({
	Recent: {
		screen: RecentChatsScreen,
		navigationOptions: {
			tabBarLabel: 'Home',
			tabBarIcon: ({tintColor, focused}) => (
				<Ionicons
					name={focused ? 'ios-home' : 'ios-home-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			)
		}
	},
	All: {
		screen: AllContactsScreen,
		navigationOptions: {
			tabBarLabel: 'Me',
			tabBarIcon: ({tintColor, focused}) => (
				<Ionicons
					name={focused ? 'ios-person' : 'ios-person-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			)
		}
	}
})


const styles = StyleSheet.create({

})

