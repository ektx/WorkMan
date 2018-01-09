/**
 * react navigation demo
 * https://reactnavigation.org/docs/intro/quick-start
 * 简单的抽屉页面切换
 * RN > 0.49.3
 */

import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { TabNavigator, StackNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'


const ChatScreen = ({navigation}) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Text>你好!{navigation.state.params.user}!</Text>
	</View>
)

const RecentChatsScreen = ({navigation}) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<Text>最近聊天</Text>
		<Button
			// 动态传值
			onPress={() => navigation.navigate('Chat', { user: '宝宝' })}
			title="和 宝宝 聊天"
		/>
	</View>
)

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

const MainScreenNavigator = TabNavigator({
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

const RootNavigator = StackNavigator({
	Home: {
		screen: MainScreenNavigator,
		navigationOptions: {
			headerTitle: 'Home'
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
})

const styles = StyleSheet.create({

})

export default RootNavigator