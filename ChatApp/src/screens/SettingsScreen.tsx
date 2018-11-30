import React, {Component} from "react";
import { KeyboardAvoidingView, StyleSheet, Button, View, Alert, } from "react-native";
import Wallpaper from "../components/Wallpaper";
import SettingPicture from "../components/SettingPicture";
import SettingName from "../components/SettingName";
import SettingResolution from "../components/SettingResolution";
import SettingSave from "../components/SettingSave";
import Layout from "../constants/Layout";
import firebase from "firebase";
import { ImagePicker, Permissions } from "expo";
// import ImagePicker from 'react-native-image-picker';

export interface SettingsScreenProps {
  navigation: any
}
export interface SettingsScreenState {
  displayname: string,
  mutable_displayname: string,
  dialogNameVisible: boolean,
  image: string,
  mutable_image: string,
  dialogPictureVisible: boolean,
  resolution: "full" | "high" | "low",
  mutable_resolution: "full" | "high" | "low"
}

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class SettingsScreen extends Component<SettingsScreenProps, SettingsScreenState> {

  constructor(props: any) {
    super(props);
    // TODO: authenticate user with firebase.auth() and get username, resolution and image from server
    this.state = {
      displayname: "",
      mutable_displayname: "",
      dialogNameVisible: false,
      image: "",
      mutable_image: "",
      dialogPictureVisible: false,
      resolution: "full",
      mutable_resolution: "full",
      };
  }

  componentDidMount() {
    if (firebase.auth()) {

      const name = firebase.auth().currentUser.email;
      if (name) {
        this.setState({displayname: name, mutable_displayname: name});
      }
    }
  }

  public static navigationOptions = {
    title: 'Settings'
  }

  logOutButton = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  showPictureDialog = () => {
    this.setState({ dialogPictureVisible: true });
  }

  handlePictureCancel = () => {
    this.setState({ dialogPictureVisible: false});
  }

  pickFromCamera = async () => {
    this.setState({ dialogPictureVisible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync(
        {
          allowsEditing: true,
          aspect: [4, 3],
        }
      );

      // console.log(result);
      if (!result.cancelled) {
        // this.setState({mutable_image: result.uri});
    }
      // console.log(this.state.mutable_image);
    }
  }

  pickFromGallery = async () => {
    this.setState({ dialogPictureVisible: false});
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    // console.log(result);
    if (!result.cancelled) {
      // this.setState({mutable_image: result.uri});
    }
  }

  showNameDialog = () => {
    this.setState({ dialogNameVisible: true });
  }

  handleNameCancel = () => {
    this.setState({ dialogNameVisible: false, mutable_displayname: this.state.displayname });
  }

  handleNameSubmit = () => {
    this.setState({ dialogNameVisible: false});
  }

  handleNameChange = (name: string) => {
    this.setState({ mutable_displayname: name });
  }

  handleResolutionChange = (new_resolution: "low"|"high"|"full") => {
    this.setState({mutable_resolution: new_resolution});
  }

  handleSave = () => {
    if (this.state.image === this.state.mutable_image &&
        this.state.resolution === this.state.mutable_resolution &&
        this.state.displayname === this.state.mutable_displayname) {
      Alert.alert("Nothing to save");
    } else {
      Alert.alert("Changes to be saved");
    }
  }

  render() {
    return (
    <Wallpaper>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <SettingPicture
          visible={this.state.dialogPictureVisible}
          image={this.state.mutable_image}
          handlePush={this.showPictureDialog}
          handleCancel={this.handlePictureCancel}
          pickCamera={this.pickFromCamera}
          pickGallery={this.pickFromGallery}/>
        <SettingName
          displayname={this.state.mutable_displayname}
          dialogVisible={this.state.dialogNameVisible}
          showDialog={this.showNameDialog}
          handleCancel={this.handleNameCancel}
          handleSubmit={this.handleNameSubmit}
          handleChange={this.handleNameChange}/>
        <SettingResolution resolution={this.state.mutable_resolution} handleChange={this.handleResolutionChange}/>
      </KeyboardAvoidingView>
      <SettingSave handleClick={this.handleSave}></SettingSave>
      <Button title="Sign out"
              onPress={this.logOutButton}
      >
      </Button>
    </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center"
  }
});

