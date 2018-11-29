import * as React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import firebase from 'firebase-react-native';
import { withNavigation } from 'react-navigation';

export interface SignupFormProps {
  navigation: any;
}
export interface SignupFormState {
  username: string;
  password1: string;
  password2: string;
}

class SignupForm extends React.Component<SignupFormProps, SignupFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: ""
    }
  }

  componentDidMount() {
    this.props.navigation.navigate('LoginScreen');
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'SettingsScreen' : 'LoginScreen')
    })
  }

  createAccount = () => {
    const { username, password1, password2 } = this.state;
    if (password1 === password2) {
      const user = firebase.auth().createUserWithEmailAndPassword(username, password1)
        .catch((error) => {
          var errorMessage = error.message;
          Alert.alert(errorMessage);
        });
    } else {
      Alert.alert("Passwords do not match");
    };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.signupForm}>
        <TextInput 
          onChangeText={(text) => this.setState({ username: text })}
          style={styles.signupUsername} autoFocus={true} 
          placeholder={"Username"} />
        <TextInput 
          onChangeText={(text) => this.setState({ password1: text })} 
          secureTextEntry={true} placeholder={"Password"}
          style={styles.signupPassword} />
        <TextInput
          onChangeText={(text) => this.setState({ password2: text })}
          secureTextEntry={true} placeholder={"Re-type password"}
          style={styles.signupPassword} />
        <TouchableOpacity onPress={this.createAccount}>
          <Text style={styles.button}>Create Account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  signupForm: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: DEVICE_WIDTH,
    top: 20,
    marginBottom: 400,
    alignItems: 'center',
  },
  signupUsername: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
  signupPassword: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.lightBlue,
    padding: 20,
  },
  text: {
    color: Colors.white,
    textAlign: 'center',
  }
});

export default withNavigation(SignupForm);
