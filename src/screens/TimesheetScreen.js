import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TimeSheetForm from "../components/TimeSheetForm";

const TimesheetScreen = () => {

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.header}>TimesheetScreen</Text>
        <TimeSheetForm />
      </ScrollView>
    </SafeAreaView>
  );
};

TimesheetScreen.navigationOptions = {
  title: "Timesheet",
  tabBarIcon: (
    <MaterialCommunityIcons name="playlist-edit" size={26} color="gray" />
  )
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "lightgray"
  }
});

export default TimesheetScreen;
