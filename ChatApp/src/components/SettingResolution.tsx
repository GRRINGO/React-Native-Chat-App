import * as React from "react";
import Layout from '../constants/Layout';
import Colors from "../constants/Colors";
import { View, Text, StyleSheet, TouchableOpacity, Picker, Alert} from "react-native";

export interface SettingResolutionProps {
  resolution: "low" | "high" | "full",
  handleChange: any
}
export interface SettingResolutionState {
}

class SettingResolution extends React.Component<SettingResolutionProps, SettingResolutionState> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={{    borderRadius: 4,
        borderWidth: 0.5,
        borderColor: "#d6d7da"}}>
        {/*<TouchableOpacity
        style={styles.settingResolutionButton}
        onPress={() => Alert.alert("Change resolution")}>
        <Text style={styles.settingResolutionText}>Resolution: {this.state.resolution}</Text>
      </TouchableOpacity>*/}
      <Picker
      selectedValue={this.props.resolution}
      style={styles.settingResolutionPicker}
      onValueChange={(itemValue, itemIndex) => this.props.handleChange(itemValue)}>
        <Picker.Item label="  Resolution: Low" value="low" />
        <Picker.Item label="  Resolution: High" value="high" />
        <Picker.Item label="  Resolution: Full" value="full" />
      </Picker>
    </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
// const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  settingResolutionPicker: {
    backgroundColor: Colors.darkBlue,
    width: DEVICE_WIDTH,
    color: Colors.white,
    justifyContent: "center",
  },
  settingResolutionText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 15,
  },
});

export default SettingResolution;
