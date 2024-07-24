import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, Button } from 'react-native';

export default function App() {
  const INITIAL_POSITION = { x: 100, y: 100 };
  const INITIAL_DIRECTION = 0;

  const [catPosition, setCatPosition] = useState(INITIAL_POSITION);
  const [catDirection, setCatDirection] = useState(INITIAL_DIRECTION);
  const [actions, setActions] = useState([]);
  const [availableActions] = useState([
    { key: 'up', label: 'Move Up' },
    { key: 'down', label: 'Move Down' },
    { key: 'left', label: 'Move Left' },
    { key: 'right', label: 'Move Right' },
    { key: 'rotateClockwise', label: 'Rotate Clockwise' },
    { key: 'rotateAnticlockwise', label: 'Rotate Anticlockwise' },
  ]);
  const [availableEvents, setAvailableEvents] = useState([
    { key: 'clickIcon1', label: 'Event 1', action: null },
    { key: 'clickIcon2', label: 'Event 2', action: null },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const moveCat = (direction) => {
    switch (direction) {
      case 'up':
        setCatPosition((prev) => ({ ...prev, y: prev.y - 10 }));
        break;
      case 'down':
        setCatPosition((prev) => ({ ...prev, y: prev.y + 10 }));
        break;
      case 'left':
        setCatPosition((prev) => ({ ...prev, x: prev.x - 10 }));
        break;
      case 'right':
        setCatPosition((prev) => ({ ...prev, x: prev.x + 10 }));
        break;
    }
  };

  const rotateCat = (angle) => {
    setCatDirection((prev) => prev + angle);
  };

  const resetCat = () => {
    setCatPosition(INITIAL_POSITION);
    setCatDirection(INITIAL_DIRECTION);
    setActions([]); // Clear the list of selected actions
    setAvailableEvents([
      { key: 'clickIcon1', label: 'Event 1', action: null },
      { key: 'clickIcon2', label: 'Event 2', action: null },
    ]); // Reset events list
  };

  const executeAction = (actionKey) => {
    const action = availableActions.find(a => a.key === actionKey);
    if (action) {
      switch (action.key) {
        case 'up':
          moveCat('up');
          break;
        case 'down':
          moveCat('down');
          break;
        case 'left':
          moveCat('left');
          break;
        case 'right':
          moveCat('right');
          break;
        case 'rotateClockwise':
          rotateCat(15);
          break;
        case 'rotateAnticlockwise':
          rotateCat(-15);
          break;
        default:
          break;
      }
    }
  };

  const playActions = async () => {
    // Play actions for the selected actions
    for (const action of actions) {
      executeAction(action.key);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between actions
    }

    // Play actions for all events in sequence
    for (const event of availableEvents) {
      if (event.action) {
        executeAction(event.action);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between events
      }
    }
  };

  const getRotation = (angle) => {
    return `${angle}deg`;
  };

  const openModal = (eventKey) => {
    setCurrentEvent(eventKey);
    setModalVisible(true);
  };

  const selectActionForEvent = (actionKey) => {
    setAvailableEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.key === currentEvent ? { ...event, action: actionKey } : event
      )
    );
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.catContainer}>
        <TouchableOpacity onPress={playActions}>
          <Image
            source={{ uri: 'https://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg' }}
            style={[
              styles.cat,
              { left: catPosition.x, top: catPosition.y },
              { transform: [{ rotate: getRotation(catDirection) }] },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.availableActions}>
          <Text style={styles.listHeader}>Available Actions</Text>
          <ScrollView>
            {availableActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: '#f0a500' }]}
                onPress={() => setActions((prev) => [...prev, action])}
              >
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.availableEvents}>
          <Text style={styles.listHeader}>Available Events</Text>
          <ScrollView>
            {availableEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.eventButton, { backgroundColor: '#74b9ff' }]}
                onPress={() => openModal(event.key)}
              >
                <Text style={styles.eventText}>
                  {event.label} {event.action ? `: ${availableActions.find(a => a.key === event.action).label}` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.selectedActions}>
          <Text style={styles.listHeader}>Selected Actions</Text>
          <ScrollView>
            {actions.map((action, index) => (
              <View key={index} style={[styles.actionButton, { backgroundColor: '#00b894' }]}>
                <Text style={styles.actionText}>{action.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={playActions} style={[styles.controlButton, { backgroundColor: '#0984e3' }]}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetCat} style={[styles.controlButton, { backgroundColor: '#d63031' }]}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Action for Event</Text>
            {availableActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: '#f0a500' }]}
                onPress={() => selectActionForEvent(action.key)}
              >
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f1e3',
  },
  cat: {
    width: 250,
    height: 150,
    position: 'absolute', // Add position to enable movement
  },
  catContainer: {
    height: 300, // Increase height to allow cat movement
    position: 'relative', // Add relative position for catContainer
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  availableActions: {
    width: '30%',
  },
  availableEvents: {
    width: '30%',
  },
  selectedActions: {
    width: '30%',
  },
  actionButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  eventButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
  },
  eventText: {
    color: '#fff',
  },
  listHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#2d3436',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});