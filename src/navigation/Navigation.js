import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../containers/Home';
import AddStudent from '../containers/AddStudent';
import EditStudent from '../containers/EditStudent';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          statusBarColor: '#00BFA6',
          orientation: 'portrait_up',
        }}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="StudentList"
          component={Home}
        />
        <Stack.Screen
          name="AddStudent"
          component={AddStudent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditStudent"
          component={EditStudent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
