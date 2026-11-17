export type Workout = 
{
    id: string;
    name: string;
};

export type SetEntry = 
    {
        weight: string;
        reps: string;
        rpe: string;
    };

export type Exercise = 
    {
        name: string;
        sets: SetEntry[];
    };

export type Session = 
    {
        id: string;
        workoutId:string;
        date:string;
        exercises: Exercise[];
    };


export const workouts: Workout[] = [];