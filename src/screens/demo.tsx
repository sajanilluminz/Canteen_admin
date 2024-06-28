import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

const data = [
  {id: '1', text: 'Item 1'},
  {id: '2', text: 'Item 2'},
  {id: '3', text: 'Item 3'},
  {id: '4', text: 'Item 4'},
  {id: '5', text: 'Item 5'},
];

const Demo = () => {
  const [listData, setListData] = useState(data);
  const [swipeOutId, setSwipeOutId] = useState(null);

  const handleDelete = (item: {id: string}) => {
    setListData(listData.filter(listItem => listItem.id !== item.id));
  };

  const handleSwipeOut = (id: React.SetStateAction<null>) => {
    setSwipeOutId(id);
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemText}>{item.text}</Text>

        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={listData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onScroll={() => setSwipeOutId(null)}
      onTouchStart={() => setSwipeOutId(null)}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  listItemText: {
    fontSize: 18,
    flex: 1,
  },
  deleteButtonContainer: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: '100%',
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default Demo;
