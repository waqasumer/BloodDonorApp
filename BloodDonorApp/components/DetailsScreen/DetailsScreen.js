import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { font } from "../../utils/font";
import color from "../../utils/color";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

class DetailsScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    tabBarVisible: true
  };

  handleOkButtonPress = () => {
    console.log("OK Pressed");
  };

  render() {
    const { item } = this.props.route.params;

    return (
      <View style={styles.DetailsScreen}>
        <Image
          style={{ width: "100%", height: 200 }}
          source={require("../../../assets/no-image.png")}
        />
        <View style={styles.infoWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>by {item.organiser}</Text>
          <Text style={[styles.baseStyles, styles.description]}>
            {item.description}
          </Text>
          <View style={[styles.baseStyles, styles.itemSeperation, styles.date]}>
            <View>
              <FontAwesome5 name="calendar-alt" size={18} light />
            </View>
            <View style={styles.itemSeperation__rightItem}>
              <Text>{item.date}</Text>
            </View>
          </View>
          <View
            style={[styles.baseStyles, styles.itemSeperation, styles.location]}
          >
            <View style={styles.itemSeperation__leftItem}>
              <FontAwesome5 name="map-marker-alt" size={20} light />
            </View>
            <View style={styles.itemSeperation__rightItem}>
              <Text style={styles.baseStyles}>{item.address}</Text>
            </View>
          </View>
        </View>
        <View style={styles.okButton__container}>
          <Button
            color={color.APP_BRAND_DARK}
            title="I am in"
            onPress={this.handleOkButtonPress}
          />
        </View>
      </View>
    );
  }
}

export default DetailsScreen;

const styles = StyleSheet.create({
  DetailsScreen: {
    flex: 1,
    flexDirection: "column"
  },
  infoWrapper: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  baseStyles: {
    fontSize: font.MEDIUM,
    marginTop: 10
  },
  title: {
    fontSize: font.XXL
  },
  description: {
    fontSize: font.LARGE
  },
  itemSeperation: {
    flex: 1,
    flexDirection: "row"
  },
  itemSeperation__rightItem: {
    marginLeft: 10
  },
  itemSeperation__leftItem: {
    marginTop: 10
  },
  location: {
    marginTop: 20
  },
  okButton__container: {
    width: "100%",
    position: "absolute",
    top: "90%",
    alignItems: "center"
  }
});
