import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseCard from "../../components/ExerciseCard";
import { Exercise, Session, SetEntry } from "../../constants/workouts";




export  default function WorkoutDetail() 
{
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

    // set default values for the exercises and sets
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [newName, setNewName] = useState("");

    function addExercise()
    {
      if (newName.trim() === "") 
        {
          return;
        } // returns early if name is blank

      const newExercise: Exercise = { // creates the new exercise with a name and makes the sets blank
        name: newName.trim(),
        sets: [{ weight: "", reps: "", rpe: "" }],
      } 
      setExercises([...exercises, newExercise]); // sets the exercises to all the old exercises with the new one added
      setNewName(""); // makes the text box blank after
    } 



    //update the sets with new typed in data from the user
    function updateSet(exIndex:number, setIndex:number, field: keyof SetEntry, value: string) 
    {
        const newExercises = [...exercises]; // copy exercises into new variable
        const newSets = [...newExercises[exIndex].sets]; // copy the sets of the exercise we are changing
        newSets[setIndex] = {...newSets[setIndex], [field]:value}; // change the data in one box to what we typed
        newExercises[exIndex] = {...newExercises[exIndex], sets: newSets}; // add set changes to new exercise
        setExercises(newExercises); // set the exercise to new exercise
    }



    function addSet(exIndex:number)
    {
        const newExercises = [...exercises]; // copy exercises into new variable
        const sets = newExercises[exIndex].sets; // copy the sets of the exercise we are changing
        const lastSet = sets[sets.length - 1]; // finds last added set
        const newSet = lastSet ? {...lastSet} : { weight: "", reps: "", rpe: "" } // creates a copy of last set if it exists if not creates blank sets

        newExercises[exIndex] = {...newExercises[exIndex], sets: [...sets, newSet]}; // adds in the new sets to newExercises
        setExercises(newExercises); // sets new sets to newExercises
    }




    function removeExercise(exIndex:number)
    {
        const newExercises = [...exercises.slice(0, exIndex),...exercises.slice(exIndex + 1)]; // makes the sets in the exercise the new sets
        setExercises(newExercises); // sets new sets to newExercises
    }



    function removeSet(exIndex:number)
    {
        const sets = exercises[exIndex].sets; // copy the sets of the exercise we are changing

        if (sets.length <= 1) 
          {
              removeExercise(exIndex);
              return;
          }

        const newExercises = [...exercises]; // copy exercises into new variable
        const newSets = sets.slice(0, -1); // sets newSets to the sets without the last element

        newExercises[exIndex] = {...newExercises[exIndex], sets: newSets}; // makes the sets in the exercise the new sets
        setExercises(newExercises); // sets new sets to newExercises
    }



    const key= `exercises-${id}`;
    const [loaded,setLoaded] = useState(false);

    useEffect(() => 
      {
          AsyncStorage.getItem(key).then((saved) =>  // look in AsyncStorage and get the saved data for the page
          {
              if (saved) setExercises(JSON.parse(saved)); // if there is saved data put it into the exercises for the workout
              setLoaded(true); // confirm it has been loaded
          });
      },[key]); // runs this each time key changes eg (on page opening)

      useEffect(()=> 
      {
        if (loaded) AsyncStorage.setItem(key, JSON.stringify(exercises)); // saves excersises for a workout into AsyncStorage as a string
      }, [exercises, loaded, key]); // runs when either the exercises are updated, page is loaded or key changes(new page opened)
      
      function workoutConformation()
      {
          Alert.alert("Is The Workout Completed?", `Submit Workout`,[
            {text: "Cancel", style:"cancel"},
            {text: "Yes", style:"default", onPress: () => finishWorkout()},
          ]);
      }

      async function finishWorkout() // saves the session for use in the stats
      {
        if (exercises.length === 0)  // return early if there were no exercises completed
        {
            return;
        }

        const sessionsKey =`sessions-${id}`; // set sessions key
        const saved = await AsyncStorage.getItem(sessionsKey); // gets the saved data from previous session from asyncStorage and sets it to saved 
        const history : Session[] = saved  ? JSON.parse(saved) : []; // sets all previous sessions to history or if there are no previous sessions make it blank

        const session: Session =  // sets values for the session
        { 
          id: Date.now().toString(),
          workoutId: id,
          date: new Date().toISOString(),
          exercises: exercises,
        };

        await AsyncStorage.setItem(sessionsKey, JSON.stringify([...history, session])); // adds the current session into the history
        Alert.alert("Workout saved") // sends alert to user telling them workout was saved
      }


    return(
    <SafeAreaView style = {styles.screen}>
      <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
      >
      <Stack.Screen  options = {{  
          title: name,
          headerBackTitle: "Home",
          headerStyle: { backgroundColor: "#2b2d2d" },
          headerTitleStyle: { color: "#fdce32" },
      }} />


      <View style={styles.row}>
          <TextInput 
                  style = {styles.input}
                  value = {newName}
                  returnKeyType="done"
                  onSubmitEditing={addExercise}
                  onChangeText = {setNewName}
                  placeholder="Exercise name"
                  placeholderTextColor="#aaa"
            />
          <Pressable onPress = {addExercise}>
              <Text style={styles.button}>Add Exercise +</Text>
          </Pressable>
      </View>

      {exercises.map((ex, exIndex) => (
          <ExerciseCard 
          key={exIndex} 
          exercise={ex} 
          onChangeSet={(setIndex,Field,value) =>
          updateSet(exIndex,setIndex,Field,value)}
          onAddSet={() => addSet(exIndex)}
          onRemoveSet={() => removeSet(exIndex)}
          />
      ))}

      {exercises.length > 0 && (
      <Pressable onPress = {workoutConformation}>
          <Text style={styles.finish}>Finish Workout</Text>
      </Pressable>
      )}

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
    alignItems:"center",
    padding:20,
    backgroundColor:"#2b2d2d",
    paddingBottom:50,
  },
  title: {
    color:"#fff",
    fontSize:30,
    fontWeight:"bold",
    padding:20,
  },
  text: {
    color:"#fff",
    fontSize:20,
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

  finish:{
    backgroundColor: "#5e5d5d",
    color: "#fdce32",
    fontSize: 30,
    fontWeight:700,
    padding: 20,
    borderRadius: 8,
    textAlign: "center",
    width:300,
    height:80,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});