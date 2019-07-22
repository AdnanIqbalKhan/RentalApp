
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  Switch,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import Geocoder from 'react-native-geocoder';
import CalendarPicker from 'react-native-calendar-picker';

import {
  connectFirebase,
  getData,
} from "../../backend/firebase/utility";


export default class ItemDetails extends Component {
  static navigationOptions = {
    title: 'Request Rental',
    headerTintColor: 'white',
    headerStyle: {
      textAlign: 'center',
      backgroundColor: '#1b96fe',
    },
    headerTitleStyle: { textAlign: 'center', alignSelf: 'center', color: 'white' },
  };
  itemId = ""


  state = {
    selectedStartDate: null,
    selectedEndDate: null,
    itemData: null,
    itemUser: null
  }

  constructor(props) {
    super(props)

    const { navigation } = this.props;
    this.itemId = navigation.getParam('id', 'NO-ID');
    const item = navigation.getParam('item', 'NO-ITEM');
    this.onDateChange = this.onDateChange.bind(this);

    connectFirebase()
    getData('users', item.userID).then(user => {
      this.setState({
        itemData: item,
        itemUser: user
      })
      Geocoder.geocodePosition({
        lat: item.location.latitude,
        lng: item.location.longitude
      })
        .then(res => {
          this.setState({
            itemLocation: res[0]
          })

        })
        .catch(e => console.log(e))
    }).catch(e => console.log(e))
  }

