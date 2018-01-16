
import React, { Component } from 'react'
import { 
	StyleSheet, 
	View, TextInput, 
	TouchableOpacity, 
	Text, StatusBar,
	AsyncStorage 
} from 'react-native'
import { NavigationActions } from 'react-navigation'

export default class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			user: '',
			pwd: ''
		}
	}

	// 提交
	onSubmitEvt = () => {

		if (!this.state.user) {
			this.userInt.focus()
			this.props.callbackWelTxt('账号或邮件不能为空')
			return
		}

		if (!this.state.pwd) {
			this.passwordInput.focus()
			this.props.callbackWelTxt('密码不能为空')
			return
		}
		
		fetch('http://localhost:4000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state)
		})
		.then(res => res.json())
		.then(async data => {

			if (data.status) {
				const resetAction = NavigationActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({ routeName: 'Home' })
					],
					key: this.state
				})

				this.state.token = data.token
				// 保存用户登录
				await AsyncStorage.setItem('USER_INFO', JSON.stringify(this.state)) 

				this.props.navigation.dispatch(resetAction)
			} else {
				// 通知父级发送信息
				this.props.callbackWelTxt(data.msg)
			}
		})
		.catch(err => {
			this.props.callbackWelTxt(err)
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				<TextInput
					placeholder="账号或邮件"
					placeholderTextColor="rgba(255, 255, 255, 0.7)"
					// 下一步显示 next
					returnKeyType="next"
					// 邮件键盘
					keyboardType="email-address"
					// 不要首字大写
					autoCapitalize="none"
					// 联想词汇 false 不要
					autoCorrect={false}
					style={styles.input}
					ref={(input) => this.userInt = input}
					onChangeText={(user) => this.setState({ user })}
					onSubmitEditing={() => this.passwordInput.focus()}
				/>
				<TextInput
					placeholder="密码"
					placeholderTextColor="rgba(255, 255, 255, 0.7)"
					// 加密文字 type="password" 类似
					secureTextEntry
					returnKeyType="go"
					style={styles.input}
					ref={(input) => this.passwordInput = input}
					onChangeText={(pwd) => this.setState({ pwd })}
					onSubmitEditing={() => this.onSubmitEvt()}
				/>

				<TouchableOpacity 
					style={styles.btnMod} 
					onPress={() => this.onSubmitEvt()}
				>
					<Text style={styles.btnTxt}>LOGIN</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	input: {
		height: 40,
		backgroundColor: 'rgba(255, 255, 255, .2)',
		marginBottom: 10,
		color: '#fff',
		paddingHorizontal: 10
	},
	btnMod: {
		paddingVertical: 15,
		backgroundColor: '#2980b9'
	},
	btnTxt: {
		textAlign: 'center',
		color: '#fff',
		fontWeight: '700'
	}
})