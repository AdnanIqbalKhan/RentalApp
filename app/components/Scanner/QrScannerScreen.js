import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Linking, } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default class QrScannerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      show: true,
    });
  }

  async onSuccess(e) {
    Linking
      .openURL(e.data)
      .catch(err => console.error('An error occured', err));
  }

  render() {
    return (
      <View style={styles.container}>

        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          topContent={
            <Text style={styles.centerText}>
              Scan the QR code
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
