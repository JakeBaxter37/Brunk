jest.mock("expo-sensors", () => ({ Pedometer: {} }));
jest.mock("@react-native-async-storage/async-storage", () =>
require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

import { averageForPrefix, dateKey, percentDiff } from "@/utils/steps";

    describe("dateKey", () => {
        it("pads the month and day", () => {
            expect(dateKey(new Date(2026, 2, 5))).toBe("2026-03-05");
        });
    });

    describe("averageForPrefix", () => {
        const log = { "2026-11-01": 8000, "2026-11-02": 10000, "2026-10-30": 5000 };

        it("averages the days in a month", () => {
            expect(averageForPrefix(log, "2026-11")).toBe(9000);
        });

        it("returns null when there is no data", () => {
            expect(averageForPrefix(log, "2025")).toBeNull();
        });
    });

    describe("percentDiff", () => {
            it("calculates the change", () => {
                expect(percentDiff(11000, 10000)).toBeCloseTo(10);
        });

        it("returns null when either value is missing or the previous is 0", () => {
            expect(percentDiff(null, 10000)).toBeNull();
            expect(percentDiff(10000, null)).toBeNull();
            expect(percentDiff(10000, 0)).toBeNull();
        });
    });