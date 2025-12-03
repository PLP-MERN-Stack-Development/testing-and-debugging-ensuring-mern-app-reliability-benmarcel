const {
  validateBugTitle,
  validateBugStatus,
  validateBugPriority
} = require('../../utils/validator.js');


describe("Validation Utilities", () => {
    describe("validateBugTitle", () => {
        it("should validate a correct title", () => {
            const result = validateBugTitle("Valid Bug Title");
            expect(result.valid).toBe(true);
            expect(result.value).toBe("Valid Bug Title");
        });

        // it("should trim whitespace from the title", () => {
        //     const result = validateBugTitle("   Trimmed Title   ");
        //     expect(result.valid).toBe(false);
        //     expect(result.error).toBe("Trimmed Title");
        // })
        it("should invalidate an empty title", () => {
            const result = validateBugTitle(" ");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Title cannot be empty");
        });
        it("should invalidate a title that exceeds 100 characters", () => {
            const longTitle = "A".repeat(101);
            const result = validateBugTitle(longTitle);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Title cannot exceed 100 characters");
        });
        it("should invalidate a non-string title", () => {
            const result = validateBugTitle(12345);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Title is required and must be a string");
        });
    });
    describe("validateBugStatus", () => {
        it("should validate a correct status", () => {
            const result = validateBugStatus("in-progress");
            expect(result.valid).toBe(true);
            expect(result.value).toBe("in-progress");
        });

        it("should set default status to 'open' if not provided", () => {
            const result = validateBugStatus();
            expect(result.valid).toBe(true);
            expect(result.value).toBe("open");
        });

        it("should invalidate an incorrect status", () => {
            const result = validateBugStatus("invalid-status");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Status must be one of: open, in-progress, resolved");
        });
    });

    describe("validateBugPriority", () => {
        it("should validate a correct priority", () => {
            const result = validateBugPriority("high");
            expect(result.valid).toBe(true);
            expect(result.value).toBe("high");
        });

        it("should set default priority to 'medium' if not provided", () => {
            const result = validateBugPriority();
            expect(result.valid).toBe(true);
            expect(result.value).toBe("medium");
        });

        it("should invalidate an incorrect priority", () => {
            const result = validateBugPriority("urgent");
            expect(result.valid).toBe(false);
            expect(result.error).toBe("Priority must be one of: low, medium, high");
        });

    });

});