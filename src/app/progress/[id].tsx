import { useSettings } from "@/context/settingsContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Session } from "../../constants/workouts";
import { exerciseNames, weightHistory } from "../../utils/stats";







export  default function progress() 
{
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const [sessions, setSessions] = useState<Session[]>([])
    const { width } = useWindowDimensions();

    const { settings } = useSettings();
    const unit = settings.useLbs ? "lbs" : "kg";

    
    useEffect(() => 
    {
        AsyncStorage.getItem(`sessions-${id}`).then((saved) =>  // look in AsyncStorage and get the saved data
        {
            if (saved) setSessions(JSON.parse(saved)); // if there is saved data put it load it into the sessions
        });
    },[id]); // runs this each time id changes 

    const names = exerciseNames(sessions)

    return(
    <SafeAreaView style = {styles.screen}>
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.container}
        >
        <Stack.Screen  options = {{  
            title: name,
            headerBackTitle: "Stats",
            headerStyle: { backgroundColor: "#2b2d2d" },
            headerTitleStyle: { color: "#fdce32" },
        }} />


    {names.length === 0 && (
        <Text style={styles.text}>Please finish a workout to see your progress</Text>
    )}

    {names.map((exName) => {
                const points = weightHistory(sessions , exName);
                const chartData = points.map((p) =>({
                    value: p.weight,
                    label: new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                })); 

                const firstWeight = points[0].weight;
                const lastWeight = points[points.length-1].weight;

                    const minValue = Math.floor(firstWeight / 1.5);
                    const targetMax = Math.ceil(lastWeight * 1.1);

                    const noOfSections = 7;
                    const stepValue = Math.ceil((targetMax - minValue) / noOfSections);

                    // The chart's maximum is the range ABOVE the minimum
                    const maxValue = stepValue * noOfSections;

                return(
                    <View key={exName} style={styles.card}>
                        <Text style={styles.heading}>{exName} ({unit})</Text>
                        {points.length <2 ?(
                            <Text style={styles.text}>please complete this exercise again to see stats</Text> 
                        ) : (
                            <>
                            <LineChart
                                data={chartData}
                                width={width-130}
                                color="#fdce32"
                                thickness={3}
                                dataPointsColor="#fdce32"
                                rulesType="hashed"
                                noOfSections={noOfSections}
                                maxValue={maxValue}
                                stepValue={stepValue}
                                yAxisOffset={minValue}
                                xAxisLabelTextStyle={{ color: "#fff", fontSize: 10 }}
                                yAxisTextStyle={{ color: "#fff" }}
                            />
                        {settings.textToSpeach &&(
                            <View>
                            <Text style={styles.text}>
                                {points[0].weight} {unit} to {points[points.length-1].weight} {unit} over {points.length} sessions
                            </Text>
                            <View style={styles.tts}>

                                <Pressable
                                onPress={()=>{
                                    Speech.stop();
                                    Speech.speak(`${points[0].weight} ${unit} to ${points[points.length-1].weight} ${unit} over ${points.length} sessions`);
                                }}
                                accessibilityLabel={`Read ${points.length} stats aloud`}
                                >
                                <Ionicons name="volume-high" size={20} color={"#fff"}/>
                                </Pressable>
                            </View>
                            </View>
                            )}

                            </>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    </SafeAreaView>
    );
}



const styles = StyleSheet.create({
container: { 
    padding: 20, 
    backgroundColor: "#2b2d2d",
    flexGrow: 1 
},
card: { 
    backgroundColor: "#4e4f4f",
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 20, 
    gap: 12 
},
heading: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "bold" },
text: 
    { color: "#fff",
    fontSize: 18 
},
screen: { 
    flex: 1, 
    backgroundColor: "#2b2d2d" 
},
tts:{
    backgroundColor: "#00a608",
    color: "#ffffff",
    padding: 3,
    marginLeft:20,
    marginTop:10,
    width:27,
    height:27,
    borderRadius: 8,
    textAlign: "center",
},
});