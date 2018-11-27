import * as React from "react";
import Layout from '../constants/Layout';
import {View, Text, StyleSheet} from 'react-native';

export interface MessageWindowProps {}
export interface MessageWindowState {}

class MessageWindow extends React.Component<MessageWindowProps, MessageWindowState> {
  render() {
    return (
      <Text style={styles.messageWindow }>
        Message Window
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  messageWindow: {
  },
});

export default MessageWindow;
