
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header, Left, Right, Icon } from 'native-base';
import { DrawerActions } from 'react-navigation';


export default class Home extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Ionicons name='ios-person' color="#000000" size={31} />
    )
  }
  render() {
    return (
     
      <View style={styles.container}>
         <Icon name = "menu"  onPress = {()=>this.props.navigation.openDrawer()} style={styles.menu}/> 
        <Text style={styles.welcome}>Welcome to Home</Text>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  menu: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '5%',
    marginLeft: '3%',
    position: 'absolute'


  },
});
