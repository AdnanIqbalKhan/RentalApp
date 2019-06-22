
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { mainCategoriesList, subCategoriesList } from '../../backend/data/CategoriesList'



export default class Filter extends Component {

  constructor() {
    super()
    this.state = {
      subCatList: [],
      selectedCategoty: null,
      selectedSubCategoty: null
    }

    this.onChangeTextCategories = this.onChangeTextCategories.bind(this)
    this.onChangeTextSubCategories = this.onChangeTextSubCategories.bind(this)
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
      selectedCategoty:data[index]
    })


  }

  onChangeTextSubCategories(value, index, data) {
    this.setState({
      selectedSubCategoty: data[index]
    })
  }

  render() {

    let categoriesList = mainCategoriesList.map(n => { return { value: n.name, id: n.id } });

    let data = [{
      value: 'Option 1',
    }, {
      value: 'Option 2',
    }, {
      value: 'Option 3',
    }];
    return (
      <View style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.PickerStyle}>
              <Dropdown
                label='Sort By'
                data={data}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '500', marginTop: 5 }}>Display</Text>
            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5, alignSelf: 'center' }}>
              <View>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.textcolor}>Grid View</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.textcolor}>List View</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput placeholder='Max Price Per Day' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} />

              <TextInput placeholder='Max Security Deposit' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} />

              <TextInput placeholder='Max Deposit(Refundable)' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} />

              <TextInput placeholder='Max Delivery Fee' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false} />

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
                onChangeText={this.onChangeTextSubCategories}
              />
            </View>
            <View style={styles.PickerStyle}>
              <Dropdown
                label='Select Max Distance'
                data={data}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity style={styles.btn}>
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
