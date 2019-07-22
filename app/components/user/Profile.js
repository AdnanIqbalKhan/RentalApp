import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, ScrollView,TouchableOpacity,TouchableHighlight, Switch, ImageBackground, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatGrid } from 'react-native-super-grid';
import * as theme from '../catalog/theme'
import { Dropdown } from 'react-native-material-dropdown';
import { connectFirebase, saveData, getData } from '../../backend/firebase/utility';
import {_retrieveData} from '../../backend/AsyncFuncs';
import GlobalConst from '../../config/GlobalConst';


export default class Profile extends Component {
  static navigationOptions = {
    header: null,
    drawerIcon: ({ tintColor }) => (
      <Ionicons name='ios-person' color="#000000" size={31} />
    )
  }

  constructor(props) {
    super(props);
    this.state = ({
      loader: false,
      firstName: '',
      lastName: '',
      companyName: '',
      location: false,
      pushNotifications: false,
      emailNotifications: false,
      textNotifications: false,
      paypalAccount: '',
      squareAccount: '',
      paymentMethod: '',
      date: ''
    });
    this.onPress = this.onPress.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    connectFirebase();
    this.getData();
  }

  async getData(){
    this.setState({ loader: true });
    let currentUserId = await _retrieveData(GlobalConst.STORAGE_KEYS.userId);
    let userData = await getData('users', currentUserId);
    await this.setState({
      currentUserId: currentUserId,
      loader: false,
      firstName: userData['firstName'] ? userData.firstName : '',
      lastName: userData['lastName'] ? userData.lastName : '',
      companyName: userData['companyName'] ? userData.companyName : '',
      date: userData['dateJoined'] ? userData.dateJoined.substring(0,15) : 'joining date will appear here',
      location: userData['location'] ? userData.location : '',
      pushNotifications: userData['pushNotifications'] ? userData.pushNotifications : false,
      emailNotifications: userData['emailNotifications'] ? userData.emailNotifications : false,
      textNotifications: userData['textNotifications'] ? userData.textNotifications : false,
      paypalAccount: userData['paypalAccount'] ? userData.paypalAccount : '',
      squareAccount: userData['squareAccount'] ? userData.squareAccount : '',
      paymentMethod: userData['paymentMethod'] ? userData.paymentMethod : '',
     });
  }

