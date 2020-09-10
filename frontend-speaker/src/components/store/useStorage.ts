import React from "react";

// const savedValue = (key, initialValue) => {
//     const savedValue = JSON.parse(localStorage.getItem(key));
//     if(savedValue) return savedValue;

//     if(initialValue instanceof Function) return initialValue();
//     return initialValue;
// }

export const useLocalStorage = (key, initialValue) => {
    const [ value, setValue ] = React.useState();
    // const [ value, setValue ] = React.useState(() => {
    //     return savedValue(key, initialValue);
    // });

    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [ value, setValue ];
}