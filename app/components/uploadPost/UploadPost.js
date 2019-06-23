import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { Header, Left, Right, Icon, Button, Title, Body } from "native-base";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-material-dropdown";

import ImagePicker from 'react-native-image-picker';


export default class UploadPost extends Component {
 
  static navigationOptions = {
    header: null
  };
  state={
    imageSource:require("../../assets/upload.png")
  }

  constructor(props){
    super(props)
    this.onPress = this.onPress.bind(this)
  }

  
  onPress(){
    console.log("Select image")
    const options = {
      // title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          imageSource: source,
        });

      }
    });
  }

  render() {
    
    let data = [
      {
        value: "Option 1"
      },
      {
        value: "Option 2"
      },
      {
        value: "Option 3"
      }
    ];
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: "#1b96fe" }}>
          <Left style={{ flexDirection: "row" }}>
            <Button transparent>
              <Icon
                name="menu"
                color="white"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Button>
            <Button transparent style={{ margingLeft: 20 }}>
              <Icon name="chatboxes" color="white" />
            </Button>
          </Left>
          <Body style={{ flex: 1, marginLeft: 40 }}>
            <Title style={{ fontSize: 20 }}>Upload Post</Title>
          </Body>
          <Right style={{ flexDirection: "row" }}>
            <Button transparent>
              <Icon name="notifications" color="white" />
            </Button>
            <Button transparent>
              <Icon name="cart" color="white" />
            </Button>
          </Right>
        </Header>
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View
              style={{ backgroundColor: "white", width: "100%", height: 150 }}
            >
              <Image
                source={this.state.imageSource}
                style={{ width: 200, height: 150, alignSelf: "center" }}
              />
            </View>
            <View>
              <TouchableOpacity style={styles.btnCam}>
                <FAIcon
                  name="camera"
                  size={42}
                  style={{ color: "#1b96fe", height: 60 }}
                  onPress={this.onPress}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Title</Text>
            <TextInput
              placeholder="Name, Size etc"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <Text style={styles.heading}>Description</Text>
            <TextInput
              placeholder="Extra Details About Rental"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <Text style={styles.heading}>Daily Rental Rate</Text>
            <TextInput
              placeholder="The Price Per Day"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <Text style={styles.heading}>Discount For weekly Rental</Text>
            <TextInput
              placeholder="Enter Percentage as whole Number 10 for 10%"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <Text style={styles.heading}>Delivery Option</Text>
            <View style={styles.selectBox}>
              <Dropdown label="Select Delivery / Pickup" data={data} />
            </View>
            <Text style={styles.heading}>Delivery Fee</Text>
            <TextInput
              placeholder="The Price for delivery"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <Text style={styles.heading}>Item Location</Text>
            <View style={{ flexDirection: "row" }}>
              <View>
                <TextInput
                  placeholder="Zip Code"
                  keyboardAppearance="default"
                  autoCapitalize="none"
                  returnKeyType="next"
                  style={styles.textboxLoc}
                  autoCorrect={false}
                />
              </View>
              <View>
                <TouchableOpacity style={styles.btnLoc}>
                  <Text style={styles.textcolor}>Get My Location</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.heading}>Taxes(If Applicable)</Text>
            <TextInput
              placeholder="The Price of delivery"
              keyboardAppearance="default"
              autoCapitalize="none"
              returnKeyType="next"
              style={styles.textbox1}
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.textcolor1}>Upload Post</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  boxWithShadow: {
    backgroundColor: "white",
    height: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5
  },
  heading: {
    fontSize: 15,
    color: "black",
    marginTop: 12,
    marginLeft: 6
  },
  textbox: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
    textAlign: "left",
    width: 320,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderColor: "#c0c3c3",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    color: "#000000"
  },
  textbox1: {
    marginLeft: 6,
    marginTop: 3,
    fontSize: 13,
    textAlign: "left",
    width: "96%",
    height: 35,

    paddingHorizontal: 10,
    borderColor: "#c0c3c3",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    color: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5
  },
  textboxLoc: {
    marginLeft: 6,
    marginTop: 3,
    fontSize: 13,
    textAlign: "left",
    width: 200,
    height: 35,

    paddingHorizontal: 10,
    borderColor: "#c0c3c3",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    color: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5
  },
  selectBox: {
    width: "96%",

    marginLeft: 6
  },
  btn: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b96fe",
    marginTop: 10,
    width: 260,
    height: 45,
    borderRadius: 5,
    marginBottom: 20
  },
  btnLoc: {
    fontSize: 13,
    backgroundColor: "#1b96fe",
    justifyContent: "center",
    marginLeft: 20,
    width: 128,
    height: 35,
    borderRadius: 5,
    marginTop: 4
  },
  btnCam: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: 80,
    height: 60,
    borderRadius: 5
  },
  textcolor: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6
  },
  textcolor1: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center"
  }
});