  async onPress() {
    this.setState({ loader: true });
    let jsonObject = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      companyName: this.state.companyName,
      location: this.state.location,
      pushNotifications: this.state.pushNotifications,
      emailNotifications: this.state.emailNotifications,
      textNotifications: this.state.textNotifications,
      paypalAccount: this.state.paypalAccount,
      squareAccount: this.state.squareAccount,
      paymentMethod: this.state.paymentMethod,
    };
    let currentUserId = await _retrieveData(GlobalConst.STORAGE_KEYS.userId);
    await saveData('users', currentUserId, jsonObject);
    this.setState({ loader: false });
   }


  render() {
    let data = [{
      value: 'Option 1',
    }, {
      value: 'Option 2',
    }, {
      value: 'Option 3',
    }];
    return (
      <View style={styles.container}>

        <View>
          <Header style={{ backgroundColor: '#1b96fe' }}>
            <Left style={{ flex: 1 }}>
              <Button transparent>
                <Icon name="menu" color='white' onPress={() => this.props.navigation.openDrawer()} />
              </Button>
            </Left>
            <Body style={{ flex: 1 }}>
              <Title style={{ fontSize: 20 }}>My Profile</Title>
            </Body>
            <Right style={{ flex: 1 }}>


            </Right>
          </Header>
        </View>

        <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>

        {this.state.loader ? <ActivityIndicator size="large" color="#0000ff" /> : null}

          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.boxSummary}>
              <View style={{ alignItems: 'center', marginTop: 5 }}>
                <Image source={require('../../assets/avatar.png')} style={{ width: 110, height: 110, borderRadius: 110 }} />
              </View>
              <View style={{ marginTop: 3 }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: 'black' }}>
                  Name: {this.state.firstName}
          </Text>
              </View>
              <View style={{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center' }}>
                <Text style={styles.avatarRating}>4.5<Ionicons name={'ios-star'} size={14}
                  color={'#000'} /></Text>
                <Text> (1)</Text>
              </View>

              <View>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: 'black' }}>
                  Member Since : <Text style={{ color: '#1b96fe' }} >{this.state.date}</Text>
                </Text>
              </View>
              <View>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: 'black' }}>
                  Location : {this.state.location}
          </Text>
              </View>
            </View>
            <View>
              <Text style={styles.heading}>
                My Settings
                    </Text>
            </View>
            <View style={styles.center}>
              <TextInput placeholder={'first name'} keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox1} autoCorrect={false}
                onChangeText={(firstName) => this.setState({firstName})}
                value={this.state.firstName}
              />

              <TextInput placeholder={'last name'} keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false}
                onChangeText={(lastName) => this.setState({lastName})}
                value={this.state.lastName}
              />

              <TextInput placeholder={'Company Name(Optional)'} keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false}
                onChangeText={(companyName) => this.setState({companyName})}
                value={this.state.companyName}
              />


            </View>
            <View style={{ marginTop: 5 }}>
              <View style={styles.boxSummaryendr}>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10, marginTop: 4, }}>Location:</Text>
                  </View>
                  <View>
                    <Switch style={{ marginLeft: 219 }}
                      value={this.state.location}
                      onValueChange = {() => this.setState({location: !this.state.location})}
                    />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10, marginTop: 4, }}>Push Notification:</Text>
                  </View>
                  <View>
                    <Switch style={{ marginLeft: 159 }}
                      value={this.state.pushNotifications}
                      onValueChange = {() => this.setState({pushNotifications: !this.state.pushNotifications})}
                    />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10, marginTop: 4, }}>Email Notification:</Text>
                  </View>
                  <View>
                    <Switch style={{ marginLeft: 155 }}
                      value={this.state.emailNotifications}
                      onValueChange = {() => this.setState({emailNotifications: !this.state.emailNotifications})}
                    />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10, marginTop: 4, }}>Text Notification:</Text>
                  </View>
                  <View>
                    <Switch style={{ marginLeft: 165 }}
                      value={this.state.textNotifications}
                      onValueChange = {() => this.setState({textNotifications: !this.state.textNotifications})}
                    />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 8 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10 }}>Account Type:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 181, color: '#1b96fe', fontSize: 16 }}>Seller</Text>
                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 8 ,marginBottom:15}}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10 }}>Verify Account:</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.btn}>
                      <Text style={styles.textcolor}>Verify</Text>
                    </TouchableOpacity>
                  </View>

                </View>


              </View>

            </View>

            <View>
              <Text style={styles.heading}>
                Payment Information
                    </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <View style={styles.boxSummaryendp}>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, marginTop: 4, }}>PayPal Account:</Text>
                  </View>
                  <View>
                  <TextInput placeholder={'PayPal account'} keyboardAppearance='default' autoCapitalize='none'
                    returnKeyType='next' style={styles.textbox3} autoCorrect={false}
                    onChangeText={(paypalAccount) => this.setState({paypalAccount})}
                  />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, marginTop: 4, }}>Square Account:</Text>
                  </View>
                  <View>
                  <TextInput placeholder={'Square Account'} keyboardAppearance='default' autoCapitalize='none'
                    returnKeyType='next' style={styles.textbox2} autoCorrect={false}
                    onChangeText={(squareAccount) => this.setState({squareAccount})}
                  />

                  </View>

                </View>
              <View style ={styles.PickerStyle}>
              <Dropdown
                label={this.state.paymentMethod == undefined ? 'Select Payment Method' : this.state.paymentMethod}
                data={data}
                onChangeText={(value, index, data) => this.setState({ paymentMethod: data[index].value })}
              />
            </View>
            </View>

            {this.state.loader ? <ActivityIndicator size="large" color="#0000ff" /> : null}

            <TouchableOpacity style={styles.btn2} onPress={() => this.onPress()}>
              <Text style={styles.textcolor2} >SAVE</Text>
            </TouchableOpacity>


            </View>
          </KeyboardAvoidingView>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  boxSummary: {
    flex: 1,
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 10,
    marginTop: 5
  },
  heading: {
    fontSize: 18,
    color: 'black',
    marginTop: 12,
    textAlign: 'center'
  },
  textbox: {
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    textAlign: 'left',
    height: 40,
    width: 320,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    color: "#000000",
  },
  textbox1: {
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    height: 40,
    fontSize: 16,
    textAlign: 'left',
    width: 320,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    color: "#000000",
  },
  textbox2: {
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
    height: 30,
    fontSize: 16,
    textAlign: 'left',
    width: 200,
    marginLeft:5,
    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    color: "#000000",
  },
  textbox3:{
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
    height: 30,
    fontSize: 16,
    textAlign: 'left',
    width: 200,
   marginLeft:7,

    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    color: "#000000",
  },
  boxSummaryendr: {
    flex: 1,
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 10
  },
  boxSummaryendp: {
    flex: 1,
    backgroundColor: 'white',
    width: '96%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 20
  },
  textcolor: {
    color: '#1b96fe',
    fontSize: 14,
    textAlign:'center',
    justifyContent: 'center',
    alignSelf:'center',
  },
  textcolor2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#ffffff',
    marginLeft: 150,
    borderWidth: 1,
    width: 67,
    height: 22,
    borderColor:'#1b96fe',
    borderRadius: 5
  },
  btn2: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b96fe',
    width: 260,
    height: 45,
    borderRadius: 5,
    marginVertical: 25
  },
  PickerStyle:{
    width:'96%',
    marginTop:5,
    marginLeft:6,
    borderRadius:5
  }




});
