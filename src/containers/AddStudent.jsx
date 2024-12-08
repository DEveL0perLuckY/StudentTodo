import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stud10 from '../assets/stud10.png';

const AddStudent = ({navigation}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    class: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value});
  };

  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      const students = JSON.parse(await AsyncStorage.getItem('students')) || [];
      const newStudent = {
        id: Math.random().toString(36).substring(2, 15),
        profileImage: stud10,
        age: 20,
        name: formData.firstName + ' ' + formData.lastName,
        phone: formData.phone,
        class: formData.class || '5th',
        yearsInSchool: '2 years',
        dob: formData.dob || 'Feb 14, 2012',
        email: formData.email || 'demo@example.com',
      };
      const updatedStudents = [...students, newStudent];
      await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));

      Alert.alert('Success', 'Student saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save student.');
      console.error(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Student</Text>
        </View>
        <View>
          <Image
            style={styles.studImg}
            source={require('../assets/stud10.png')}></Image>
        </View>

        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          placeholderTextColor="#888"
          value={formData.firstName}
          onChangeText={value => handleInputChange('firstName', value)}
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          placeholderTextColor="#888"
          value={formData.lastName}
          onChangeText={value => handleInputChange('lastName', value)}
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={value => handleInputChange('phone', value)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter date of birth"
          placeholderTextColor="#888"
          value={formData.dob}
          onChangeText={value => handleInputChange('dob', value)}
        />

        <Text style={styles.label}>Class</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter class"
          placeholderTextColor="#888"
          value={formData.class}
          onChangeText={value => handleInputChange('class', value)}
        />

        <View
          style={{
            flexDirection: 'row',
            gap: 30,
            justifyContent: 'space-evenly',
            flex: 1,
          }}>
          <TouchableOpacity
            style={styles.cancleButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.cancleButtonText}>Cancle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Sen-Bold', // Bold font for header titles
    color: 'black',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Sen-SemiBold', // Semi-bold font for labels
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Sen-Regular', // Regular font for input fields
    marginTop: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Sen-Bold', // Bold font for save button text
    fontSize: 16,
  },
  cancleButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    flex: 1,
    borderWidth: 1,
  },
  cancleButtonText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Sen-Bold', // Bold font for cancel button text
    fontSize: 16,
  },
  studImg: {
    width: 90,
    height: 90,
    borderRadius: 70,
  },
});

export default AddStudent;
