import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import GetLocation from 'react-native-get-location';
import { getDistance, convertDistance } from 'geolib';
import { mainCategoriesList, subCategoriesList } from '../../backend/data/CategoriesList'



export default class Filter extends Component {

  constructor() {
    super()

    let sOptions = [
      { value: "Category" },
      { value: "Rating" },
      { value: "Price" },
      { value: "Delivery" },
      { value: "Pickup" }
    ]
    let distanceOptions = [
      { value: 5, label: "5 miles" },
      { value: 10, label: "10 miles" },
      { value: 15, label: "15 miles" },
      { value: 20, label: "20 miles" },
      { value: 25, label: "25 miles" },
      { value: 50, label: "50 miles" },
      { value: 100, label: "100 miles" },
      { value: 150, label: "150 miles" },
      { value: 200, label: "200 miles" }
    ]


    this.state = {
      subCatList: [],
      selectedCategory: null,
      selectedSubCategory: null,

      sortOptions: sOptions,
      selectedSort: null,

      maxDistanceOptions: distanceOptions,
      selectedMaxDistance: null,

      selectedDisplay: 'grid',
      gridDisplayBtn: true,

      maxPricePerDay: null,
      maxSecurityDeposit: null,
      maxDepositRefundable: null,
      maxDeliveryFee: null
    }

    this.onChangeTextCategories = this.onChangeTextCategories.bind(this)
    this.onPress = this.onPress.bind(this)
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

  applyFilters(filter, d) {
    let data = d;
    if (filter.category != null) {
      data = data.filter((item, i) => {
        return item.category.id == filter.category.id;
      })
    }
    if (filter.subCategory != null) {
      data = data.filter((item, i) => {
        return item.subCategory.id == filter.subCategory.id;
      })
    }
    if (filter.maxDistance != null) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          data = data.filter((item, i) => {
            return parseFloat(convertDistance(getDistance({
              latitude: location.latitude,
              longitude: location.longitude
            }, {
                latitude: item.location.latitude,
                longitude: item.location.longitude
              }), 'mi')) <= parseFloat(filter.maxDistance);
          })
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        })


    }
    if (filter.maxPricePerDay != null) {
      data = data.filter((item, i) => {
        return parseFloat(item.dailyRate) <= parseFloat(filter.maxPricePerDay);
      })
    }
    if (filter.maxSecurityDeposit != null) {
      // data = data.filter((item, i) => {
      //   return item TODO <= filter.maxSecurityDeposit;
      // })
    }
    if (filter.maxDepositRefundable != null) {
      // data = data.filter((item, i) => {
      //   return item TODO <= filter.maxDepositRefundable;
      // })
    }
    if (filter.maxDeliveryFee != null) {
      data = data.filter((item, i) => {
        return parseFloat(item.deliveryFee) <= parseFloat(filter.maxDeliveryFee);
      })
    }
    if (filter.sort != null) {
      switch (filter.sort) {
        case "Category":
          data = data.sort((a, b) => {
            return parseInt(a.category.id) - parseInt(b.category.id)
          })
          break;
        case "Rating":
          data = data.sort((a, b) => parseInt(a.rating.star) - parseInt(b.rating.star))
          break;
        case "Price":
          data = data.sort((a, b) => parseFloat(a.dailyRate) - parseFloat(b.dailyRate))
          break;
        case "Delivery":

          data = data.sort((a, b) => {
            let d1 = a.deliveryFee != "" ? parseFloat(a.deliveryFee) : 0
            let d2 = b.deliveryFee != "" ? parseFloat(b.deliveryFee) : 0
            return d1 - d2
          })
          break;
        case "Pickup":
          // data = data.sort((a, b) => TODO)
          break;
        default:
          break;
      }
    }
    return data
  }


  onPress() {
    let data = this.props.navigation.getParam('data', [])

    let filters = {
      category: this.state.selectedCategory,
      subCategory: this.state.selectedSubCategory,
      maxDistance: this.state.selectedMaxDistance,
      sort: this.state.selectedSort,
      maxPricePerDay: this.state.maxPricePerDay,
      maxSecurityDeposit: this.state.maxSecurityDeposit,
      maxDepositRefundable: this.state.maxDepositRefundable,
      maxDeliveryFee: this.state.maxDeliveryFee
    }

    let k = this.applyFilters(filters, data)

    this.props.navigation.navigate('Catalog', {
      displayType: this.state.selectedDisplay,
      filteredData: k
    })
  }

  render() {
    let categoriesList = mainCategoriesList.map(n => { return { value: n.name, id: n.id } });
    var disabled = this.state.gridDisplayBtn;
    return (
      <View style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.PickerStyle}>
              <Dropdown
                label='Sort By'
                data={this.state.sortOptions}
                onChangeText={(value, index, data) => {
                  this.setState({
                    selectedSort: data[index].value
                  })
                }}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '500', marginTop: 5 }}>Display</Text>
            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5, alignSelf: 'center' }}>
              <View>
                <TouchableOpacity
                  style={disabled ? styles.disabled : styles.btn}
                  disabled={disabled}
                  onPress={() => {
                    this.setState({
                      gridDisplayBtn: !disabled,
                      selectedDisplay: 'grid'
                    })
                  }}>
                  <Text style={styles.textcolor}>Grid View</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity
                  style={!disabled ? styles.disabled : styles.btn}
                  disabled={!disabled}
                  onPress={() => {
                    this.setState({
                      gridDisplayBtn: !disabled,
                      selectedDisplay: 'list'
                    })
                  }} >
                  <Text style={styles.textcolor}>List View</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput placeholder='Max Price Per Day' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} keyboardType="number-pad"
                onChangeText={maxPricePerDay => this.setState({ maxPricePerDay })} />

              <TextInput placeholder='Max Security Deposit' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} keyboardType="number-pad"
                onChangeText={maxSecurityDeposit => this.setState({ maxSecurityDeposit })} />

              <TextInput placeholder='Max Deposit(Refundable)' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} keyboardType="number-pad"
                onChangeText={maxDepositRefundable => this.setState({ maxDepositRefundable })} />

              <TextInput placeholder='Max Delivery Fee' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} keyboardType="number-pad"
                onChangeText={maxDeliveryFee => this.setState({ maxDeliveryFee })} />

            </View>

            <View style={styles.PickerStyle}>
              <Dropdown
                label='Select Category'
                data={categoriesList}
                onChangeText={this.onChangeTextCategories}
              />
            </View>
            <View style={styles.PickerStyle}>
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
            <View style={styles.PickerStyle}>
              <Dropdown
                label='Select Max Distance'
                data={this.state.maxDistanceOptions}
                onChangeText={(value) => {
                  this.setState({
                    selectedMaxDistance: value
                  })
                }}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity style={styles.btn} onPress={this.onPress}>
                <Text style={styles.textcolor}>Apply</Text>
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
  PickerStyle: {
    width: '96%',
    marginTop: 5,
    marginLeft: 6,
    borderRadius: 5
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',

    backgroundColor: '#1b96fe',
    justifyContent: 'center',
    marginTop: 10,
    width: 130,
    height: 30,
    borderRadius: 5

  },
  disabled: {
    alignSelf: 'center',
    alignItems: 'center',

    backgroundColor: '#62a582',
    justifyContent: 'center',
    marginTop: 10,
    width: 130,
    height: 30,
    borderRadius: 5

  },
  textcolor: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: '500',
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
});
