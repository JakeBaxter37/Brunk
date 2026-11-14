import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseCard from "../../components/ExerciseCard";
import { Exercise, SetEntry, workouts } from "../../constants/workouts";


export  default function WorkoutDetail() {
    const {id} = useLocalSearchParams<{id : string}>();
    const workout = workouts.find((w) => w.id === id) 

    // set default values for the exercises and sets
    const [exercises, setExercises] = useState<Exercise[]>
    ([
        { name: "Bench Press",   
        sets:[{ weight: "65", reps: "6", rpe: "9" },
        { weight: "65", reps: "6", rpe: "9" },
        { weight: "65", reps: "5", rpe: "10" },]
        },

        { name: "Pec Fly",   
        sets:[{ weight: "59", reps: "10", rpe: "10" },
        { weight: "59", reps: "8", rpe: "10" },]
        },
    ])

    const [newName, setNewName] = useState("");

    function addExercise()
    {
      if (newName.trim() === "") return; // returns early if name is blank

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


    // if workout didnt load properly display error page
    if (!workout)
    {
        return(
            <SafeAreaView  style = {styles.container}>
                <Stack.Screen  options={{  title: "workout not found"}} />
            </SafeAreaView>
        );
    }

    return(
    <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
    >
    <Stack.Screen  options = {{  
        title: workout.name,
        headerBackTitle: "Home",
        headerStyle: { backgroundColor: "#2b2d2d" },
        headerTitleStyle: { color: "#fdce32" },
    }} />


    <View style={styles.row}>
        <TextInput //text box for changing the weight
                style = {styles.input}
                value = {newName}
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
    </ScrollView>
);
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems:"center",
    padding:20,
    backgroundColor:"#2b2d2d",
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
    header: {
    color: "#fff",
    fontSize: 18,
    width: 80,
    padding: 10,
    textAlign: "center",
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
 
});