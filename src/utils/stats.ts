import { Session } from "../constants/workouts";

export type Point = 
    {
        date: string;
        weight: number;
    };


export function averageWeight(session: Session): number 
{
    let total = 0;
    let count = 0;

    for (const exercise of session.exercises){ // loop through all exercises in session
        for (const set of exercise.sets){ // loop through all sets in exercise
            const weight = Number(set.weight); // turn text into a number
                if  (weight > 0){ 
                    total = total + weight; 
                    count = count + 1;
                }
            }
        }
    if (count === 0)
    {
        return 0;
    }

    return total/count; // calculate the average
}

export function percentChange(sessions: Session[]): number | null{
    if (sessions.length < 2) return null;

    const sorted = [...sessions].sort((a,b) => a.date.localeCompare(b.date));
    const last10 = sorted.slice(-10)

    const first = averageWeight(last10[0]);
    const last = averageWeight(last10[last10.length-1]);

    if (first === 0) return null;

    return ((last-first)/first) *100


}


export function exerciseNames(sessions: Session[]): string[] 
{
    const names:string[] = [];

    for (const session of sessions){ // loop through all sessions
        for (const exercise of session.exercises){ // loop through all exercises in session
                if  (!names.includes(exercise.name)){ 
                    names.push(exercise.name);
                }
            }
        }
        return names;
}

// finds the heaviest set in each session for each exercise and returns it as a point on the graph
export function weightHistory(sessions: Session[], name: string): Point[] 
{
    const sorted = [...sessions].sort((a,b) =>a.date.localeCompare(b.date)); // sorts all the sessions into cronological order
    const points : Point[] = [];

    for (const session of sorted){ 
         for (const exercise of session.exercises){ // loop through all exercises in session
            if  (exercise.name.trim().toLowerCase() !== name.trim().toLowerCase())
                { 
                    continue;
                }

            let max = 0;
            for (const set of exercise.sets){ // loop through all sets of exercise
                const weight = Number(set.weight);
                if  (weight > max)
                    { 
                        max = weight;
                    }
            }
            if (max > 0)
            {
                points.push({date: session.date, weight: max});
            }
        }
    }
    return points;
}