  onDateChange(date, type) {
    console.log(date, type)
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  formatDate(date) {
    Moment.locale('en');
    var dt = new Date(date);
    return Moment(dt).format('ddd MMM DD, YYYY')
  }

  render() {
    var item = this.state.itemData;
    var user = this.state.itemUser;

    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = null
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';


    return (
      <View style={styles.container}>
        {item ?
          <ScrollView>
            <View style={{ backgroundColor: 'white', width: '100%', height: 150 }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 150, height: 150, alignSelf: "center" }} />
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 50, marginLeft: 10 }} />
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 50, marginLeft: 20 }} />
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 50, marginLeft: 20 }} />
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 50, marginLeft: 20 }} />
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 50, marginLeft: 20 }} />
              </ScrollView>

            </View>
            <View style={styles.title}>
              <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 8, marginBottom: 15 }}>
                <View >
                  <Text style={{ color: 'black', fontSize: 16, marginLeft: 10 }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Ionicons name={'ios-pin'} size={18} color={'grey'} />
                    {this.state.itemLocation
                      ? (<Text>  {this.state.itemLocation.formattedAddress}  </Text>)
                      : (<Text>  {"lat:" + item.location.latitude + ",lon:" + item.location.longitude}  </Text>)
                    }
                  </View>
                </View>
                <View>
                  <TouchableOpacity style={styles.btnrent} onPress={() => this.props.navigation.navigate('RequestRental',
                    { item_id: this.itemId, item: this.state.itemData, post_user: this.state.itemUser })}>
                    <Text style={styles.textcolorrent}>Rent now</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
            <View style={styles.boxSummary}>
              <View style={{ flexDirection: 'row', marginTop: 6, marginLeft: 5 }}>
                <View >
                  <Text style={{ color: 'black', fontSize: 13, marginLeft: 10 }}>Daily:</Text>
                </View>
                <View>
                  <Text style={{ marginLeft: 211, color: 'black', fontSize: 13 }}>${item.dailyRate}</Text>
                </View>

              </View>
              <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                <View >
                  <Text style={{ color: 'black', fontSize: 13, marginLeft: 10 }}>Weekly:</Text>
                </View>
                <View>
                  <Text style={{ marginLeft: 198, color: 'black', fontSize: 13 }}>
                    ${item.dailyRate * 7 * (1 - item.weeklyDiscount / 100)}
                  </Text>
                </View>

              </View>
              <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                <View >
                  <Text style={{ color: 'black', fontSize: 13, marginLeft: 10 }}>Deposit(Refundable):</Text>
                </View>
                <View>
                  <Text style={{ marginLeft: 120, color: 'black', fontSize: 13 }}>$40.00</Text>
                </View>

              </View>

            </View>

            <View style={styles.boxDetails}>
              {user ?
                <TouchableHighlight onPress={() => this.props.navigation.navigate('SellerProfile', {
                  id: user.UserId
                })}>
                  <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                    <View style={{ marginLeft: 6 }}>
                      <Image source={require('../../assets/avatar.png')} style={{ width: 60, height: 60, borderRadius: 60 }} />
                    </View>
                    <View style={{ marginLeft: 15 }}>
                      <Text style={{ color: 'black', fontSize: 16 }}>{user.firstName}</Text>

                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.avatarRating}>
                          {
                            (item.rating.star == -1) ?
                              "No Reviews"
                              :
                              item.rating.star
                          }

                          {item.rating.star != -1 && <Ionicons name={'ios-star'} size={16} color={'#ffcc00'} />}
                        </Text>
                        <Text>{user['rating'] ? ( user.rating.star == -1 ? "" : "(" + user.rating.count + ")" ) : null}</Text>
                      </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 155, alignSelf: 'center' }}>
                      <Icon name="chevron-right" size={32} color='white' style={{ textAlign: 'right', marginRight: 5, color: 'black', fontSize: 18 }} />
                    </View>

                  </View>
                </TouchableHighlight>
                :
                <Text>{"User not found"}</Text>
              }
            </View>
            <View>
              <Text style={styles.heading}>
                {"Description"}
              </Text>
            </View>
            <View style={styles.delivery}>
              <Text style={{ top: 6, marginLeft: 5, color: 'black' }}>
                {item.description}
              </Text>
            </View>

            <View>
              <Text style={styles.heading}>
                {"Pickup and Delivery"}
              </Text>
            </View>
            <View style={styles.delivery}>
              <Text style={{ top: 6, marginLeft: 5, color: 'black' }}>
                {item.deliveryPickupOption + " is available for this item you can make your selection below after you select dates. \n\n"}
                {
                  (item.deliveryPickupOption != "Pickup")
                    ? "The delivery fee for this item is $" + item.deliveryFee
                    : ""
                }
              </Text>
            </View>
            <View>
              <Text style={styles.heading}>
                {"Availability"}
              </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                todayBackgroundColor="#f2e6ff"
                selectedDayColor="#7300e6"
                selectedDayTextColor="#FFFFFF"
                onDateChange={this.onDateChange}
              />
            </View>
            <View>
              <View style={styles.boxSummaryend}>
                <View style={{ flexDirection: 'row', marginTop: 6, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>Start Date:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 43, color: 'black', fontSize: 13 }}>{this.formatDate(startDate)}</Text>
                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>Start Time:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 39, color: 'black', fontSize: 13 }}>10AM - 11AM</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 100, alignSelf: 'center' }}>
                    <Icon name="chevron-right" size={32} color='white' style={{ textAlign: 'right', marginRight: 5, color: 'black', fontSize: 18 }} />
                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>End Date:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 52, color: 'black', fontSize: 13 }}>{this.formatDate(endDate)}</Text>
                  </View>

                </View>

              </View>

            </View>
            <View style={{ marginTop: 5 }}>
              <View style={styles.boxSummaryendr}>
                <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, marginTop: 4, fontWeight: 'bold' }}>Select Delivery</Text>
                  </View>
                  <View>
                    <Switch style={{ marginLeft: 171 }} />

                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>Rental Cost:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 193, color: 'black', fontSize: 13 }}>40.00</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>Delivery Fee:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 188, color: 'black', fontSize: 13 }}>10.00</Text>
                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 3 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>Deposit(Refundable):</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 132, color: 'black', fontSize: 13 }}>75.00</Text>
                  </View>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5, marginTop: 8 }}>
                  <View >
                    <Text style={{ color: 'black', fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Total Charges:</Text>
                  </View>
                  <View>
                    <Text style={{ marginLeft: 158, color: 'black', fontSize: 13, fontWeight: '400' }}>125.00</Text>
                  </View>

                </View>


              </View>

            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5, alignSelf: 'center' }}>
              <View>
                <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('RequestRental',
                  { item_id: this.itemId, item: this.state.itemData, post_user: this.state.itemUser })}>
                  <Text style={styles.textcolor}>Rent Now</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.textcolor}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          :
          <ActivityIndicator size="large" />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  title: {
    alignSelf: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    width: '96%',
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  boxSummary: {
    backgroundColor: 'white',
    width: '96%',
    height: 80,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 10
  },
  boxDetails: {
    backgroundColor: 'white',
    width: '96%',
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  avatarRating: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: '1%'
  },
  heading: {
    fontSize: 18,
    color: 'black',
    marginTop: 12,
    textAlign: 'center'
  },
  delivery: {
    alignSelf: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 5,
    width: '96%',
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  boxSummaryend: {
    backgroundColor: 'white',
    width: '96%',
    height: 80,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 10
  },
  boxSummaryendr: {
    backgroundColor: 'white',
    width: '96%',
    height: 150,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginBottom: 10
  },
  textcolor: {
    color: "#ffffff",
    fontSize: 15,
    textAlign: 'center',
  },
  textcolorrent: {
    color: '#1b96fe',
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b96fe',
    marginTop: 10,
    width: 130,
    height: 30,
    borderRadius: 5
  },
  btnrent: {
    backgroundColor: '#ffffff',
    marginLeft: 80,
    borderWidth: 1,
    width: 67,
    height: 22,
    borderColor: '#1b96fe',
    borderRadius: 5
  },
});
