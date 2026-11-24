import { Session } from "@/constants/workouts";
import { exerciseNames, percentChange, weightHistory } from "@/utils/stats";

function makeSession(date: string, weights: string[], name = "Bench Press"): Session {
    return {
        id: date,
        workoutId: "1",
        date,
        exercises: [
        { name, sets: weights.map((w) => ({ weight: w, reps: "5", rpe: "8" })) },
        ],
    };
    }


    describe("percentChange", () => {
    it("returns null with fewer than two sessions", () => {
        expect(percentChange([makeSession("2026-01-01", ["60"])])).toBeNull();
    });

    it("is positive when weights go up", () => {
        const sessions = [makeSession("2026-01-01", ["60"]), makeSession("2026-01-08", ["66"])];
        expect(percentChange(sessions)).toBeCloseTo(10);
    });

    it("is negative when weights go down", () => {
        const sessions = [makeSession("2026-01-01", ["100"]), makeSession("2026-01-08", ["90"])];
        expect(percentChange(sessions)).toBeCloseTo(-10);
    });

    it("does not depend on the order of the sessions", () => {
        const sessions = [makeSession("2026-01-08", ["66"]), makeSession("2026-01-01", ["60"])];
        expect(percentChange(sessions)).toBeCloseTo(10);
    });

    it("only looks at the last 10 sessions", () => {
        const sessions: Session[] = [];
        for (let i = 0; i < 12; i++) {
        const day = String(i + 1).padStart(2, "0");
        sessions.push(makeSession(`2026-01-${day}`, [i < 2 ? "10" : "100"]));
        }
        expect(percentChange(sessions)).toBeCloseTo(0);
    });

    it("returns null when the first session has no valid weights", () => {
        const sessions = [makeSession("2026-01-01", [""]), makeSession("2026-01-08", ["60"])];
        expect(percentChange(sessions)).toBeNull();
    });
    });

    describe("exerciseNames", () => {
    it("lists each exercise once", () => {
        const sessions = [
        makeSession("2026-01-01", ["60"], "Bench Press"),
        makeSession("2026-01-08", ["62"], "Bench Press"),
        makeSession("2026-01-15", ["40"], "Pec Fly"),
        ];
        expect(exerciseNames(sessions)).toEqual(["Bench Press", "Pec Fly"]);
    });
    });

    describe("weightHistory", () => {
    it("returns the heaviest set per session in date order", () => {
        const sessions = [
        makeSession("2026-01-08", ["62", "65"]),
        makeSession("2026-01-01", ["60", "60"]),
        ];
        expect(weightHistory(sessions, "Bench Press")).toEqual([
        { date: "2026-01-01", weight: 60 },
        { date: "2026-01-08", weight: 65 },
        ]);
    });

    it("skips sessions without that exercise", () => {
        const sessions = [makeSession("2026-01-01", ["40"], "Pec Fly")];
        expect(weightHistory(sessions, "Bench Press")).toEqual([]);
    });
    });