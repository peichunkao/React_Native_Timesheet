import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ButtonSelector from './ButtonSelector';
import moment from 'moment'

const Summary = ({ blogPosts: allTasks, userId, summaryView }) => {
  const [option, setOption] = useState(0)
  const buttons = ['DAILY', 'WEEKLY', 'MONTHLY', 'TOTAL'];
  const colorCode = ['#617be3', '#61d4b3', '#fdd365', '#fb8d62', '#f54291']
  const teamTasks = [
    { task: 'Task1', ratio: 0.13, color: '#617be3' },
    { task: 'Task2', ratio: 0.26, color: '#61d4b3' },
    { task: 'Task3', ratio: 0.07, color: '#fdd365' },
    { task: 'Task4', ratio: 0.32, color: '#fb8d62' },
    { task: 'Task5', ratio: 0.22, color: '#f54291' },
  ];
  const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);
  let persionalTasks = allTasks.filter(task => task.userId === userId)
  let totalTime = 0
  let taskList = []
  let data = 0

  function summaryJobs(tasks, taskList, startTime, endTime) {
    let result = []
    if (summaryView) {
      for (let i = 0; i < persionalTasks.length; i++) {
        if (!persionalTasks[i].isTimeOff && (moment(tasks[i].startTime).diff(startTime) > 0) && (moment(endTime).diff(tasks[i].endTime) > 0)) {
          totalTime = totalTime + parseInt(moment(persionalTasks[i].endTime).diff(persionalTasks[i].startTime, 'minutes'), 10)
        }
        if (!taskList.includes(persionalTasks[i].task) && !persionalTasks[i].isTimeOff && (moment(tasks[i].startTime).diff(startTime) > 0) && (moment(endTime).diff(tasks[i].endTime) > 0)) {
          taskList.push(persionalTasks[i].task)
        }
      }
    } else {
      for (let i = 0; i < allTasks.length; i++) {
        if (!allTasks[i].isTimeOff && (moment(tasks[i].startTime).diff(startTime) > 0) && (moment(endTime).diff(tasks[i].endTime) > 0)) {
          totalTime = totalTime + parseInt(moment(allTasks[i].endTime).diff(allTasks[i].startTime, 'minutes'), 10)
        }
        if (!taskList.includes(allTasks[i].task) && !allTasks[i].isTimeOff && (moment(tasks[i].startTime).diff(startTime) > 0) && (moment(endTime).diff(tasks[i].endTime) > 0)) {
          taskList.push(allTasks[i].task)
        }
      }
    }

    for (let i = 0; i < taskList.length; i++) {
      let taskSummary = 0
      for (let j = 0; j < tasks.length; j++) {
        if ((taskList[i] === tasks[j].task) && (moment(tasks[j].startTime).diff(startTime) > 0) && (moment(endTime).diff(tasks[j].endTime) > 0)) {
          taskSummary = taskSummary + parseInt(moment(tasks[j].endTime).diff(tasks[j].startTime, 'minutes'), 10)
        }
      }
      let hours = (taskSummary - (taskSummary % 60)) / 60;
      let minutes = taskSummary % 60;
      result = [...result, { task: taskList[i], ratio: taskSummary / totalTime, color: teamTasks[i].color, time: `${hours} h ${minutes} m` }]
    }
    return result
  }

  if (summaryView) {
    //Persional Summary
    switch (option) {
      case 0: //Daily schedule
        data = summaryJobs(persionalTasks, taskList, moment().startOf('day'), moment().endOf('day'))
        break
      case 1: //Weekly schedule
        data = summaryJobs(persionalTasks, taskList, moment().startOf('week'), moment().endOf('week'))
        break
      case 2: //Monthly schedule
        data = summaryJobs(persionalTasks, taskList, moment().startOf('month'), moment().endOf('month'))
        break
      case 3: //Total schedule
        data = summaryJobs(persionalTasks, taskList, moment().startOf('year'), moment().endOf('year'))
        break
    }
  } else {
    //Team Summary
    switch (option) {
      case 0: //Daily schedule
        data = summaryJobs(allTasks, taskList, moment().startOf('day'), moment().endOf('day'))
        break
      case 1: //Weekly schedule
        data = summaryJobs(allTasks, taskList, moment().startOf('week'), moment().endOf('week'))
        break
      case 2: //Monthly schedule
        data = summaryJobs(allTasks, taskList, moment().startOf('month'), moment().endOf('month'))
        break
      case 3: //Total schedule
        data = summaryJobs(allTasks, taskList, moment().startOf('year'), moment().endOf('year'))
        break
    }
  }

  return (
    <>
      <ButtonSelector buttons={buttons} setOption={option => setOption(option)} />
      {
        // option === 1 &&
        <View style={styles.container}>
          {summaryView && <Text style={styles.title}>Personal Summary</Text>}
          {!summaryView && <Text style={styles.title}>Team Summary</Text>}
          <Text style={styles.subtitle}>{buttons[`${option}`]} Jobs</Text>
          <FlatList
            data={data}
            keyExtractor={teamTasks => teamTasks.task}
            renderItem={({ item }) => {
              return (
                <View style={styles.taskContainer}>
                  <View style={styles.bar}></View>
                  <View style={{ flexDirection: 'row', marginTop: -16 }}>
                    <View style={{ ...styles.colorBar, flex: item.ratio, backgroundColor: item.color, }}></View>
                    <View style={styles.stuff}></View>
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={styles.label}>{item.task}</Text>
                    <Text style={styles.label}>{item.time}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    marginBottom: 15,
    fontSize: 13,
    color: '#696969',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  taskContainer: {
    marginTop: 30,
  },
  bar: {
    flex: 1,
    height: 16,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  },
  colorBar: {
    height: 16,
    borderRadius: 8,
  },
  stuff: {

  },
  taskContent: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  }
});

export default Summary;
