import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {students} from '../utils/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigaiton = useNavigation();
  const [studentList, setStudentList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openModal = student => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalVisible(false);
  };
  useFocusEffect(
    useCallback(() => {
      const loadStudents = async () => {
        const storedStudents = await AsyncStorage.getItem('students');
        if (storedStudents) {
          setStudentList(JSON.parse(storedStudents));
        } else {
          setStudentList(students);
          await AsyncStorage.setItem('students', JSON.stringify(students));
        }
      };
      loadStudents();
    }, []),
  );
  const saveStudents = async updatedList => {
    setStudentList(updatedList);
    await AsyncStorage.setItem('students', JSON.stringify(updatedList));
  };

  const toggleSelectStudent = id => {
    setSelectedStudents(prevSelected => {
      const updatedSelected = {...prevSelected, [id]: !prevSelected[id]};
      const allSelected =
        Object.keys(updatedSelected).length === studentList.length &&
        Object.values(updatedSelected).every(val => val);
      setSelectAll(allSelected);
      return updatedSelected;
    });
  };

  const toggleSelectAll = () => {
    const newSelectionState = !selectAll;
    const newSelectedStudents = {};
    if (newSelectionState) {
      studentList.forEach(student => {
        newSelectedStudents[student.id] = true;
      });
    }
    setSelectAll(newSelectionState);
    setSelectedStudents(newSelectedStudents);
  };

  const deleteSelectedStudents = async () => {
    Alert.alert(
      'Delete Students',
      'Are you sure you want to delete the selected students?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            const remainingStudents = studentList.filter(
              student => !selectedStudents[student.id],
            );
            await saveStudents(remainingStudents);
            setSelectedStudents({});
            setSelectAll(false);
          },
        },
      ],
    );
  };

  const hasSelectedStudents = Object.values(selectedStudents).some(
    isSelected => isSelected,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🧑🏻‍🎓 Student List</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterIcon}>
          <Image
            source={require('../assets/filter.png')}
            style={{width: 18, height: 20}}></Image>
        </TouchableOpacity>
      </View>
      <View style={{padding: 16, paddingBottom: 120}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.studentCountText}>All Students </Text>
            <Text style={styles.countBadge}>{studentList.length}</Text>
          </View>
          <View style={styles.topControls}>
            <TouchableOpacity
              onPress={toggleSelectAll}
              style={styles.checkboxAll}>
              <Ionicons
                name={selectAll ? 'checkbox' : 'square-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {hasSelectedStudents && (
              <TouchableOpacity
                onPress={deleteSelectedStudents}
                style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={studentList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.studentCard}>
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => openModal(item)}>
                <Image source={item.profileImage} style={styles.profileImage} />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentClass}>{item.class}</Text>
                  <Text style={styles.studentOtherDetails}>
                    Age: {item.yearsInSchool} | DOB: {item.dob}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleSelectStudent(item.id)}>
                <Ionicons
                  name={
                    selectedStudents[item.id] ? 'checkbox' : 'square-outline'
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {selectedStudent && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        Personal Information
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          closeModal();
                          navigaiton.navigate('EditStudent', {
                            studentId: selectedStudent.id,
                          });
                        }}>
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.infoRow}>
                      <Image
                        source={selectedStudent.profileImage}
                        style={styles.modalProfileImage}
                      />
                      <View>
                        <Text style={styles.infoText}>
                          {selectedStudent.name}
                        </Text>
                        <Text style={styles.subInfoText}>
                          Registration No:{' '}
                          {selectedStudent.registrationNo || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoDetails}>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Date of Birth: </Text>
                        {selectedStudent.dob}
                      </Text>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Mobile: </Text>
                        {selectedStudent.phone}
                      </Text>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Email Address: </Text>
                        {selectedStudent.email}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Guardian Information
                    </Text>
                    <View style={styles.infoDetails}>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Guardian Name: </Text>
                        {selectedStudent.guardian?.name || 'N/A'}
                      </Text>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Mobile: </Text>
                        {selectedStudent.guardian?.phone || 'N/A'}
                      </Text>
                      <Text style={styles.infoDetail}>
                        <Text style={styles.infoLabel}>Email Address: </Text>
                        {selectedStudent.guardian?.email || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {selectedStudent.familyMembers &&
                    selectedStudent.familyMembers.length > 0 && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Family Members</Text>
                        {selectedStudent.familyMembers.map((member, index) => (
                          <View key={index} style={styles.infoDetails}>
                            <Text style={styles.infoDetail}>
                              <Text style={styles.infoLabel}>First Name: </Text>
                              {member.firstName || 'N/A'}
                            </Text>
                            <Text style={styles.infoDetail}>
                              <Text style={styles.infoLabel}>Last Name: </Text>
                              {member.lastName || 'N/A'}
                            </Text>
                            <Text style={styles.infoDetail}>
                              <Text style={styles.infoLabel}>Phone: </Text>
                              {member.phone || 'N/A'}
                            </Text>
                            <Text style={styles.infoDetail}>
                              <Text style={styles.infoLabel}>Email: </Text>
                              {member.email || 'N/A'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.7}
        onPress={() => {
          navigaiton.navigate('AddStudent');
        }}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Sen-Bold',
    color: 'black',
  },
  filterIcon: {
    marginLeft: 16,
  },
  allStudents: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  allStudentsText: {
    fontSize: 16,
    fontFamily: 'Sen-Medium',
  },
  studentCount: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
  studentCountText: {
    fontSize: 16,
    fontFamily: 'Sen-Bold',
    color: 'black',
  },
  countBadge: {
    color: 'white',
    backgroundColor: 'black',
    paddingHorizontal: 8,
    borderRadius: 4,
    fontFamily: 'Sen-Regular',
  },
  fab: {
    position: 'absolute',
    zIndex: 30,
    bottom: 16,
    right: 16,
    backgroundColor: 'black',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Sen-SemiBold',
    color: '#333',
  },
  studentClass: {
    fontSize: 14,
    fontFamily: 'Sen-Medium',
    color: '#666',
  },
  studentOtherDetails: {
    fontSize: 12,
    fontFamily: 'Sen-Regular',
    color: '#888',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxAll: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginHorizontal: 8,
  },
  studentCountContainer: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Sen-Bold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Sen-Bold',
    color: '#333',
  },
  subInfoText: {
    fontSize: 14,
    fontFamily: 'Sen-Medium',
    color: '#666',
  },
  infoDetails: {
    paddingTop: 8,
  },
  infoDetail: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Sen-Regular',
    color: '#555',
  },
  infoLabel: {
    fontFamily: 'Sen-Bold',
    color: '#000',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Sen-Bold',
  },
});

export default Home;
