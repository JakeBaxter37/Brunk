import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Workout, workouts } from "../../constants/workouts";



export  default function Home() 
{
    const [workoutList, setWorkoutList] = useState<Workout[]>(workouts);
    const [loaded,setLoaded] = useState(false);
    const [newName, setNewName] = useState("");

    function addWorkout()
    {
      if (newName.trim() === "") return; // returns early if name is blank

      const newWorkout: Workout = { // creates the new workout with a name and makes the sets blank
        id: Date.now().toString(), // creates a unique id based on the time
        name: newName.trim(),
      } 
      setWorkoutList([...workoutList, newWorkout]); // sets the workouts to all the old workouts with the new one added
      setNewName(""); // makes the text box blank after adding
    } 

    function confirmRemove(w: Workout)
    {
        Alert.alert("Delete workout", `delete ${w.name} and all its exercises?`,[
          {text: "Cancel", style:"cancel"},
          {text: "Delete", style:"destructive", onPress: () => removeWorkout(w.id)},
        ]);
    }


    function removeWorkout(id: string)
    {
        setWorkoutList(workoutList.filter((w) => w.id !== id)); // sets new sets to newExercises
        AsyncStorage.removeItem(`exercises-${id}`)
        AsyncStorage.removeItem(`sessions-${id}`);
    }




    useEffect(() => 
    {
        AsyncStorage.getItem("workouts").then((saved) =>  // look in AsyncStorage and get the saved data for the page
        {
            if (saved) setWorkoutList(JSON.parse(saved)); // if there is saved data put it into the exercises for the workout
            setLoaded(true); // confirm it has been loaded
        });
    },[]); // run the first time the page is opened

    useEffect(()=> 
    {
      if (loaded) AsyncStorage.setItem("workouts", JSON.stringify(workoutList)); // saves excersises for a workout into AsyncStorage as a string
    }, [workoutList, loaded]); // runs when either the exercises are updated, page is loaded or key changes(new page opened) 



  
  return(
    <SafeAreaView  style = {styles.screen}>

    <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
    >
    
    <Text  style = {styles.title}> 
      Brunk
    </Text>  

    <View style = {styles.card}>
      <Text style = {styles.text}>10,000</Text>
      <Text style = {styles.text}>Steps</Text>
    </View>


    <View style={styles.row}>
        <TextInput 
                style = {styles.input}
                value = {newName}
                returnKeyType="done"
                onSubmitEditing={addWorkout}
                onChangeText = {setNewName}
                placeholder="Workout Name"
                placeholderTextColor="#aaa"
          />
        <Pressable onPress = {addWorkout}>
            <Text style={styles.button}>Add Workout +</Text>
        </Pressable>
    </View>
    
    <View style = {styles.workoutsContainer}>
      {workoutList.map((workout) => (
        <View key = {workout.id} style = {styles.card}>
        <Link  
          href={{ pathname: "/workouts/[id]", params: { id: workout.id, name: workout.name }, }}      
          asChild
        >
            <Pressable style = {styles.cardName}>
                <Text style = {styles.text}>{workout.name}</Text>
            </Pressable>
        </Link>
        <Pressable 
        onPress = {() => confirmRemove(workout)}
        hitSlop={10}
        accessibilityLabel={`Delete ${workout.name}`}
        >
          <Text style = {styles.delete}>X</Text>
        </Pressable>
        </View>
      ))}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  
screen: { 
  flex: 1, 
  backgroundColor: "#2b2d2d" 
},

container: {
  flexGrow: 1, 
  alignItems: "center",
  padding: 20,
},
  title: {
    color:"#fdce32",
    fontSize:30,
    fontWeight:"bold",
    padding:20,
  },
  subtitle: {
    color:"#fff",
    fontSize:20,
    alignSelf: "flex-start",
    padding:20,
    paddingBottom:0,
  },
  card: {
    backgroundColor:"#4e4f4f",
    padding:20,
    margin:20,
    borderRadius:10,
    marginBottom:20,
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  cardName: 
  { flex: 1 },

  workoutsContainer: {
    backgroundColor:"#373737",
    padding:10,
    margin:15,
    borderRadius:10,
    marginBottom:20,
    justifyContent:"center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color:"#fff",
    fontSize:20,
  },

  button:{
    backgroundColor: "#5e5d5d",
    color: "#fdce32",
    fontSize: 18,
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  delete:{
    backgroundColor: "#5e5d5d",
    color: "#fdce32",
    fontSize: 18,
    padding: 3,
    width:27,
    height:27,
    borderRadius: 8,
    textAlign: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  row: {
    alignItems:"center",
    flexDirection:"row",
    gap:12,
    marginBottom:12,
    justifyContent:"space-between",
  },

  input:{
    backgroundColor: "#737373",
    color: "#fff",
    fontSize: 18,
    width: 200,
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },
});