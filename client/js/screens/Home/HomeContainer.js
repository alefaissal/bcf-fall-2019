import React, {Component} from 'react';
import {compose} from 'recompose';
import {graphql} from 'react-apollo';
import {
  QUERY_USER,
  QUERY_SELFGUIDED_TOUR,
  QUERY_ALL_EVENTS,
  QUERY_EVENT_THIS_WEEK,
} from '../../apollo/queries';
import {withCollapsible} from 'react-navigation-collapsible';
import {StatusBar} from 'react-native';
import Home from './Home';
import {getParamFromParent} from '../../lib/paramFromParent';
import {calculateRatingScore} from '../../lib/calculateRatingScore';
import PropTypes from 'prop-types';

class HomeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 88,
    };
  }

  componentDidMount() {
    this.setState({headerHeight: this.props.collapsible.paddingHeight});
  }

  static navigationOptions = () => {
    return {
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerBackground: () => {
        return <StatusBar barStyle="light-content" />;
      },
    };
  };

  render() {
    const {
      navigation,
      userInfo,
      allSelfGuidedTour,
      allEvents,
      eventThisWeek,
      collapsible,
    } = this.props;

    const popularEvents = allEvents && allEvents.events;

    const filteredPopularEvents =
      popularEvents &&
      popularEvents
        .sort((a, b) => {
          return (
            calculateRatingScore(b.reviews) - calculateRatingScore(a.reviews)
          );
        })
        .filter((_, index) => index < 4);

    return (
      <Home
        navigation={navigation}
        userInfo={userInfo.user}
        selfGuidedToursInfo={allSelfGuidedTour.selfGuidedTours}
        eventInfo={{
          allEvents: allEvents.events,
          thisWeek: eventThisWeek.events,
          popular: filteredPopularEvents,
        }}
        collapsible={collapsible}
        headerHeight={this.state.headerHeight}
      />
    );
  }
}

export default compose(
  graphql(QUERY_USER, {
    name: 'userInfo',
    options: ({navigation}) => {
      const userToken = getParamFromParent(navigation, 'userToken');

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          id: userToken.id,
        },
      };
    },
  }),

  graphql(QUERY_ALL_EVENTS, {
    name: 'allEvents',
  }),

  graphql(QUERY_SELFGUIDED_TOUR, {
    name: 'allSelfGuidedTour',
  }),

  graphql(QUERY_EVENT_THIS_WEEK, {
    name: 'eventThisWeek',
    options: props => {
      const date = new Date();
      const dateAfterWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          startFilterDate: date,
          endFilterDate: dateAfterWeek,
        },
        offset: 0,
        limit: 4,
      };
    },
  }),
)(withCollapsible(HomeContainer, {iOSCollapsedColor: 'transparent'}));
