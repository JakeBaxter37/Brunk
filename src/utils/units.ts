import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise, Session, Workout } from "../constants/workouts";

const KG_TO_LBS = 2.20462;

function convert(text: string, toLbs:boolean):string
{
    const n = Number(text);
    if (text.trim() === ""|| isNaN(n)) 
        {
            return text;
        }
const result = toLbs
    ? n * KG_TO_LBS
    : n / KG_TO_LBS;

    return String(Math.round(result*10)/10); // round to 1dp
}

export function convertExercises(exercises: Exercise[],toLbs: boolean)
{
    return exercises.map((ex)=>({
        ...ex,
        sets: ex.sets.map((s)=>({...s, weight: convert(s.weight, toLbs)})),
    }));
}

function isValidExercises(value:any):boolean 
{
    return Array.isArray(value) && value.every((ex) => Array.isArray(ex.sets))
}

export async function repairStorage()
{
    const saved = await AsyncStorage.getItem("workouts"); // gets the saved data of the workouts from asyncStorage
    const workouts : Workout[] = saved  ? JSON.parse(saved) : []; // makes an array of all the workouts

    for (const w of workouts)
    {
        const ex = await AsyncStorage.getItem(`exercises-${w.id}`); // gets exercises 
        if (ex && !isValidExercises(JSON.parse(ex))) 
        {
            await AsyncStorage.removeItem(`exercises-${w.id}`);
        }

        const se = await AsyncStorage.getItem(`sessions-${w.id}`);
        if (se)
        {
            const sessions = JSON.parse(se);
            const good = Array.isArray(sessions)
                ? sessions.filter((s) => isValidExercises(s.exercises))
                : [];
        await AsyncStorage.setItem(`sessions-${w.id}`, JSON.stringify(good));
        }
    }
}


export async function convertAllWeights(toLbs: boolean)
{
    const saved = await AsyncStorage.getItem("workouts"); // gets the saved data of the workouts from asyncStorage
    const workouts : Workout[] = saved  ? JSON.parse(saved) : []; // makes an array of all the workouts

    for (const w of workouts)
    {
        const ex = await AsyncStorage.getItem(`exercises-${w.id}`);
        if (ex)
        {
            const converted = convertExercises(JSON.parse(ex),toLbs) 
            await AsyncStorage.setItem(`exercises-${w.id}`, JSON.stringify(converted));
        }

        const se = await AsyncStorage.getItem(`sessions-${w.id}`);
        if (se)
        {
            const sessions: Session[] = JSON.parse(se);
            const converted = sessions.map((s)=> ({
                ...s,
                exercises: convertExercises(s.exercises, toLbs),
            }));
        await AsyncStorage.setItem(`sessions-${w.id}`, JSON.stringify(converted));
        }
    }
}