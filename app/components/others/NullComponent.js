import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';


export default class NullComponent extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
