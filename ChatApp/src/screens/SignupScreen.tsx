import React, { Component } from 'react';
import WallPaper from '../components/Wallpaper';
//import Logo from '../components/Login/Logo';
//import FormSignup from '../components/Login/FormSignup';
//import ButtonSignup from '../components/Login/ButtonSignup';
import SignUpUser from '../components/SignUpUser';
export default class SignupScreen extends Component {
	render() {
		return (
      <WallPaper>
        <SignUpUser />
      </WallPaper>
	  );
  }
}
