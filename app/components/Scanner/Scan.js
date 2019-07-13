
import React, {Component} from 'react';

import {Platform, StyleSheet, Text, View, Image, ScrollView,TouchableOpacity,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Header, Left, Right, Icon, Button, Title, Body} from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default class Scan extends Component{
    static navigationOptions = {
        header: null,

      }
  render() {
    return (
      <View style={styles.container}>
      <View>
        <Header style ={{backgroundColor:'#1b96fe'}}>
          <Left style={{flex:1}}>
            <Button transparent>
            <Icon name="menu" color = 'white' onPress={() => this.props.navigation.openDrawer()} />
            </Button>
          </Left>
          <Body style={{flex:1}}>
            <Title style = {{fontSize:20}}>Start Rental</Title>
          </Body>
          <Right style={{flex:1}}>


          </Right>
        </Header>
        <View>
        <View style={styles.boxSummary}>
              <View>
                    <View style={{ flexDirection: 'row', marginTop:6 , marginLeft: 5 }}>
                        <View >
                            <Text style={{ color: 'black',fontWeight:'500', fontSize: 13,marginLeft:10 }}>Start Date:</Text>
                        </View>
                        <View>
                            <Text style={{marginLeft:5, color: 'black', fontSize: 13 }}>May 24, 2019</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                    <View >
                            <Text style={{ color: 'black',fontWeight:'500', fontSize: 13,marginLeft:10 }}>End Date:</Text>
                        </View>
                        <View>
                            <Text style={{marginLeft:5, color: 'black', fontSize: 13 }}>May 25, 2019</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                    <View >
                            <Text style={{ color: 'black',fontWeight:'500', fontSize: 13,marginLeft:10 }}>PickUp/DropOff Time:</Text>
                        </View>
                        <View>
                            <Text style={{marginLeft:5, color: 'black', fontSize: 13 }}>10:00 - 11:00</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                    <View >
                            <Text style={{ color: 'black',fontWeight:'500', fontSize: 13,marginLeft:10 }}>Distance:</Text>
                        </View>
                        <View>
                            <Text style={{marginLeft:5, color: 'black', fontSize: 13 }}>5 Miles</Text>
                        </View>

                    </View>
                  </View>
                  <View style = {{alignSelf:'center',marginLeft:'8%'}}>
                  <Image source={require('../../assets/Gen.jpg')} style={{ width: 80, height: 80, borderRadius: 10 }} />
                  </View>
                </View>
        </View>

        </View>
        <View style={styles.scan}></View>
        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('QrScannerScreen')}>
              <Text style={styles.textcolor}>* Scan QR Code</Text>
            </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  heading: {
    fontSize: 20,
    color: 'grey',
    marginTop: 5,
  },
  scan:{
    alignSelf:'center',
    backgroundColor: 'white',
    marginTop:25,
    marginBottom:10,
    width:'84%',
    height: 280,
    borderRadius:35,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',

    backgroundColor: '#1b96fe',
    justifyContent: 'center',
    marginTop: 10,
    width: 260,
    height: 45,
    borderRadius: 5

  },
  textcolor: {
    color: "#ffffff",
    fontSize: 18,
    textAlign:'center',


  },
  boxSummary: {
    backgroundColor: 'white',
    width: '94%',
    height: 100,
    marginTop:10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom:10,
    flexDirection: 'row'


},
});
