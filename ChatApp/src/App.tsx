// import * as React from 'react';
import { createSwitchNavigator } from 'react-navigation'

import LandingScreen from "./screens/LandingScreen"
import SignupScreen from "./screens/SignupScreen"
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen"
import LoginScreen from "./screens/LoginScreen"
// import ChatScreen from "./screens/ChatScreen"
import SettingsScreen from "./screens/SettingsScreen"
import firebase from 'firebase';

import { ENV } from '../environment';

console.log(ENV.APIKEY);

var config = {
  apiKey: ENV.APIKEY,
  authDomain: ENV.AUTH_DOMAIN,
  databaseURL: ENV.DB_URL,
  projectId: ENV.PID,
  storageBucket: ENV.SBUCKET,
  messagingSenderId: ENV.SEND_ID,
};

firebase.initializeApp(config);

// create our app's navigation stack
const App = createSwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    ForgotPasswordScreen,
    LoginScreen,
    // ChatScreen,
    SettingsScreen
  },
  {
    initialRouteName: 'LandingScreen'
  }
)

export default App