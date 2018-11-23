import * as React from "react";
import Layout from '../constants/Layout';
import {TextInput, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";

export interface LoginPasswordProps {}
export interface LoginPasswordState {}

class LoginPassword extends React.Component<LoginPasswordProps, LoginPasswordState> {
  render() {
    return (
      <TextInput 
        secureTextEntry={true} 
        placeholder={"Password"} 
        style={styles.loginPassword}
        onChangeText={password => this.setState({password})}/>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loginPassword: {
    fontSize: 20,
    color: Colors.white,
    backgroundColor: 'transparent',
  },
});

export default LoginPassword;
