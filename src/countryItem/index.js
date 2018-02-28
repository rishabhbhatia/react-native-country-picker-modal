import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native'

import styles from '../CountryPicker.style';

export default class CountryItem extends React.PureComponent {

  renderCountryDetail(cca2) {
    return (
      <View style={styles.itemCountry}>
        {/* {CountryPicker.renderFlag(cca2)} */}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>{this.props.countryName}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.onSelectCountry(this.props.country)}
        activeOpacity={0.99}
      >
        {this.renderCountryDetail(this.props.country)}
      </TouchableOpacity>
    );
  }
}