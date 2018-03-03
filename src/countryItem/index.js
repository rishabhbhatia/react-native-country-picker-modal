import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Text
} from 'react-native'

import PropTypes from 'prop-types';

import styles from '../styles';

export default class CountryItem extends React.PureComponent {

  renderCountryDetail() {
    return (
      <View style={styles.itemCountry}>
        {Platform.OS === 'ios' ? this.props.renderFlag(this.props.cca2) : null}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>{this.props.country.name.common}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onCountrySelected(this.props.country)}
        activeOpacity={0.99}
      >
        {this.renderCountryDetail()}
      </TouchableOpacity>
    );
  }
}

CountryItem.propTypes = {
  country: PropTypes.objectOf(PropTypes.any).isRequired,
  onCountrySelected: PropTypes.func.isRequired,
  renderFlag: PropTypes.func.isRequired,
  cca2: PropTypes.string
}

CountryItem.defaultProps = {
  country: { name: { common: '' } },
  onCountrySelected: () => { },
  renderFlag: () => { },
  cca2: ''
};
