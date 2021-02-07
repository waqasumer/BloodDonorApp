import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  Picker,
  Switch,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import DatePicker from "react-native-datepicker";
import color from "../../utils/color";
import { font } from "../../utils/font";

const FORM_ITEMS = ["title", "description", "address", "location", "date"];

function checkIfBlank(value) {
  if (value && value.trim() !== "") {
    return false;
  }

  return true;
}

class AddScreen extends React.Component {
  // const AddScreen = (props) => {
  // const [title, setTitle] = useState('')
  // const [description, setDescription] = useState('')
  // const [date, setDate] = useState('')
  // const [address, setAddress] = useState('')

  // adding title to the header
  static navigationOptions = {
    title: "Post Blood Requirment"
  };

  state = {
    title: "",
    description: "",
    address: "",
    location: "",
    date: "",
    isUrgent: false,
    focusedItem: "",
    dataSubmissionStatus: null,
    dataSubmissionError: null
  };
  picker = React.createRef();

  handleValueChange = (input, value) => {
    // save dato to the state
    saveValueToState = (field, data) => {
      this.setState(
        { [field]: data },
        // Also validate form item
        () => {
          this.validateFormItem(field);
        }
      );
    };

    // have to handle differently as <Picker/> component is firing
    // onValueChange() multiple time for single value change
    if (input === "location" && value !== "") {
      saveValueToState(input, value);
    } else if (input !== "location") {
      saveValueToState(input, value);
    }
  };

  handleFocus = input => {
    this.setState({ focusedItem: input });
  };

  handleBlur = input => {
    this.setState({ focusedItem: "" });
  };

  focusPicker = () => {
    this.picker.current.focus();
  };

  handleCancel = () => {
    this.props.navigation.navigate("Home");
  };

  handleSubmit = () => {
    if (this.checkIfFormIsValid()) {
      this.setState({ dataSubmissionStatus: "SAVING" });
      const {
        title,
        description,
        address,
        location,
        date,
        isUrgent
      } = this.state;
      const newEvent = {
        title,
        description,
        address,
        location,
        date,
        isUrgent
      };
      // call API to save data
      this.saveDataToDB(newEvent);
    }
  };

  checkIfFormIsValid = () => {
    // no need to valida `isActive`
    const isActiveIndex = FORM_ITEMS.indexOf("isActive");
    if (isActiveIndex > -1) {
      FORM_ITEMS.splice(isActiveIndex, 1);
    }
    const formErrors = FORM_ITEMS.map(item => this.validateFormItem(item));
    const hasError = errorMsg => {
      return typeof errorMsg === "string";
    };

    if (formErrors.some(hasError)) {
      return false;
    }
    return true;
  };

  validateFormItem = formItem => {
    // let errorMsg
    const value = this.state[formItem];
    const errorMsg = checkIfBlank(value) ? "Value cannot be empty" : null;
    this.setState(prevState => ({
      error: {
        ...prevState.error,
        [formItem]: errorMsg
      }
    }));

    return errorMsg;
  };

  saveDataToDB = async event => {
    const { api, onNavigateBack } = this.props.route.params;
    let dataSubmissionStatus = "INPROGRESS";
    let dataSubmissionError;

    try {
      const response = await api.addEvent(event);
      dataSubmissionStatus = "COMPLETED";
    } catch (error) {
      dataSubmissionStatus = "ERROR";
      dataSubmissionError = { code: 401, message: "Server Error" };
    }

    this.setState({
      dataSubmissionStatus: dataSubmissionStatus,
      dataSubmissionError: dataSubmissionError
    });

    if (dataSubmissionStatus === "COMPLETED") {
      // call onNavigateBack() to trigger reload and rerender
      onNavigateBack();
      // navigate to home
      // React Navigation method to go back
      this.props.navigation.goBack();
    }
  };

