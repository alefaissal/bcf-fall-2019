import React, {Component} from 'react';
import {TouchableOpacity, Image, StatusBar} from 'react-native';
import ThankYou from './ThankYou';
import {THEME} from '../../config';
import styles from './styles';

class ThankYouContainer extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Event Booking',
      headerBackTitle: true,
      headerTitleStyle: {
        color: THEME.colors.astronautBlue,
      },
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },

      headerBackground: () => {
        return <StatusBar barStyle="dark-content" />;
      },

      headerRight: () => (
        <TouchableOpacity
          style={styles.headerMenu}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <Image
            source={require('../../assets/images/icMenuDefault.png')}
            name="burger-menu"
          />
        </TouchableOpacity>
      ),
    };
  };

  render() {
    const {navigation} = this.props;
    return <ThankYou navigation={navigation} />;
  }
}

export default ThankYouContainer;
