
import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, KeyboardAvoidingView } from 'react-native'
import { NavigationActions } from 'react-navigation'

import LoginForm from '../components/loginFrom.js'

export default class Login extends Component {

	constructor(props) {
		super()

		this.state = {
			welcomeTxt: 'WorkMan'
		}

	}

	render() {
		return (
			<KeyboardAvoidingView behavior="padding" style={styles.container}>
				<View style={styles.logoBox}>
					<Image style={styles.logo} source={require('../contents/img/logo.png')} />
					<Text 
						onPress={() => this.onSubmitEvt()} 
						style={styles.text}
					>{this.state.welcomeTxt}</Text>
				</View>

				<View style={styles.formContainer}>
					<LoginForm 
						navigation={this.props.navigation}
						// 获取子组件返回信息
						callbackWelTxt={(msg) => this.setState({welcomeTxt: msg})}
					/>
				</View>
			</KeyboardAvoidingView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#3498db'
	},
	logoBox: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logo: {
		width: 100,
		height: 80
	},
	text: {
		color: '#fff',
		marginTop: 10,
		width: 280,
		textAlign: 'center',
		opacity: .8
	}
})