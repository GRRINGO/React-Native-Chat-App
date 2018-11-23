import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import {TouchableOpacity, Text, KeyboardAvoidingView, TextInput, StyleSheet} from 'react-native';

export interface SignUpUserProps {}
export interface SignUpUserState {
  new_username: string;
  new_password: string;
  new_password_confirm: string;
}

const onPressSignup = (state) => {
  const {new_username, new_password, new_password_confirm} = state;
  console.log(new_username);
  console.log(new_password);
  console.log(new_password_confirm);
}

class SignUpUser extends React.Component<SignUpUserProps, SignUpUserState> {
  constructor(props: any) {
    super(props);
    this.state = {
      new_username: "",
      new_password: "",
      new_password_confirm: ""
    };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput 
          style={styles.signUpUser } 
          autoFocus={true} 
          placeholder={"Username"}
          onChangeText={(new_username) => this.setState({new_username})}
          value={this.state.new_username} />

        <TextInput 
          secureTextEntry={true} 
          placeholder={"Password"} 
          style={styles.signUpUser}
          onChangeText={new_password => this.setState({new_password})}
          value={this.state.new_password} />
          
        <TextInput 
          secureTextEntry={true} 
          placeholder={"Confirm Password"} 
          style={styles.signUpUser}
          onChangeText={new_password_confirm => this.setState({new_password_confirm})}
          value={this.state.new_password_confirm} />

        <TouchableOpacity
        style={styles.loginButton} 
        onPress={() => onPressSignup(this.state)}>
        <Text style={styles.signUpUser}>SIGN UP</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>

    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  signUpUser: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 3,
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-around",
  },
  loginButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,
  },
  loginText: {
    color: Colors.white,
    textAlign: 'center',
  }
});

export default SignUpUser;
