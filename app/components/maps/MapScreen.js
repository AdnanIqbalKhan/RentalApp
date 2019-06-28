
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

export default class MapScreen extends Component {

  constructor(props) {
    super(props)

    const { navigation } = this.props;
    const itemId = navigation.getParam('id', 'NO-ID');
    const item = navigation.getParam('item', 'NO-ITEM');

    this.state = {
      location: item.location,
      title: item.title,
      description: item.description

    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.location
            ? <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker
                coordinate={{
                  latitude: this.state.location.latitude,
                  longitude: this.state.location.longitude
                }}
                title={this.state.title}
                description={this.state.description}
              />
            </MapView>
            : <Text>Loading Map...</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
