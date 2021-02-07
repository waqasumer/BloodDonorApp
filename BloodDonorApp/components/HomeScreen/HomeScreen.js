import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import color from "../../utils/color";
import { font } from "../../utils/font.js";
import api from "../../api/api";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// deriving top and left position of the add new button
// respetive to the screen dimension
const BUTTON_POSITION = Dimensions.get("screen").width - 50;
const screenHeight = Dimensions.get("screen").height;
const BUTTON_POSITION_TOP = screenHeight - (screenHeight > 800 ? 190 : 165);

class HomeScreen extends React.Component {
  state = {
    refreshing: false,
    loading: false,
    error: null,
    eventList: null
  };

  // creating instance of API
  API = api(axios);

  // removing default header
  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    // initialize API
    await this.API.initialize();
    const events = await this.fetchData();
    if (events) {
      setTimeout(() => {
        this.setState({
          loading: false,
          eventList: events
        });
      }, 3000);
    }
  };

  fetchData = async () => {
    let events;
    try {
      events = await this.API.getEvents();
      const sortedEvtList = events.sort((item1, item2) => {
        const date1 = item1.dateSubmitted;
        const date2 = item2.dateSubmitted;
        if (date1 < date2) return 1;
        if (date1 > date2) return -1;
        // must be equal
        return 0;
      });
      return sortedEvtList;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  handleOnPress = itemId => {
    const { eventList } = this.state;
    const itemObj = eventList.filter(item => item.id === itemId)[0];
    this.props.navigation.navigate("Details", {
      itemId: itemId,
      item: itemObj
    });
  };

  handleAddNewPress = () => {
    this.props.navigation.navigate("Add", {
      api: this.API,
      onNavigateBack: this.handleGoBack
    });
  };

  // hanldle FlatList refresh
  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      // get the latest event list
      this.fetchData().then(resolve => {
        this.setState({ refreshing: false, eventList: resolve });
      });
    });
  };

  handleGoBack = () => {
    this.handleRefresh();
  };

  // FlatList item Renderer
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.activity_container}
        onPress={() => this.handleOnPress(item.id)}
      >
        <View style={styles.activity__image}>
          <Image
            style={{ width: 50, height: "100%" }}
            source={require("../../../assets/no-image.png")}
          />
        </View>
        <View style={styles.activity__info}>
          <View style={styles.activityHeaderText__wrapper}>
            <Text
              style={styles.activityHeaderText}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
          <View style={styles.activity__info__organiserUrgentWrapper}>
            <Text style={styles.activity__info__organiser}>
              {item.organiser}
            </Text>
            {item.isUrgent && (
              <View style={styles.activity__info__isUrgent}>
                <Text style={styles.activity__info__isUrgent_text}>Urgent</Text>
              </View>
            )}
          </View>
          <View style={styles.activity__info__dateLocationWrapper}>
            <Text> {item.date} </Text>
            <Text> {item.location} </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{ height: 1, width: "100%", backgroundColor: "#C8C8C8" }} />
    );
  };

  render() {
    const { eventList, loading, error } = this.state;

    // error message
    if (!loading && error) {
      return (
        <View style={styles.errorContainer}>Error while fetching events!</View>
      );
    }

    if (!loading && eventList) {
      console.log("eventList", eventList);

      return (
        <View style={styles.container}>
          <Text style={{ fontSize: font.LARGE, alignItems: "center" }}>
            Current Activities
          </Text>
          <FlatList
            data={eventList}
            keyExtractor={item => item.id}
            // ItemSeparatorComponent={FlatListItemSeparator}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
          <TouchableOpacity
            style={styles.addNewButton__wrapper}
            onPress={this.handleAddNewPress}
          >
            <View style={styles.addNewButton}>
              <Text style={styles.addNewButton__text}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    // Loading indicator
    return (
      <View style={styles.loadingContainer}>
        <FontAwesome name="spinner" size={40} spin="pulse" />
        <Text>Loading...</Text>
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.BG_HIGHLIGHT_LIGHT,
    justifyContent: "center"
  },
  errorContainer: {
    backgroundColor: color.ERROR_BG,
    color: color.ERROR,
    justifyContent: "center"
  },
  loadingContainer: {
    position: "absolute",
    left: 150,
    top: 100
  },
  activity_container: {
    width: "90%",
    flex: 1,
    flexDirection: "row",
    backgroundColor: color.WHITE,
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 5,
    borderRadius: 5,
    elevation: 5
  },
  activity__image: {
    width: "15%"
  },
  activity__info: {
    width: "85%",
    marginLeft: 10,
    paddingBottom: 5
  },
  activityHeaderText__wrapper: {
    width: "95%"
  },
  activityHeaderText: {
    fontSize: font.LARGE,
    color: color.FONT_COLOR_DARK,
    fontWeight: "bold"
  },
  activity__info__organiserUrgentWrapper: {
    display: "flex",
    flexDirection: "row"
  },
  activity__info__organiser: {
    flex: 2,
    marginLeft: 4
  },
  activity__info__isUrgent: {
    flex: 1,
    marginRight: 10,
    marginLeft: 20,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: color.APP_BRAND_LIGHTER
  },
  activity__info__isUrgent_text: {
    textAlign: "center",
    color: color.APP_BRAND_DARK,
    fontWeight: "bold"
  },
  activity__info__dateLocationWrapper: {
    width: "95%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  addNewButton__wrapper: {
    position: "absolute",
    top: BUTTON_POSITION_TOP,
    bottom: 0,
    left: BUTTON_POSITION
  },
  addNewButton: {
    width: 40,
    height: 40,
    borderRadius: 150 / 2,
    backgroundColor: color.APP_BRAND_DARK,
    alignItems: "center"
  },
  addNewButton__text: {
    color: color.WHITE,
    fontSize: font.XXXL,
    top: -9
  }
});
