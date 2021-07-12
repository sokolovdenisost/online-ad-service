import React, { useState } from 'react';

export const useChangeInput = (initialValue: any, setState: any) => {
    const [value, setValue] = useState(initialValue);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): any {
        setState((state: any) => ({ ...state, [event.target.id]: event.target.value }));
    }

    return [value, handleChange];
};
