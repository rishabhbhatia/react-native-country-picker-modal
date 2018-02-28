// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  Platform,
  FlatList
} from 'react-native'

import _ from 'lodash';

import CountryItem from './countryItem';

import CloseButton from './CloseButton'
import countryPickerStyles from './CountryPicker.style'

let countries = null
let Emoji = null
let styles = {}

const isEmojiable = Platform.OS === 'ios'

if (isEmojiable) {
  countries = require('../data/countries-emoji')
  Emoji = require('./emoji').default
} else {
  countries = require('../data/countries')

  Emoji = <View />
}

const cca2List = Object.keys(countries);
const countriesList = _.values(countries);

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Country Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: Image.propTypes.source,
    transparent: PropTypes.bool,
    animationType: PropTypes.string
  }

  static defaultProps = {
    translation: 'eng',
    filterPlaceholder: 'Search',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none'
  }

  static renderEmojiFlag(cca2, emojiStyle) {
    return (
      <Text style={[styles.emojiFlag, emojiStyle]}>
        {cca2 !== '' && countries[cca2.toUpperCase()] ? (
          <Emoji name={countries[cca2.toUpperCase()].flag} />
        ) : null}
      </Text>
    )
  }

  static renderImageFlag(cca2, imageStyle) {
    return cca2 !== '' ? (
      <Image
        style={[styles.imgStyle, imageStyle]}
        source={{ uri: countries[cca2].flag }}
      />
    ) : null
  }

  static renderFlag(cca2, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[styles.itemCountryFlag, itemStyle]}>
        {isEmojiable
          ? CountryPicker.renderEmojiFlag(cca2, emojiStyle)
          : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)
    this.renderCountry = this.renderCountry.bind(this)

    this.state = {
      modalVisible: false,
      // cca2List: countryList,
      filter: '',
    }

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key]
        ])
      })
      styles = StyleSheet.create(styles)
    } else {
      styles = countryPickerStyles
    }
  }

  _keyExtractor = (item, index) => this.getCountryName(item);

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
      filter: ''
    })

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2])
    })
  }

  getCountryName(country) {
    const translation = this.props.translation || 'eng';
    return country.name[translation] || country.name['common'] || country[Object.keys(o)[0]];
  }

  onClose() {
    this.setState({
      modalVisible: false,
      filter: ''
    })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  openModal() {
    this.setState({ modalVisible: true })
  }

  handleFilterChange = value => {
    const filteredCountries = value === '' ?
      countries :
      _.filter(countriesList, (o) => {
        return this.getCountryName(o).startsWith(value);
      });
    console.log('filteredCountries', value, filteredCountries.length, filteredCountries);

    this.setState({
      filter: value
    })
  }

  renderCountry({ item }) {
    return (
      <CountryItem
        country={item}
        countryName={this.getCountryName(item)}
      />
    )
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children ? (
            this.props.children
          ) : (
              <View
                style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]}
              >
                {CountryPicker.renderFlag(this.props.cca2)}
              </View>
            )}
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                {this.props.closeable && (
                  <CloseButton
                    image={this.props.closeButtonImage}
                    styles={[styles.closeButton, styles.closeButtonImage]}
                    onPress={() => this.onClose()}
                  />
                )}
                {this.props.filterable && (
                  <TextInput
                    autoFocus={this.props.autoFocusFilter}
                    autoCorrect={false}
                    placeholder={this.props.filterPlaceholder}
                    placeholderTextColor={this.props.filterPlaceholderTextColor}
                    style={[
                      styles.input,
                      !this.props.closeable && styles.inputOnly
                    ]}
                    onChangeText={this.handleFilterChange}
                    value={this.state.filter}
                  />
                )}
              </View>
              <FlatList
                contentContainerStyle={styles.countryListContainer}
                data={countriesList}
                renderItem={this.renderCountry}
                keyExtractor={this._keyExtractor}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
