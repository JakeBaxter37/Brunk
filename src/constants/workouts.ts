export type Workout = {
  id: string;
  name: string;
  lastTracked: string;
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

export const workouts: Workout[] = [
    {id: "1", name: "Push", lastTracked: "1d ago",},
    {id: "2", name: "Pull", lastTracked: "3d ago",},
    {id: "3", name: "Legs", lastTracked: "5d ago",},
    { id: "4", name: "Arms", lastTracked: "2d ago" },
];