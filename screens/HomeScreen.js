import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
  StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from Expo vector icons
import imagesData from '../imagesData'; // Import images data
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase.js';

const App = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user
  const [selectedTopic, setSelectedTopic] = useState('All'); // State to track selected topic
  const [popupVisible, setPopupVisible] = useState(false); // State to manage pop-up visibility
  const [selectedModel, setSelectedModel] = useState(null); // State to track selected model
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search query
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  // useEffect to listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user); // Update the current user state
    });
    return unsubscribe; // Cleanup function
  }, []);

  // Extract unique topics from imagesData
  const uniqueTopicsFromImages = Array.from(new Set(imagesData.map(item => item.topic)));

  // Include 'All' and other topics
  const allTopics = ['All', ...uniqueTopicsFromImages];

  // Filter images based on selected topic and search query
  const filteredImages = selectedTopic === 'All' 
    ? imagesData.filter(item => item.modelName.toLowerCase().includes(searchQuery.toLowerCase())) 
    : imagesData.filter(item => item.topic === selectedTopic && item.modelName.toLowerCase().includes(searchQuery.toLowerCase()));

  // Function to toggle pop-up visibility and set selected model
  const togglePopup = (model) => {
    setSelectedModel(model);
    setPopupVisible(!popupVisible);
  }

  // Function to handle contribute button press
  const handleContributePress = async () => {
    try {
      // Simulate loading state
      setIsLoading(true);
      // Open device local storage
      await AsyncStorage.setItem('contribution', 'Your contribution data goes here');
      console.log('Device local storage opened successfully!');
      navigation.navigate('community');
    } catch (error) {
      console.error('Error opening device local storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Animated rotation value for loading indicator
  const spinValue = new Animated.Value(0);

  // Spin animation for loading indicator
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Start animation when loading state changes
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isLoading]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Explore</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#6a737d"
          onChangeText={handleSearchChange}
        />
        {/* Loading indicator */}
        {isLoading && (
          <Animated.View style={[styles.loadingContainer, { transform: [{ rotate: spin }] }]}>
            <ActivityIndicator size="small" color="#ffffff" />
          </Animated.View>
        )}
      </View>

      {/* Topics */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topicContainer}>
        {/* Render all topics */}
        {allTopics.map(topic => (
          <TouchableOpacity
            key={topic}
            style={[styles.topicButton, { backgroundColor: selectedTopic === topic ? '#0366d6' : '#25292e' }]}
            onPress={() => setSelectedTopic(topic)}>
            <Text style={styles.topicButtonText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Image grid */}
      <ScrollView style={styles.imageGridContainer}>
        <View style={styles.imageGrid}>
          {/* Render images based on selected topic */}
          {filteredImages.map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => togglePopup(item)}>
              <View style={styles.imageContainer}>
                <Image
                  source={item.imageUri}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.imageTextContainer}>
                  <Text style={styles.imageText}>{item.modelName}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </ScrollView>

      {/* Pop-up */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={popupVisible}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.popupModelName}>{selectedModel?.modelName}</Text>
            <Text style={styles.popupDescription}>{selectedModel?.description}</Text>
            <Text style={styles.popupCreator}>Created by: {selectedModel?.creator}</Text>
            <TouchableOpacity style={styles.popupButton} onPress={() => console.log('AR simulation')}>
              <Text style={styles.popupButtonText}>AR Simulation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={() => console.log('Download model')}>
              <MaterialIcons name="cloud-download" size={24} color="white" />
              <Text style={styles.downloadButtonText}>Download Model</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="person" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contributeButton} onPress={handleContributePress}>
          <Text style={styles.contributeButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleSignOut}>
          <MaterialIcons name="exit-to-app" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#0366d6',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  loadingContainer: {
    marginRight: 10,
  },
  topicContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    height:100,
  },
  topicButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom:30,
  },
  topicButtonText: {
    color: '#ffffff',
  },
  imageGridContainer: {
    flex: 1,
    padding: 10,
    marginTop:-500,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  imageTextContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  imageText: {
    fontSize: 16,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  popupModelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupDescription: {
    marginBottom: 10,
  },
  popupCreator: {
    fontStyle: 'italic',
    marginBottom: 10,
  },
  popupButton: {
    backgroundColor: '#0366d6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  popupButtonText: {
    color: '#ffffff',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#ffffff',
    marginLeft: 5,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0366d6',
    paddingVertical: 10,
  },
  iconButton: {
    paddingHorizontal: 20,
  },
  contributeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 15,
  },
  contributeButtonText: {
    fontSize: 24,
    color: '#0366d6',
  },
});

export default App;
