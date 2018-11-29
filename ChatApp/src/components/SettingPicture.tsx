import * as React from "react";
import Layout from "../constants/Layout";
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import * as default_image from "../assets/images/robot-dev.png";
import Dialog from "react-native-dialog";

export interface SettingPictureProps {
  visible: boolean,
  image: string,
  handlePush: any,
  handleCancel: any,
  pickCamera: any,
  pickGallery: any,
}
export interface SettingPictureState {
  dialogVisible: boolean
}

class SettingPicture extends React.Component<SettingPictureProps, SettingPictureState> {

  constructor(props: any) {
    super(props);
    this.state = {
      dialogVisible: false,
    };
  }

  render() {

    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={this.props.handlePush}>
          {this.displayImage(this.props.image)}
        </TouchableOpacity>
        <Dialog.Container visible={this.props.visible}>
          <Dialog.Title>Pick new picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.props.pickGallery} />
          <Dialog.Button label="Camera" onPress={this.props.pickCamera} />
          <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
        </Dialog.Container>
      </View>
    );
  }

  displayImage(image: string) {
    if (image === "") {
      return <Image source={default_image} style={styles.image} />;
    } else {
      return <Image source={{ uri: image }} style={styles.image} />;
    }
}

}
const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: { 
    width: DEVICE_WIDTH,
    flex: 1
  },
  image: {
    // resizeMode: "cover",
    // justifyContent: "center",
    // alignSelf: "center",
    width: 150,
    // height: 150,
  },
});

export default SettingPicture;
