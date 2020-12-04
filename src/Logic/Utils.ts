import { useReducer } from "react";

export function millisecondsToTime(millis: number) {
    const totalSeconds = Math.floor(millis / 1000);

    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;

    const hours = Math.floor(totalMinutes / 60);

    const secString = seconds === 0 ? "00" : (seconds < 10 ? "0" : "") + seconds;

    const minString = minutes === 0 ? "00" : (minutes < 10 ? "0" : "") + minutes;
    const hourString = hours > 0 ? hours + ":" : "";

    return hourString + minString + ":" + secString;
}

type PartialSetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);

export function useObjectReducer<T>(initialState: T) {
    return useReducer<React.Reducer<T, PartialSetStateAction<T>>>(
        (prevState: T, newPartialState: PartialSetStateAction<T>) => {
            if (typeof newPartialState === "function") {
                return { ...prevState, ...newPartialState(prevState) };
            } else {
                return { ...prevState, ...newPartialState };
            }
        },
        initialState
    );
}
