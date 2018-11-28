import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'firebase';
// import navigation from 'react-navigation';

export interface LandingScreenProps {
  navigation: any
}
export interface LandingScreenState { }

export default class LandingScreen extends React.Component {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.navigate('LoginScreen')
    // firebase.auth().onAuthStateChanged(user => {
    //   this.props.navigation.navigate(user ? 'ChatScreen' : 'SignupScreen')
    // })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})