// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Text,
  TextInput,
  Platform,
  FlatList
} from 'react-native'

import _ from 'lodash';

import CountryItem from './countryItem';
import CloseButton from './CloseButton'
import styles from './CountryPicker.style'

let countries = null
let Emoji = null

const isEmojiable = Platform.OS === 'ios'

if (isEmojiable) {
  countries = require('../data/countries-emoji')
  Emoji = require('./emoji').default
} else {
  countries = require('../data/countries')

  Emoji = <View />
}

const cca2List = _.keys(countries);
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
    this.openModal = this.openModal.bind(this);
    this.renderCountry = this.renderCountry.bind(this);
    this.onCountrySelected = this.onCountrySelected.bind(this);

    this.state = {
      modalVisible: false,
      query: '',
    }
  }

  onCountrySelected(country) {
    this.setState({ modalVisible: false });
    const cca2 = cca2List[countriesList.indexOf(country)];
    this.props.onChange({ cca2, country });
  }

  onClose() {
    this.setState({
      modalVisible: false
    })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  getFilteredData = (query) => (query === '' ?
    countriesList :
    _.filter(countriesList, o => o.name.common.toLowerCase()
      .startsWith(query.trim().toLowerCase())));

  openModal() {
    this.setState({ modalVisible: true })
  }

  keyExtractor = (country) => country.name.common;

  renderCountry({ item }) {
    return (
      <CountryItem
        country={item}
        onCountrySelected={this.onCountrySelected}
      />
    )
  }

  render() {
    const { query } = this.state;
    const filteredCountries = this.getFilteredData(query);

    return (
      <View>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children ? (
            this.props.children
          ) :
            (
              <View style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]} >
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
          <TouchableWithoutFeedback onPress={() => { this.setState({ modalVisible: false }) }} >
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
                      style={styles.input}
                      onChangeText={text => this.setState({ query: text })}
                      value={this.state.query}
                    />
                  )}
                </View>
                <FlatList
                  contentContainerStyle={styles.countryListContainer}
                  data={filteredCountries}
                  renderItem={this.renderCountry}
                  keyExtractor={this.keyExtractor}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal >
      </View >
    )
  }
}
