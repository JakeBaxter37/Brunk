import { useSettings } from "@/context/settingsContext";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Exercise, SetEntry } from "../constants/workouts";

type Props ={
    exercise: Exercise;
    onChangeSet: (setIndex: number, field: keyof SetEntry, value: string) => void;
    onAddSet: () => void;
    onRemoveSet: () => void;
}

export  default function ExerciseCard({exercise, onChangeSet, onAddSet, onRemoveSet}: Props){

        const { settings } = useSettings();
        const unit = settings.useLbs ? "lbs" : "kg";

    return(
        <View style={styles.exerciseContainer}>
            <View style={styles.row}>
                <Text style={styles.exercise}>
                    {exercise.name}
                </Text>
                <View style={styles.row}>
                    <Pressable onPress = {onAddSet}>
                        <Text style={styles.button}>+</Text>
                    </Pressable>
                    <Pressable onPress = {onRemoveSet}>
                        <Text style={styles.button}>-</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.header}>
                    Weight({unit})
                </Text>
                <Text style={styles.header}>
                    Reps
                </Text>
                <Text>       </Text>
                <Text style={styles.header}>
                    RPE
                </Text>
            </View>

        {exercise.sets.map((s,i) => (
            <View key={i} style={styles.row}>
                <TextInput //text box for changing the weight
                    style = {styles.input}
                    value = {s.weight}
                    onChangeText = {(t) => onChangeSet(i,"weight", t)}
                    keyboardType="numeric"
                />
                <Text style={styles.text}>x</Text>
                <TextInput //text box for changing the reps
                    style = {styles.input}
                    value = {s.reps}
                    onChangeText = {(t) => onChangeSet(i,"reps",t)}
                    keyboardType="numeric"
                />
                <Text>          </Text>

                <TextInput //text box for changing the rpe
                    style = {styles.input}
                    value = {s.rpe}
                    onChangeText = {(t) => onChangeSet(i,"rpe",t)}
                    keyboardType="numeric"
                />
            </View>

        ))}
        </View>
    );
}


const styles = StyleSheet.create({

    exercise: {
    color:"#fff",
    fontSize:25,
    fontWeight:"bold",
    padding:5,
    textAlign:"left",
    width:220,
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
    width: 70,
    padding: 10,
    borderRadius: 8,
    textAlign: "center",},

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
  
  exerciseContainer:{
    backgroundColor:"#373737",
    padding:20,
    margin:5,
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
});