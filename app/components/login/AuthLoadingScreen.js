import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image, Dimensions } from 'react-native';
import GlobalConst from '../../config/GlobalConst';
import AsyncStorage from '@react-native-community/async-storage';
import { connectFirebase } from '../../backend/firebase/utility';


export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentDidMount() {
    connectFirebase();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem(GlobalConst.STORAGE_KEYS.userId);
    let that = this;
    setTimeout(function () {
      that.props.navigation.navigate(userToken ? 'App' : 'Auth');
    }, 2500);
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} resizeMode="contain" source={require('../../assets/SplashScreen.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#29b1eb',
  },
  logo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
