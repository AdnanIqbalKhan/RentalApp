import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import Moment from 'react-moment';
import {
  connectFirebase,
  getDocByObjectKey
} from "../../backend/firebase/utility";
import GlobalConst from '../../config/GlobalConst';
import { _retrieveData } from '../../backend/AsyncFuncs'

export default class Notification extends Component {
  static navigationOptions = {
    title: 'Notification',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({ loading: true })
    connectFirebase()
    _retrieveData(GlobalConst.STORAGE_KEYS.userId)
      .then(userId => {
        getDocByObjectKey('requests', 'postOnwerId', userId)
          .then(a => {
            this.setState({ data: a, loading: false })
          }).catch(e => {
            console.log(e)
            this.setState({ error: e, loading: false })
          })
      })
      .catch(e => {
        console.log(e)
        this.setState({ error: e, loading: false })
      })
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
        }}
      />
    );
  };

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => {
    console.log(item)
    return (
      <ListItem
        leftAvatar={{ source: { uri: item.itemImage } }}
        title={<View><Text>New Booking Request</Text></View>}
        subtitle={
          <View style={styles.subtitleView}>
            <Text>A new booking request for {item.postTitle}  from {item.requesterName} requires your review</Text>
            <Moment interval={0} fromNow element={Text}>
              {new Date(item.time.toDate())}
            </Moment>
          </View>
        }
      />
    )
  }

  render() {
    console.log(this.state.data)
    if (this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }
    return (
      <View >
        {(this.state.data.length == 0) ?
          <Text>No notification found</Text>
          :
          <FlatList
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.renderSeparator}
          />
        }
      </View>
    );
  }
}

styles = StyleSheet.create({
  subtitleView: {
  },
  menu: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '5%',
    marginLeft: '3%',
    position: 'absolute'
  }
})
