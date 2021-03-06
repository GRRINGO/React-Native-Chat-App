import React, {Component} from "react";
import { KeyboardAvoidingView, StyleSheet, Button, View, Alert, BackHandler, PermissionsAndroid } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Wallpaper from "../components/Wallpaper";
import SettingPicture from "../components/SettingPicture";
import SettingName from "../components/SettingName";
import SettingResolution from "../components/SettingResolution";
import SettingSave from "../components/SettingSave";
import Layout from "../constants/Layout";
import firebase, { database } from "firebase";
import { ImagePicker, Permissions } from "expo";
import {image_upload_profile, get_user, settings_set, update_user} from "../Fire";
import CustomHeader from "../components/CustomHeader";
// import ImagePicker from "react-native-image-picker";

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
  mutable_resolution: "full" | "high" | "low",
  id: string,
  key: string,
  email: string,
  user: firebase.User,
}

const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};

export default class SettingsScreen extends Component<SettingsScreenProps, SettingsScreenState> {

  constructor(props: SettingsScreenProps) {
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
      id: "",
      key: "",
      email: "",
      user: undefined,
      };
  }

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ActiveChatsScreen");
      return true;
    });

    if (firebase.auth()) {

      const user = firebase.auth().currentUser;
      let value = user.displayName;
      let method: "displayName" | "email" = "displayName";
      if (!user.displayName) {
        value = user.email;
        method = "email";
      }
      get_user(value, method)
      .then((response: firebase.database.DataSnapshot) => {
        this.setState({
          displayname: response.val().displayName,
          mutable_displayname: response.val().displayName,
          image: response.val().picture,
          mutable_image: response.val().picture,
          resolution: response.val().resolution,
          mutable_resolution: response.val().resolution,
          id: user.uid,
          key: response.key,
          email: response.val().email,
          user: user,
        });
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  public static navigationOptions = {
    title: "Settings",
  };

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
    /* tslint:disable:no-shadowed-variable */
    this.setState({ dialogPictureVisible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        /* tslint:enable:no-shadowed-variable */
        let result = await ImagePicker.launchCameraAsync(
          {
            allowsEditing: true,
            aspect: [4, 3],
          },
        );
        // console.log(result);
        if (!result.cancelled) {
          // @ts-ignore
          this.setState({mutable_image: result.uri});
        }
      } else {
        Alert.alert("You can't take pictures without CAMERA permissions");
      }
    } else {
      Alert.alert("You can't take pictures without CAMERA_ROLL permissions");
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
      // @ts-ignore
      this.setState({mutable_image: result.uri});
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

  handleSave = async () => {
    if (this.state.image === this.state.mutable_image &&
        this.state.resolution === this.state.mutable_resolution &&
        this.state.displayname === this.state.mutable_displayname) {
      Alert.alert("Nothing to save");
    } else {

      let nameReserved = false;
      if (this.state.displayname !== this.state.mutable_displayname) {
        const user = await get_user(this.state.mutable_displayname);
        if (user) {
          Alert.alert("Display name already exists");
          nameReserved = true;
          this.setState({
            mutable_displayname: this.state.displayname,
          });
        } else {
          update_user(this.state.mutable_displayname, this.state.user);
        }
      }
      if (!nameReserved) {
        this.setState({
          displayname: this.state.mutable_displayname,
          resolution: this.state.mutable_resolution,
        });
        if (this.state.image !== this.state.mutable_image) {
          image_upload_profile(this.state.id, this.state.mutable_image)
          .then(res => {
            this.setState({
              image: this.state.mutable_image,
            });
            let postData = {
              displayName: this.state.mutable_displayname,
              email: this.state.email,
              picture: res,
              resolution: this.state.mutable_resolution,
            };
            settings_set(this.state.key, postData)
            .then(result => {
              Alert.alert("Data updated succesfully");
            });
          })
          .catch(error => {
            console.error(error);
          });
        } else {
          let postData = {
            displayName: this.state.mutable_displayname,
            email: this.state.email,
            picture: this.state.image,
            resolution: this.state.mutable_resolution,
          };
          settings_set(this.state.key, postData)
          .then(result => {
            Alert.alert("Data updated succesfully");
          });
        }
      }
    }
  }

  onSwipeLeft() {
    this.props.navigation.navigate("ActiveChatsScreen");
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
    <Wallpaper>
      <GestureRecognizer
          onSwipeLeft={() => this.onSwipeLeft()}
          config={config}
          style={{
            backgroundColor: "transparent",
            flex: 1,
          }}
      >
      <CustomHeader text={"Settings"} navigation={this.props.navigation} />
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
        <Button title="Sign out" onPress={this.logOutButton}>
        </Button>
      </GestureRecognizer>
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
    alignItems: "center",
  },
});
