import { Dimensions, StyleSheet, PixelRatio } from 'react-native'
import { getHeightPercent } from './ratio'

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 25
  },
  modalContent: {
    maxHeight: height * 0.8,
    width: width * 0.8,
    backgroundColor: 'white',
  },
  countryListContainer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 19
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    width: 30,
    height: 30,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7%',
    width: '15%'
  },
  itemCountryName: {
    justifyContent: 'center',
    width: '70%',
    height: 20
  },
  countryName: {
    fontSize: getHeightPercent(2.2)
  },
  scrollView: {
    flex: 1
  },
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  }
});

export default styles;
