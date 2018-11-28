import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Dialog from 'react-native-dialog';

export interface SettingNameProps {
  username: string,
  dialogVisible: boolean,
  showDialog: any,
  handleCancel: any,
  handleSubmit: any,
  handleChange: any
}
export interface SettingNameState {
  username: string,
  mutable_username: string,
  dialogVisible: boolean
}

class SettingName extends React.Component<SettingNameProps, SettingNameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: props.username,
      mutable_username: props.username,
      dialogVisible: false,
      };
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
  
  handleCancel = () => {
    this.setState({ dialogVisible: false, mutable_username:this.state.username });
  };
  
  handleSubmit = () => {
    this.setState({ dialogVisible: false, username: this.state.mutable_username });
  };

  handleChange = (name : string) => {
    this.setState({ mutable_username: name });
  };
  
  render() {
    return (
      <View>
        <TouchableOpacity style={styles.settingNameButton} onPress={this.props.showDialog}>
          <Text style={styles.settingNameText}>Username: {this.props.username}</Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.props.dialogVisible}>
          <Dialog.Title>Change Username</Dialog.Title>
          <Dialog.Input label="Username:" defaultValue={this.props.username} onChangeText={(name : string) => this.props.handleChange(name)} />
          <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
          <Dialog.Button label="Submit" onPress={this.props.handleSubmit} />
        </Dialog.Container>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  settingNameButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,    
    width: DEVICE_WIDTH,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  settingNameText: {
    color: Colors.white,
  }
  
});

export default SettingName;
