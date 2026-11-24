import { Session } from "../constants/workouts";

export type Point = 
    {
        date: string;
        weight: number;
    };



export function percentChange(sessions: Session[]): number | null {
    if (sessions.length < 2) return null;

    const sorted = [...sessions].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    const last10 = sorted.slice(-10);

    // Store progression separately for each exercise
    const exercises = new Map<string, {first: number;last: number; count: number;}>();

    for (const session of last10) {
        for (const exercise of session.exercises ?? []) {

            const weights = exercise.sets
                .map(set => Number(set.weight))
                .filter(weight => weight > 0);

            if (weights.length === 0) continue;

            // Average weight for this exercise in this session
            const average = weights.reduce((a, b) => a + b, 0)
                / weights.length;

            // Use the exercise name to identify it
            const name = exercise.name;

            const existing = exercises.get(name);

            if (!existing) {
                exercises.set(name, {
                    first: average,
                    last: average,
                    count: 1
                });
            } else {
                existing.last = average;
                existing.count++;
            }
        }
    }

    // Calculate percentage change for each exercise
    const changes: number[] = [];

    for (const exercise of exercises.values()) {
        if (exercise.count < 2 || exercise.first === 0) continue;

        const change =
            ((exercise.last - exercise.first) / exercise.first) * 100;

        changes.push(change);
    }

    if (changes.length === 0) return null;

    // Average the percentage changes
    const total = changes.reduce((a, b) => a + b, 0);

    return total / changes.length;
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

