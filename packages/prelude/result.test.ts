import { describe, expect, test } from "bun:test";
import Result, { type ResultType } from "./result";

describe("Result", () => {
  describe("flatMap", () => {
    test("works with function returning ResultType<R>", () => {
      const initial: ResultType<number> = Result.success(5);
      
      const doubled = Result.flatMap((x: number) => Result.success(x * 2))(initial);
      
      expect(Result.isSuccess(doubled)).toBe(true);
      if (Result.isSuccess(doubled)) {
        expect(doubled.value).toBe(10);
      }
    });

    test("propagates errors when fn returns ResultType<R>", () => {
      const initial: ResultType<number> = Result.error("initial error");
      
      const doubled = Result.flatMap((x: number) => Result.success(x * 2))(initial);
      
      expect(Result.isSuccess(doubled)).toBe(false);
      if (!Result.isSuccess(doubled)) {
        expect(doubled.message).toBe("initial error");
      }
    });

    test("handles fn that returns an error result", () => {
      const initial: ResultType<number> = Result.success(5);
      
      const result = Result.flatMap((x: number) => 
        x > 0 ? Result.error("number too large") : Result.success(x)
      )(initial);
      
      expect(Result.isSuccess(result)).toBe(false);
      if (!Result.isSuccess(result)) {
        expect(result.message).toBe("number too large");
      }
    });
  });

  describe("map", () => {
    test("works with function returning R directly", () => {
      const initial: ResultType<number> = Result.success(5);
      
      const doubled = Result.map((x: number) => x * 2)(initial);
      
      expect(Result.isSuccess(doubled)).toBe(true);
      if (Result.isSuccess(doubled)) {
        expect(doubled.value).toBe(10);
      }
    });

    test("propagates errors when fn returns R directly", () => {
      const initial: ResultType<number> = Result.error("initial error");
      
      const doubled = Result.map((x: number) => x * 2)(initial);
      
      expect(Result.isSuccess(doubled)).toBe(false);
      if (!Result.isSuccess(doubled)) {
        expect(doubled.message).toBe("initial error");
      }
    });

    test("can chain flatMap and map calls with mixed return types", () => {
      const initial: ResultType<number> = Result.success(5);
      
      const result = Result.map((x: number) => x * 2)(
        Result.flatMap((x: number) => Result.success(x + 3))(initial)
      );
      
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(16); // (5 + 3) * 2
      }
    });
  });

  describe("success", () => {
    test("creates a success result", () => {
      const result = Result.success(42);
      
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe("error", () => {
    test("creates an error result", () => {
      const result = Result.error("something went wrong");
      
      expect(Result.isSuccess(result)).toBe(false);
      if (!Result.isSuccess(result)) {
        expect(result.message).toBe("something went wrong");
      }
    });
  });

  describe("isSuccess", () => {
    test("returns true for success results", () => {
      const result = Result.success(42);
      expect(Result.isSuccess(result)).toBe(true);
    });

    test("returns false for error results", () => {
      const result = Result.error("error");
      expect(Result.isSuccess(result)).toBe(false);
    });
  });
});
