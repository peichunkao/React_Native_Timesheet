import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import UserAvatar from '../components/UserAvatar';
import ViewSelector from '../components/ViewSelector';
import { Context as BlogContext } from '../context/BlogContext';
import { Context as ImageContext } from '../context/ImageContext';
import { Context as UserContext } from '../context/AuthContext';
import { Context as UserList } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons'
import iconStyle from '../style/iconStyle';
import containerStyle from '../style/containerStyle';
import moment from 'moment';


const TimesheetScreen = ({ navigation }) => {
  const { state, getBlogPosts } = useContext(BlogContext);
  const { setImages } = useContext(ImageContext);
  const { state: user } = useContext(UserContext);
  const [view, setView] = useState(true);
  const buttons = ['My Timesheet', 'Full Timesheet'];
  const [userRole, setUserRole] = useState('Employee')
  let personalTasks = []
  let filteredTasks = []
  let dateList = []

  Array.isArray(user) && (personalTasks = state.filter(task => task.userId === user[0]._id))
  filteredTasks = selectTasks(view)

  useEffect(() => {
    getBlogPosts();
    Array.isArray(user) && setUserRole(user[0].role)
    dateList = []
    Array.isArray(user) && (personalTasks = state.filter(task => task.userId === user[0]._id))
    filteredTasks = selectTasks(view)

    const listener = navigation.addListener('didFocus', () => {
      getBlogPosts();
      dateList = []
      setImages([]);
      filteredTasks = selectTasks(view)
    });
    return () => {
      listener.remove();
    };
  }, [view]);

  useEffect(() => {
    dateList = []
  }, [state])

  function selectTasks(view) {
    if (view) {
      return personalTasks
    } else {
      return state
    }
  }

  function futureToPast(dateA, dateB) {
    return (moment(dateB.startTime).valueOf() - moment(dateA.startTime).valueOf());
  }

  return (
    <View style={styles.screen}>
      {userRole === 'Manager' &&
        <ViewSelector buttons={buttons} setView={v => setView(v)} src='timesheets' />
      }
      <FlatList
        data={filteredTasks.sort(futureToPast)}
        keyExtractor={blogPost => blogPost._id}
        renderItem={({ item }) => {
          var sameDate = false
          dateList.includes(moment(item.startTime).format('L')) ? sameDate = true : dateList.push(moment(item.startTime).format('L'))
          var timeDiff = parseInt(
            moment(item.endTime).diff(moment(item.startTime), 'minutes')
          );
          var hours = (timeDiff - (timeDiff % 60)) / 60;
          var minutes = timeDiff % 60;
          return (
            <>
              {!sameDate &&
                <Text style={styles.time}>
                  {moment(item.startTime).format('ddd')}, {moment(item.startTime).format('DD MMMM YYYY')}
                </Text>
              }
              <TouchableOpacity
                style={{ ...styles.itemContainer, borderTopWidth: sameDate ? 0 : 1 }}
                onPress={() => navigation.navigate('Show', { id: item._id, startTime: item.startTime, status: item.status })}
              >
                <View style={containerStyle.rowSBCenter}>
                  <Text style={styles.item}>{item.task}</Text>
                  <Text style={styles.itemtime}>
                    {moment(item.startTime).format('LT')} - {moment(item.endTime).format('LT')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {item.status === 'APPROVED' &&
                    <Text style={{ ...styles.status, color: '#008000' }}>{item.status}</Text>
                  }
                  {item.status === 'DECLINED' &&
                    <Text style={{ ...styles.status, color: '#ff0000' }}>{item.status}</Text>
                  }
                  {item.status === 'PENDING' &&
                    <Text style={{ ...styles.status, color: '#ffa500' }}>{item.status}</Text>
                  }
                  <Text style={styles.timeDiff}>{hours} hrs {minutes} mins</Text>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
};

TimesheetScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Timesheets',
    headerLeft: <UserAvatar />,
    headerRight:
      <TouchableOpacity style={iconStyle.iconTouchRight} onPress={() => navigation.navigate('Create')}>
        {/* , { setDateList: navigation.state.params.setDateList } */}
        <Ionicons style={styles.addIcon} name='ios-add' />
      </TouchableOpacity>
  };
};

const styles = StyleSheet.create({
  addIcon: {
    fontSize: 26,
    color: '#20b2aa',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  time: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: 'stretch',
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc'
  },
  item: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  itemtime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#444',
  },
  timeDiff: {
    fontSize: 11,
    alignSelf: 'flex-end',
    fontWeight: '500',
    color: '#999'
  },
  status: {
    marginTop: 10,
    color: 'green',
    fontSize: 9,
    fontWeight: '600',
    flexWrap: 'nowrap'
  }
});

export default TimesheetScreen;
