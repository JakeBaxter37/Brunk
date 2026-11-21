import { percentChange } from "@/utils/stats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Session, Workout } from "../../constants/workouts";


type workoutData = {workout:Workout, sessions:Session[]}; // creates a type workoutdata for workouts and sessions


export  default function Stats() {
    const { width } = useWindowDimensions();

    const [data, setData] = useState<workoutData[]>([]); // states for workoutData

    useFocusEffect( // runs each time page is opened
        useCallback(() => {
            async function load() { // loads the 
                const saved = await AsyncStorage.getItem("workouts"); // gets the saved data of the workouts from asyncStorage
                const list : Workout[] = saved  ? JSON.parse(saved) : []; // makes an array of all the workouts
            
                const result:workoutData[] = []; // initalizes result 
                for (const w of list){ // loops through each workout
                    const s = await AsyncStorage.getItem(`sessions-${w.id}`); // gets the saved sessions from asyncStorage
                    result.push({workout: w, sessions: s ? JSON.parse(s):[]}); // adds the workout and sessions to result
                }
                setData(result); 
            }
            load();
        },[])
    );

return(
<SafeAreaView style = {styles.screen}>
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.container}>

    <Text  style = {styles.title}> 
        Stats
    </Text>  

{data.map(({workout,sessions})=>{
    const percent = percentChange(sessions);

    let message = "not enough data yet please complete a workout.";
    let symbol = "-";
    let colour = "Gray"
    if (percent !== null)
    {
        if (Math.abs(percent) < 1)
        {
            message = "Your strength has stayed the same."
            symbol = "∙"
            colour = "Amber"
        }
        else if (percent > 0)
        {
            message = `You have gotten ${percent.toFixed(1)}% Stronger recently.`;
            symbol = "+";
            colour = "Green"
        }
        else
        {
            message = `You have gotten ${Math.abs(percent).toFixed(1)}% Weaker recently.`;
            symbol = "-"
            colour = "Red"
        }
    }

    return(
        <View style={styles.workoutsContainer}>
            <View style={styles.row}>
                <Text style = {styles.header}>{workout.name}</Text>
                <Text style={[
                        colour === "Green" ? styles.Green :
                        colour === "Red" ? styles.Red :
                        colour === "Amber" ? styles.Amber :
                        styles.Gray]}>
                            {symbol}
                </Text>
            </View>
            
            <View   style = {styles.card}>
                <Text style = {styles.text}>{message}</Text>
            </View>
            <Link 
                key={workout.id} 
                href={{pathname : "/progress/[id]", params: { id: workout.id, name: workout.name } }} 
                asChild
            >
                <Pressable>
                    <Text style={[styles.button, { marginLeft: width / 5, marginRight: width / 5  }]}>
                        See More
                    </Text>
                </Pressable>
            </Link>
        </View>

        );
    })}
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
title: {
    color:"#fdce32",
    fontSize:30,
    fontWeight:"bold",
    padding:20,
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
header: {
    color: "#fff",
    fontSize: 22,
    width: 80,
    paddingTop: 7,
    textAlign: "center",
    fontWeight:"500",
    },
row: {
    alignItems:"center",
    flexDirection:"row",
    marginBottom:12,
    justifyContent:"space-between",
},
button:{
    backgroundColor: "#5e5d5d",
    color: "#fdce32",
    fontSize: 18,
    padding: 10,
    borderRadius: 8,
    marginBottom:15,
    textAlign: "center",
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

Gray:{
    backgroundColor: "#5e5d5d",
    color: "#ffffff",
    fontSize: 18,
    padding: 3,
    marginRight:18,
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

Red:{
    backgroundColor: "#e30000",
    color: "#ffffff",
    fontSize: 18,
    padding: 3,
    marginRight:18,
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

Amber:{
    backgroundColor: "#ffaa00",
    color: "#ffffff",
    fontSize: 18,
    padding: 3,
    marginRight:18,
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

Green:{
    backgroundColor: "#00a608",
    color: "#ffffff",
    fontSize: 18,
    padding: 3,
    marginRight:18,
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

});