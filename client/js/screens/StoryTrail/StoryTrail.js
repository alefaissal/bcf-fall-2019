import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import AudioItem from '../../components/AudioItem';

import styles from './styles';
import {THEME} from '../../config/';

class StoryTrail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      audioPlayer: null,
      paused: true,
      currentTime: 0,
      duration: null,
      draggingSlider: false,
      draggingTime: 0,
    };
  }

  getMinutes = time => {
    if (time) {
      const totalMinutes = 60;
      let minutes = Math.floor(time / totalMinutes);
      // when the minute in time is less than 10, display with '0'
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return minutes;
    } else {
      return 0;
    }
  };

  getSeconds = time => {
    if (time) {
      const totalSeconds = 60;
      let seconds = Math.round(time % totalSeconds);
      // when the second in time is less than 10, display with '0'
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      return seconds;
    } else {
      return 0;
    }
  };

  updateCurrentTime = time => {
    this.setState({currentTime: time});
  };

  changeAudioStatus = bool => {
    this.setState({paused: bool});
  };

  render() {
    const {data} = this.props;
    const {image, audio, title, location} = data;

    return (
      <ScrollView style={styles.container}>
        <Image
          style={styles.imageMainBackground}
          source={{
            uri: image,
          }}
          resizeMode="cover"
        />
        <View style={styles.wrapperTrailImage}>
          <ImageBackground
            style={styles.circleTrailImage}
            source={require('../../assets/images/imgBgSelfGuidedTourAudio.png')}>
            <Image
              style={styles.TrailImage}
              resizeMode="cover"
              source={{
                uri: image,
              }}
            />
          </ImageBackground>
        </View>

        <View style={styles.contents}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.location}>{location}</Text>

          <Video
            source={{
              uri: audio.url,
            }}
            ref={ref => {
              this.state.audioPlayer = ref;
            }}
            audioOnly={true}
            disableFocus={true}
            playInBackground={true}
            paused={this.state.paused}
            onLoad={props => {
              props
                ? this.setState({isLoaded: true})
                : this.setState({isLoaded: false});
              this.setState({duration: props.duration});
            }}
            onProgress={({currentTime}) => {
              this.updateCurrentTime(currentTime);
            }}
            onSeek={({seekTime}) => {
              this.updateCurrentTime(seekTime);
            }}
            style={styles.backgroundVideo}
          />

          <View style={styles.wrapperController}>
            <View style={styles.wrapperSlider}>
              <Text style={{...styles.textSlider, ...styles.leftText}}>
                {this.state.draggingSlider
                  ? `${this.getMinutes(
                      this.state.draggingTime,
                    )}:${this.getSeconds(this.state.draggingTime)}`
                  : this.state.currentTime === 0
                  ? '00:00'
                  : `${this.getMinutes(
                      this.state.currentTime,
                    )}:${this.getSeconds(this.state.currentTime)}`}
              </Text>

              <Slider
                style={styles.slider}
                value={this.state.currentTime}
                minimumValue={0}
                maximumValue={this.state.duration}
                minimumTrackTintColor={THEME.colors.burntSienna}
                maximumTrackTintColor="rgba(0,0,0,0.16)"
                thumbImage={require('../../assets/images/mediaControllers/imgSlider.png')}
                onSlidingStart={() => {
                  this.setState({draggingSlider: true});
                }}
                onValueChange={newTime => {
                  this.setState({draggingSlider: true});
                  this.setState({draggingTime: newTime});
                }}
                onSlidingComplete={newTime => {
                  this.setState({draggingSlider: false});
                  this.updateCurrentTime(newTime);
                  this.state.audioPlayer.seek(newTime);
                }}
              />

              <Text style={{...styles.textSlider, ...styles.rightText}}>
                {`${this.getMinutes(this.state.duration)}:${this.getSeconds(
                  this.state.duration,
                )}`}
              </Text>
            </View>
          </View>

          <View style={styles.wrapperControllerIcon}>
            <TouchableHighlight
              style={styles.hotspotController}
              underlayColor={'rgba(0,0,0,0.32)'}
              onPress={() => {
                const currentTime = this.state.currentTime;
                // when the played time is less than 10 seconds, move time backwards to 0
                const newTime = currentTime > 10 ? currentTime - 10 : 0;
                this.state.audioPlayer.seek(newTime);
              }}>
              <Image
                resizeMode="cover"
                source={require('../../assets/images/mediaControllers/icAudioBackward.png')}
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={{...styles.hotspotController, ...styles.activeController}}
              underlayColor={'rgba(0,0,0,0.04)'}
              onPress={() => {
                this.setState({paused: !this.state.paused});
              }}>
              <Image
                resizeMode="cover"
                source={
                  this.state.paused
                    ? require('../../assets/images/mediaControllers/icAudioPlay.png')
                    : require('../../assets/images/mediaControllers/icAudioPause.png')
                }
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.hotspotController}
              underlayColor={'rgba(0,0,0,0.32)'}
              onPress={() => {
                const currentTime = this.state.currentTime;
                const durationTime = this.state.duration;
                const newTime =
                  currentTime + 10 > durationTime
                    ? durationTime
                    : currentTime + 10;
                this.state.audioPlayer.seek(newTime);
              }}>
              <Image
                resizeMode="cover"
                source={require('../../assets/images/mediaControllers/icAudioForward.png')}
              />
            </TouchableHighlight>
          </View>

          <View style={styles.wrapperListsOfAudio}>
            <Text style={styles.sectionTitle}>Lists of Audio</Text>
          </View>

          {audio.markers.map((list, index) => {
            return (
              <AudioItem
                key={list.id}
                title={list.title}
                description={list.description}
                playTime={list.start}
                allAudio={audio.markers}
                index={index}
                currentTime={this.state.currentTime}
                isPaused={this.state.paused}
                audioPlayer={this.state.audioPlayer}
                changeAudioStatus={this.changeAudioStatus}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export default StoryTrail;
