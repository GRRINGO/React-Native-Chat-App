// import * as React from "react";
import { createSwitchNavigator, DrawerNavigator, createDrawerNavigator } from "react-navigation";

import LandingScreen from "./screens/LandingScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ActiveChatsScreen from "./screens/ActiveChatsScreen";
import UserSearchScreen from "./screens/UserSearchScreen";
import GalleryScreen from "./screens/GalleryScreen";
import { init} from "./Fire";
// Initialize Firebase
init();

// create our app"s navigation stack
const App = createSwitchNavigator(
  {
    LandingScreen,
    SignupScreen,
    ForgotPasswordScreen,
    LoginScreen,
    ChatScreen,
    SettingsScreen,
    ActiveChatsScreen,
    UserSearchScreen,
    GalleryScreen,
  },
  {
    initialRouteName: "LandingScreen",
  },
);

export default App;
