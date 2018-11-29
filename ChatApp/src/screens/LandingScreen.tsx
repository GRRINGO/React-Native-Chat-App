import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from 'firebase-react-native';

export interface LandingScreenProps {
  navigation: any
}
export interface LandingScreenState { }

export default class LandingScreen extends React.Component<LandingScreenProps, LandingScreenState> {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'SettingsScreen' : 'LoginScreen')
    })
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