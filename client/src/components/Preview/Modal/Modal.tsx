import React from 'react';
import { AdCard } from '../../AdCard/AdCard';
import './Modal.css';

export const Modal = ({ card, active, setActive }: IModal) => {
    return (
        <div
            className={active ? 'modal-overlay-preview active' : 'modal-overlay-preview'}
            onClick={() => setActive(!active)}>
            <div className={active ? 'modal-body-preview active' : 'modal-body-preview'}>
                <AdCard
                    name={card.name}
                    category={card.category}
                    city={card.city}
                    price={card.price}
                    photo={card.photo[0]}
                    date={card.date}
                    preview={false}
                />
            </div>
        </div>
    );
};

interface IModal {
    card: {
        name: string;
        category: string;
        city: string;
        price: string;
        photo: string;
        date: string;
    };
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}
