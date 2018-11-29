import React, { Component } from 'react';
import { BackHandler, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import Wallpaper from '../components/Wallpaper';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const handleResetPress = (email: string) => {
  Alert.alert(email);
}

export interface ForgotPasswordScreenProps {
  navigation: any
}
export interface ForgotPasswordScreenState {
  email: string;
}

export default class ForgotPasswordScreen extends Component<ForgotPasswordScreenProps, ForgotPasswordScreenState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('LoginScreen');
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  }

  handleOnPress = () => {
    handleResetPress(this.state.email);
  }

  render() {
    return (
      <Wallpaper>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <TextInput
            onChangeText={(text) => this.setState({ email: text })}
            style={styles.email}
            autoFocus={true}
            placeholder={"Email"} />
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleOnPress}>
            <Text style={styles.text}>Reset password</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-around",
  },
  email: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.darkBlue,
    padding: 20,
  },
  text: {
    color: Colors.white,
    textAlign: 'center',
  }
});
