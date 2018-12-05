import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { user_state_change } from "../Fire";

export interface LandingScreenProps {
  navigation: any
}
export interface LandingScreenState { }

export default class LandingScreen extends React.Component<LandingScreenProps, LandingScreenState> {
  constructor(props: LandingScreenProps) {
    super(props);
  }

  componentDidMount() {
    user_state_change(user => {
      if (!user) {
        this.props.navigation.navigate("LoginScreen");
      }
      this.props.navigation.navigate("ChatScreen", {chat_id: "123"});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
