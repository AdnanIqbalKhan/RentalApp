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
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { Header, Left, Right, Icon, Button, Title, Body } from "native-base";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-material-dropdown";
import ImagePicker from "react-native-image-picker";
import GetLocation from 'react-native-get-location';

import { mainCategoriesList, subCategoriesList } from '../../backend/data/CategoriesList'
import {
  connectFirebase,
  saveDataWithoutDocId,
  uploadImage,
  updateData
} from "../../backend/firebase/utility";
import GlobalConst from '../../config/GlobalConst';
import { _retrieveData } from '../../backend/AsyncFuncs'



export default class UploadPost extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false
  }

  resetForm(c = true) {
    let deliveryOptions = [
      { value: "Delivery" },
      { value: "Exchange Post Delivery" },
      { value: "Exchange Post Delivery and Pickup" },
      { value: "Pickup" },
      { value: "Pickup and Delivery" }
    ];

    let a = {
      imageSource: require("../../assets/upload.png"),
      deliveryPickupOptionData: deliveryOptions,
      deliveryPickupOption: deliveryOptions[0],

      titleText: '',
      descriptionText: '',
      dailyRateText: '',
      weeklyDiscountText: '',
      deliveryFeeText: '',
      locationText: '',
      taxesText: '',
      location: '',
      deliveryPickupOption: '',

      subCatList: [],
      selectedCategory: { value: mainCategoriesList[0].name, id: mainCategoriesList[0].id },
      selectedSubCategory: { value: subCategoriesList[0].name, id: subCategoriesList[0].id }
    }

    if (c)
      this.setState(a)
    else
      this.state = a;
  }

  constructor(props) {
    super(props);
    this.selectImage = this.selectImage.bind(this);
    this.uploadPost = this.uploadPost.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.onChangeTextCategories = this.onChangeTextCategories.bind(this);
    this.resetForm(false)

    _retrieveData(GlobalConst.STORAGE_KEYS.userId)
      .then(a => this.setState({
        userID: a
      }))
      .catch(e => console.log(e))
  }

  onChangeTextCategories(value, index, data) {
    var id = data[index].id
    let temp = subCategoriesList.filter(function (n) {
      return n.mainCategoryId == id;
    });
    let subCat = temp.map(n => {
      return { value: n.name, id: n.id }
    });

    this.setState({
      subCatList: subCat,
      selectedCategory: data[index]
    })
  }

  selectImage() {
    ImagePicker.showImagePicker({}, response => {
      if (response.didCancel) {
        console.warn("User cancelled image picker");
      } else if (response.error) {
        console.warn("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: "data:image/jpeg;base64," + response.data };
        this.setState({
          imageSource: source
        });
      }
    });
  }

  selectLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.setState({
          location: {
            accuracy: location.accuracy,
            latitude: location.latitude,
            longitude: location.longitude
          },
          locationText: 'lat=' + location.latitude + ", lon=" + location.longitude,
        }
        )
      })
      .catch(error => {
        const { code, message } = error;
        Alert.alert("ERROR", message)
        console.warn(code, message);
      })
  }

  uploadPost() {
    this.setState({ loading: true })
    connectFirebase()
    postData = {
      title: this.state.titleText,
      description: this.state.descriptionText,
      dailyRate: this.state.dailyRateText,
      weeklyDiscount: this.state.weeklyDiscountText,
      deliveryFee: this.state.deliveryFeeText,
      taxes: this.state.taxesText,
      location: this.state.location,
      deliveryPickupOption: this.state.deliveryPickupOption.value,
      category: this.state.selectedCategory,
      subCategory: this.state.selectedSubCategory,
      userID: this.state.userID,
      rating: {
        star: -1,
        count: 0
      },
      status: 'Available'
    };

    saveDataWithoutDocId('posts', postData)
      .then(docRef => {
        let name = docRef.id + ".jpg";
        let path = 'posts/' + name;
        uploadImage(this.state.imageSource.uri, 'image/jpeg', path, name, 'posts', docRef, false)
        updateData('posts', docRef.id, { id: docRef.id })

        this.resetForm()
        Alert.alert(
          'Upload Post',
          'Post uploaded successfully',
          [
            {
              text: 'OK', onPress: () => {
                this.setState({ loading: false })
                this.props.navigation.navigate('Catalog')
              }
            },
          ],
          { cancelable: false },
        );
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        Alert.alert(
          'Error Occur',
          message,
          [
            {
              text: 'OK', onPress: () => {
                this.setState({ loading: false })
              }
            },
          ],
          { cancelable: false },
        );
      })
  }



  render() {
    let categoriesList = mainCategoriesList.map(n => { return { value: n.name, id: n.id } });

    const CustomProgressBar = ({ visible }) => (
      <Modal onRequestClose={() => null} visible={visible}>
        <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: '200' }}>Uploading...</Text>
            <ActivityIndicator size="large" />
          </View>
        </View>
      </Modal>
    )

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

        {this.state.loading ?
          <CustomProgressBar />
          :
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
                    onPress={this.selectImage}
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
                onChangeText={titleText => this.setState({ titleText })}
                autoCorrect={false}
              />

              <Text style={styles.heading}>Description</Text>
              <TextInput
                placeholder="Extra Details About Rental"
                keyboardAppearance="default"
                autoCapitalize="none"
                returnKeyType="next"
                style={styles.textbox1}
                onChangeText={descriptionText =>
                  this.setState({ descriptionText })
                }
                autoCorrect={false}
              />

              <Text style={styles.heading}>Daily Rental Rate</Text>
              <TextInput
                placeholder="The Price Per Day"
                keyboardAppearance="default"
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="next"
                style={styles.textbox1}
                onChangeText={dailyRateText => this.setState({ dailyRateText })}
                autoCorrect={false}
              />

              <Text style={styles.heading}>Discount For weekly Rental (percentage)</Text>
              <TextInput
                placeholder="Enter Percentage as whole Number 10 for 10%"
                keyboardAppearance="default"
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="next"
                style={styles.textbox1}
                onChangeText={weeklyDiscountText =>
                  this.setState({ weeklyDiscountText })
                }
                autoCorrect={false}
              />

              <Text style={styles.heading}>Category Selection</Text>
              <View style={styles.selectBox}>
                <Dropdown
                  label='Select Category'
                  data={categoriesList}
                  onChangeText={this.onChangeTextCategories}
                />
              </View>
              <Text style={styles.heading}>Subcategory Selection</Text>
              <View style={styles.selectBox}>
                <Dropdown
                  label='Select Sub Category'
                  data={this.state.subCatList}
                  onChangeText={(value, index, data) => {
                    this.setState({
                      selectedSubCategory: data[index]
                    })
                  }}
                />
              </View>

              <Text style={styles.heading}>Delivery Option</Text>
              <View style={styles.selectBox}>
                <Dropdown
                  label="Select Delivery / Pickup"
                  data={this.state.deliveryPickupOptionData}
                  value={this.state.deliveryPickupOption.value}
                  onChangeText={(value, index, data) => {
                    this.setState({
                      deliveryPickupOption: data[index]
                    })
                  }} />
              </View>
              <Text style={styles.heading}>Delivery Fee</Text>
              <TextInput
                placeholder="The Price for delivery"
                keyboardAppearance="default"
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="next"
                style={styles.textbox1}
                onChangeText={deliveryFeeText =>
                  this.setState({ deliveryFeeText })
                }
                autoCorrect={false}
              />

              <Text style={styles.heading}>Item Location</Text>
              <View style={{ flexDirection: "row" }}>
                <View>
                  <Text style={styles.textboxLoc}>{this.state.locationText}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.btnLoc}
                    onPress={this.selectLocation}
                  >
                    <Text style={styles.textcolor}>Get My Location</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.heading}>Taxes(If Applicable)</Text>
              <TextInput
                placeholder="Taxes"
                keyboardAppearance="default"
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="next"
                style={styles.textbox1}
                onChangeText={taxesText => this.setState({ taxesText })}
                autoCorrect={false}
              />

              <TouchableOpacity style={styles.btn} onPress={this.uploadPost}>
                <Text style={styles.textcolor1}>Upload Post</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        }

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
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  }
});
