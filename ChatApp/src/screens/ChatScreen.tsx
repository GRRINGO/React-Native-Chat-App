import React, {Component} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
// import Logo from '../components/Login/Logo';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import LoginUsername from '../components/LoginUsername';
import LoginPassword from '../components/LoginPassword';
import LoginButton from '../components/LoginButton';
import Wallpaper from '../components/Wallpaper';
// import ButtonLogin from '../components/LoginButton';
import SignupSection from '../components/SignupSection';
import { requireNativeComponent } from 'react-native';

const mockupMessages : ObjectArray = [
  {'senderName': 'foo', 'message': 'bar', 'key': 0},
  {'senderName': 'bar', 'message': 'wat??', 'key': 1},
  {'senderName': 'foo', 'message': 'nothing?', 'key': 2},
] 
export interface MessageAreaProps {
  chat_id: number, chat_name : string
};
export interface MessageAreaState {};


export default class ChatScreen extends Component{

  render() {
    return (
       <MessageArea chat_id={3} chat_name="Test Group" ></MessageArea>
    );
  }
}


class MessageArea extends Component<MessageAreaProps, MessageAreaState>  {

  render() {
    let messages = mockupMessages.map((msg, index)=>{
      return <Message senderName={msg.senderName} 
                      message={msg.message}
                      key={index} />
    })
    return (
      <View>
      <Text>{this.props.chat_name}</Text>
      <KeyboardAvoidingView>{messages}</KeyboardAvoidingView>
      </View>
    );
  }
}

class Message extends Component<{senderName: string, message : string}> {
    render() {
        return (
            <Text>&lt;{this.props.senderName}&gt;: {this.props.message}</Text>
        );
    }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-around",
  }



});
