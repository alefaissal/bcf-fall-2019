import React from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Image, TouchableOpacity} from 'react-native';

const {white} = Colors;

export const sharedNavigationOptions = navigation => ({
  headerBackTitle: null,
  headerLeft: null,
  visible: true,
  headerStyle: {
    backgroundColor: '#013859',
  },
  headerTitleStyle: {
    color: 'white',
  },
  headerTintColor: white,
  headerRight: () => (
    <TouchableOpacity
      style={{marginRight: 0}}
      onPress={() => {
        navigation.toggleDrawer();
      }}>
      <Image
        source={require('../assets/images/icMenuWhite.png')}
        name="burger-menu"
      />
    </TouchableOpacity>
  ),
});
