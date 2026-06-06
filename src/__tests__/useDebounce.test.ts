import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

// Use fake timers to control setTimeout without real delays
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useDebounce", () => {
  it("returns the initial value immediately without delay", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("does not update the debounced value before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    // Advance only 400ms — still within the debounce window
    act(() => jest.advanceTimersByTime(400));

    expect(result.current).toBe("initial");
  });

  it("updates the debounced value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "updated" });

    // Advance full debounce delay
    act(() => jest.advanceTimersByTime(500));

    expect(result.current).toBe("updated");
  });

  it("resets the timer when the value changes rapidly (only last value is emitted)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "ab" });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: "abc" });
    act(() => jest.advanceTimersByTime(200));

    // Only 200ms have passed since last change — should still show original
    expect(result.current).toBe("a");

    // Now complete the debounce window
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("abc");
  });

  it("works with non-string types (numbers)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 42 });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe(42);
  });
});
