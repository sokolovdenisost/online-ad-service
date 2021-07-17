import React from 'react';

export const useChangeInput = (setState: any) => {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>): any {
        setState((state: any) => ({ ...state, [event.target.id]: event.target.value }));
    }

    return handleChange;
};
