import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";

export type StepLog = 
{
    [date:string]:number
};

export function dateKey(d:Date ):string // formats each date correctly
{
    const month = String(d.getMonth() + 1).padStart(2,"0");
    const day = String(d.getDate()).padStart(2,"0");
    return `${d.getFullYear()}-${month}-${day}`;
}

export async function saveDay(date: Date, steps: number) 
{
    const saved = await AsyncStorage.getItem("steps");
    let log: StepLog = {};

    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") log = parsed;
    }

    log[dateKey(date)] = steps;
    await AsyncStorage.setItem("steps", JSON.stringify(log));
}

export async function backfillRecentDays()
{
    for (let i = 1 ; i <= 6; i++)
    {
        const start = new Date(); 
        start.setDate(start.getDate() - i);
        start.setHours(0,0,0,0); 
        const end = new Date(start);
        end.setHours(23,59,59,999);
        try {
            const result = await Pedometer.getStepCountAsync(start, end);
            if (result.steps > 0) await saveDay(start, result.steps)
        } catch {
        }
    }
}


export function averageForPrefix(log:StepLog, prefix:string):number | null
{
    let total = 0;
    let count = 0;
    for (const key in log)
    {
        if (key.startsWith(prefix)) 
        {
            total = total + log[key];
            count = count + 1;
        }
    }
    if (count === 0) return null;
    return Math.round(total/count);
}


export function percentDiff(current:number | null, previous:number|null):number |null
{
    if (current === null || previous === null || previous === 0)  return null;
    return ((current - previous)/previous)*100;
} 

export function lastSixMonthsAverage(log:StepLog): {label:string, value:number}[] 
{
    const result: {label:string, value:number}[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--)
    {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const average = averageForPrefix(log, dateKey(d).slice(0,7));
        if (average !== null)
        {
            result.push({
                label: d.toLocaleDateString( "en-GB",{month: "short"}),
                value : average,
            });
        }
    }
    return result;
}



export async function addFakeSteps() {
    const log: StepLog = {};
        for (let i = 1; i <= 180; i++) 
        {
            const d = new Date();
            d.setDate(d.getDate() - i);
            log[dateKey(d)] = 6000 + Math.floor(Math.random() * 8000);
        }
    await AsyncStorage.setItem("steps", JSON.stringify(log));
}