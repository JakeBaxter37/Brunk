import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Workout = {
  id: string;
  name: string;
  lastTracked: string;
};

const workouts: Workout[] = [
  {id: "1", name: "Push", lastTracked: "1d ago",},
  {id: "2", name: "Pull", lastTracked: "3d ago",},
  {id: "3", name: "Legs", lastTracked: "5d ago",},
];

export  default function Home() {
  return(
    <SafeAreaView  style = {styles.container}>
    <Text  style = {styles.title}> 
      Home
    </Text>  
    <View style = {styles.card}>
      <Text style = {styles.text}>10,000</Text>
      <Text style = {styles.text}>Steps</Text>
    </View>
    <Text style = {styles.subtitle}>
      Workouts
    </Text>
    <View style = {styles.workoutsContainer}>
      {workouts.map((workout) =>
      <View key = {workout.id} style = {styles.card}>
        <Text style = {styles.text}>{workout.name}</Text>
        <Text style = {styles.text}>{workout.lastTracked}</Text>
      </View>
    )}
    </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex:1,
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
  button: {
    color:"#fff",
    textDecorationLine:"underline",
    fontSize:20,
  }
});