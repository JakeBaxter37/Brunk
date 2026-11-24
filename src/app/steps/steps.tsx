import { averageForPrefix, dateKey, lastSixMonthsAverage, percentDiff, StepLog } from "@/utils/steps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

function changeText(change:number| null):string
{
    if (change === null) return "-";      
    if (Math.abs(change)< 1) return  "→ 0%";
    return `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(0)}%`;
}

function StatCard({title, average, change}: { title: string; average: number | null; change: number | null })
{
    return(
        <View style={styles.card}>
            <Text style={styles.label}>{title}</Text>
            <View style={styles.row}>
                <Text style={styles.big}>{average === null ? "no data" : average.toLocaleString()}</Text>
                <Text style={styles.change}>{changeText(change)}</Text>
            </View>
        </View>
    );
}

export  default function stepsScreen() 
{
    const [log, setLog] = useState<StepLog>({});
    const [goal, setGoal] = useState("10000");
    const { width } = useWindowDimensions();

    
    useEffect(() => 
    {
        //addFakeSteps();
        AsyncStorage.getItem("steps").then((s) => 
        {
            if (s) setLog(JSON.parse(s)); 
        });
        AsyncStorage.getItem("stepGoal").then((g) => {
            if (g !== null) setGoal(g);
        });
    },[]);

    function changeGoal(text:string) 
    {
        const digits = text.replace(/[^0-9]/g, "");
        setGoal(digits);
        AsyncStorage.setItem("stepGoal", digits);
    }

    const now = new Date();
    const thisMonth = dateKey(now).slice(0,7);
    const lastMonth = dateKey(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7);
    const thisYear = String(now.getFullYear());
    const lastYear = String(now.getFullYear() - 1);

    const monthAverage = averageForPrefix(log ,thisMonth);
    const monthChange = percentDiff(monthAverage, averageForPrefix(log, lastMonth));
    const yearAverage = averageForPrefix(log ,thisYear);
    const yearChange = percentDiff(yearAverage, averageForPrefix(log, lastYear));


    const months = lastSixMonthsAverage(log);
    const goalNumber = Number(goal) || 0;

    const values = months.map(m => m.value);

    const lowest = Math.min(...values);
    const highest = Math.max(...values, goalNumber);

    const min = Math.floor((lowest * 0.9) / 1000) * 1000;
    const max = Math.ceil((highest * 1.1) / 1000) * 1000;

    const stepValue = 1000;
    const noOfSections = Math.max(1, (max - min) / stepValue);


    return(
        <SafeAreaView style = {styles.screen}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
            >

            <Stack.Screen  options = {{  
                title: "Your Steps",
                headerBackTitle: "Home",
                headerStyle: { backgroundColor: "#2b2d2d" },
                headerTitleStyle: { color: "#fdce32" },
            }} />
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Daily step goal</Text>
                <TextInput 
                    style = {styles.input}
                    value = {goal}
                    onChangeText = {changeGoal}
                    returnKeyType="done"
                    keyboardType="numeric"
                    accessibilityLabel="Daily step goal"
                />
            </View>
        </View>

            <StatCard title="Average this month" average={monthAverage} change={monthChange}/>
            <StatCard title="Average this Year" average={yearAverage} change={yearChange}/>


                    <View style={styles.card}>
                        <Text style={styles.label}>Last 6 months (daily average)</Text>
                        {months.length <2 ?(
                            <Text style={styles.text}>please complete this exercise again to see stats</Text> 
                        ) : (
                            <>
<LineChart
    data={months}
    width={width - 120}
    adjustToWidth

    color="#fdce32"
    thickness={3}
    dataPointsColor="#fdce32"

    hideRules

    showReferenceLine1={goalNumber > 0}
    referenceLine1Position={goalNumber}
    referenceLine1Config={{
        color: "#fff",
        dashWidth: 4,
        dashGap: 4
    }}

    yAxisOffset={min}
    maxValue={max - min}
    stepValue={stepValue}
    noOfSections={noOfSections}

    yAxisLabelWidth={50}
    xAxisLabelTextStyle={{
        color: "#fff",
        fontSize: 10
    }}
    yAxisTextStyle={{
        color: "#fff"
    }}
/>

                            </>
                        )}
                    </View>
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

label:{
    color:"#fff",
    fontSize: 18, 
},

row: {
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-between",
},

input:{
    backgroundColor: "#737373",
    color: "#fff",
    fontSize: 18,
    width: 100,
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
},

change: { 
    color: "#fdce32", 
    fontSize: 22, 
    fontWeight: "bold" 
},


big: { 
    color: "#fff", 
    fontSize: 28, 
    fontWeight: "bold" 
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