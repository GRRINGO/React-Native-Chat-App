import React, {Component} from 'react';
import LoginForm from '../components/LoginForm';
import Wallpaper from '../components/Wallpaper';
import SignupSection from '../components/SignupSection';
import firebase from 'firebase-react-native';

export interface LoginScreenProps {
  navigation: any
}
export interface LoginScreenState {}

export default class LoginScreen extends Component<LoginScreenProps, LoginScreenState> {

  componentDidMount = () => {
    // console.log(firebase.auth().currentUser);
  }
  
  render() {
    return (
      <Wallpaper>
        <LoginForm />
        <SignupSection />
      </Wallpaper>
    );
  }
}
