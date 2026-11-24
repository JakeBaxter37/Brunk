import { cleanNumber, cleanRpe } from "@/utils/validation";

describe("cleanNumber", () => {
    it("removes letters and symbols", () => {
        expect(cleanNumber("12abc!", 5)).toBe("12");
    });

    it("limits the length", () => {
        expect(cleanNumber("123456789", 4)).toBe("1234");
    });

    it("allows one decimal point when asked", () => {
        expect(cleanNumber("12.5.5", 6, true)).toBe("12.55");
    });

    it("removes the decimal point when not allowed", () => {
        expect(cleanNumber("12.5", 6)).toBe("125");
    });
});

describe("cleanRpe", () => {
    it("allows half values", () => {
        expect(cleanRpe("8.5")).toBe("8.5");
    });

    it("caps at 10", () => {
        expect(cleanRpe("15")).toBe("10");
    });
});