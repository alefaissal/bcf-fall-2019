import React, {useState} from 'react';
import {
  Text,
  Animated,
  FlatList,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {VibrancyView} from '@react-native-community/blur';
import styles from './styles';
import {THEME} from '../../config';
import PropTypes from 'prop-types';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const Profile = ({collapsible, onSwitchTheme, headerHeight}) => {
  const _headerHeight = collapsible.paddingHeight
    ? collapsible.paddingHeight
    : headerHeight;
  const [isAnimated, setAnimated] = useState(false);
  const [headerAnimation, setHeaderAnimation] = useState(
    new Animated.ValueXY({x: 0, y: -_headerHeight}),
  );
  const {paddingHeight, animatedY} = collapsible;

  const onScroll = e => {
    const offset = e.nativeEvent.contentOffset;
    if (offset.y > _headerHeight && !isAnimated) {
      setAnimated(true);
      animateHeader();
      onSwitchTheme(isAnimated);
    } else if (offset.y <= _headerHeight && isAnimated) {
      setAnimated(false);
      animateHeader();
      onSwitchTheme(isAnimated);
    }
  };

  const animateHeader = () => {
    Animated.timing(headerAnimation, {
      duration: 500,
      toValue: isAnimated ? {x: 0, y: -_headerHeight} : {x: 1, y: 0},
    }).start();
  };

  return (
    <>
      {!paddingHeight && <View style={{height: _headerHeight}} />}

      <AnimatedScrollView
        scrollEventThrottle={32}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: 0}}}], {
          useNativeDriver: true,
          listener: onScroll,
        })}
        _mustAddThis={animatedY}
        contentContainerStyle={{
          paddingTop: paddingHeight,
          paddingBottom: THEME.spacing.default(3),
        }}
        scrollIndicatorInsets={{
          top: paddingHeight / 2,
          bottom: THEME.spacing.default(0.5),
        }}>
        <Text>Hello Profile</Text>
      </AnimatedScrollView>

      <Animated.View
        style={{
          ...styles.dynamicHeader,
          opacity: headerAnimation.x,
          top: headerAnimation.y,
          height: paddingHeight || _headerHeight,
        }}>
        <VibrancyView blurType="dark" blurAmount={2} style={styles.header} />
      </Animated.View>
    </>
  );
};

export default Profile;

Profile.propTypes = {
  collapsible: PropTypes.object,
  onSwitchTheme: PropTypes.func,
  headerHeight: PropTypes.number,
};