  render() {
    const { error } = this.state;
    const locationClassNames = [
      styles.location,
      error && error.location ? styles.inputError : null
    ].filter(Boolean);

    return (
      <View style={styles.addScreen__container}>
        <View style={styles.formItem}>
          <Text>Title</Text>
          <TextInput
            name="title"
            style={styles.textInput}
            value={this.state.title}
            placeholder="Enter title"
            selectionColor={color.BLUE_LIGHT}
            underlineColorAndroid={
              this.state.focusedItem === "title"
                ? color.BLUE_LIGHT
                : error && error.title
                ? color.APP_BRAND_DARKER
                : color.GREY_LIGHT
            }
            placeholderTextColor={
              error && error.title ? color.APP_BRAND_DARKER : null
            }
            blurOnSubmit={false}
            onFocus={() => this.handleFocus("title")}
            onBlur={() => this.handleBlur("title")}
            onSubmitEditing={Keyboard.dismiss}
            onChange={e => this.handleValueChange("title", e.nativeEvent.text)}
          />
          {error && error["title"] && (
            <Text style={styles.errorMsg}>{error["title"]}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text>Description</Text>
          <TextInput
            name="description"
            style={[styles.textInput, styles.textInput__multiLine]}
            value={this.state.description}
            placeholder="Elaborate more here"
            underlineColorAndroid={
              this.state.focusedItem === "description"
                ? color.BLUE_LIGHT
                : error && error.description
                ? color.APP_BRAND_DARKER
                : color.GREY_LIGHT
            }
            placeholderTextColor={
              error && error.description ? color.APP_BRAND_DARKER : null
            }
            multiline={true}
            numberOfLines={4}
            onFocus={() => this.handleFocus("description")}
            onBlur={() => this.handleBlur("description")}
            onSubmitEditing={Keyboard.dismiss}
            onChange={e =>
              this.handleValueChange("description", e.nativeEvent.text)
            }
          />
          {error && error.description && (
            <Text style={styles.errorMsg}>{error.description}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text>Address</Text>
          <TextInput
            name="address"
            placeholder="Enter Address"
            style={styles.textInput}
            underlineColorAndroid={
              this.state.focusedItem === "address"
                ? color.BLUE_LIGHT
                : error && error.address
                ? color.APP_BRAND_DARKER
                : color.GREY_LIGHT
            }
            placeholderTextColor={
              error && error.address ? color.APP_BRAND_DARKER : null
            }
            onFocus={() => this.handleFocus("address")}
            onBlur={() => this.handleBlur("address")}
            onChange={e =>
              this.handleValueChange("address", e.nativeEvent.text)
            }
          />
          {error && error.address && (
            <Text style={styles.errorMsg}>{error.address}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={{ marginBottom: -10 }}>District</Text>
          <View style={locationClassNames}>
            <Picker
              ref={this.picker}
              selectedValue={this.state.location}
              style={{ marginTop: 5, marginLeft: 1 }}
              onValueChange={(itemValue, itemIndex) => {
                this.handleValueChange("location", itemValue);
              }}
            >
              <Picker.Item
                color={
                  error && error.location
                    ? color.APP_BRAND_DARKER
                    : color.GREY_NORMAL
                }
                label="Select district"
                value=""
              />
              <Picker.Item label="Butwal" value="butwal" />
              <Picker.Item label="Bhairahawa" value="bhairahawa" />
              <Picker.Item label="Kathmandu" value="kathmandu" />
              <Picker.Item label="Narayanghad" value="narayanghad" />
              <Picker.Item label="Chitwan" value="chitwan" />
              <Picker.Item label="Pokhara" value="pokhara" />
              <Picker.Item label="Palpa" value="palpa" />
            </Picker>
          </View>
          {error && error.location && (
            <Text style={styles.errorMsg}>{error.location}</Text>
          )}
        </View>
        <View style={styles.formItem}>
          <Text style={{ marginBottom: 2 }}>Required by</Text>
          <DatePicker
            style={styles.date}
            format="DD-MM-YYYY"
            date={this.state.date}
            mode="date"
            placeholder="Select date"
            androidMode="spinner"
            minDate={getCurrentDate()}
            customStyles={{
              dateInput: {
                alignItems: "flex-start",
                paddingHorizontal: 5,
                paddingTop: 12,
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor:
                  error && error.date
                    ? color.APP_BRAND_DARKER
                    : color.GREY_LIGHT
              },
              placeholderText: {
                textAlign: "right",
                fontSize: 16,
                color:
                  error && error.date
                    ? color.APP_BRAND_DARKER
                    : color.GREY_NORMAL
              },
              dateText: {
                fontSize: 16
              },
              dateIcon: {
                height: 30
              }
            }}
            onDateChange={date => {
              this.handleValueChange("date", date);
            }}
          />
          {error && error.date && (
            <Text style={styles.errorMsg}>{error.date}</Text>
          )}
        </View>
        <View style={[styles.formItem, styles.isUrgent]}>
          <Text>Is Urgent?</Text>
          <View style={styles.isUrgent__switch}>
            <Switch
              value={this.state.isUrgent}
              trackColor={{ true: color.BLUE_LIGHT }}
              thumbColor={color.BG_HIGHLIGHT_LIGHT}
              onValueChange={value => {
                this.setState({ isUrgent: value });
              }}
            />
          </View>
        </View>
        <View style={styles.actionBar}>
          {this.state.dataSubmissionStatus === "ERROR" &&
            this.state.dataSubmissionError &&
            this.renderErrorMessage()}
          <View style={styles.actionBtn__container}>
            <TouchableHighlight
              style={[styles.actionBtn, styles.cancelBtn__wrapper]}
              onPress={() => this.handleCancel()}
              underlayColor={color.GREY_LIGHT}
            >
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.actionBtn, styles.submitBtn__wrapper]}
              onPress={() => this.handleSubmit()}
              underlayColor={color.APP_BRAND_DARK}
            >
              <Text style={styles.submitBtn}>Submit</Text>
            </TouchableHighlight>
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="small"
              animating={
                this.state.dataSubmissionStatus === "SAVING" ? true : false
              }
              color={color.BLUE_DARK}
            />
          </View>
        </View>
      </View>
    );
  }
  // Render data submission error message
  renderErrorMessage = () => {
    return (
      <View style={styles.errorMessage}>
        <Text style={styles.errorText}>Error Message goes here</Text>
      </View>
    );
  };
}

export default AddScreen;

//  ### Util Functions   ###
// get currrent date in 'DD-MM-YYYY' format
getCurrentDate = () => {
  const current_datetime = new Date();
  const month = current_datetime.getMonth() + 1;
  const monthsWithLeadingZero = month <= 9 ? "0" + month : month;
  return (
    current_datetime.getDate() +
    "-" +
    monthsWithLeadingZero +
    "-" +
    current_datetime.getFullYear()
  );
};

const styles = StyleSheet.create({
  addScreen__container: {
    padding: 30
  },
  formItem: {
    marginBottom: 8
  },
  textInput: {
    height: 40,
    fontSize: 15,
    paddingLeft: 8
  },
  textInput__multiLine: {
    maxHeight: 200
  },
  errorMsg: {
    marginTop: -7,
    marginBottom: 7,
    marginLeft: 5,
    color: color.APP_BRAND_DARK
  },
  location: {
    height: 45,
    marginTop: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: color.GREY_LIGHT
  },
  inputError: {
    borderBottomColor: color.APP_BRAND_DARKER
  },
  pickerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: color.BLUE_LIGHT
  },
  date: {
    width: 200,
    height: 40,
    marginBottom: 6
  },
  isUrgent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  isUrgent__switch: {
    marginRight: 305
  },
  actionBar: {
    marginTop: 80
  },
  errorMessage: {
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.APP_BRAND_DARK,
    backgroundColor: color.APP_BRAND_LIGHTER
  },
  errorText: {
    color: color.APP_BRAND_DARK
  },
  actionBtn__container: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row"
  },
  actionBtn: {
    padding: 5,
    width: 100,
    alignItems: "center",
    borderRadius: 5
  },
  cancelBtn__wrapper: {
    borderWidth: 1,
    borderColor: color.GREY_NORMAL
  },
  cancelBtn: {
    color: color.FONT_COLOR_DARK
  },
  submitBtn__wrapper: {
    backgroundColor: color.APP_BRAND_DARKER,
    marginLeft: 20
  },
  submitBtn: {
    color: color.WHITE,
    fontSize: font.MEDIUM
  },
  loadingIndicator: {
    marginLeft: -22
  }
});
