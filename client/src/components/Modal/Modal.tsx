import React from 'react';
import { IoMdClose } from 'react-icons/io';
import './Modal.css';

export const Modal = ({ active, setActive, header }: IModal) => {
    return (
        <div className={active ? 'modal-overlay active' : 'modal-overlay'}>
            <div className="modal-block">
                <div className="modal-header">
                    <div className="modal-header-title">{header}</div>
                    <div className="modal-header-close">
                        <IoMdClose size={26} />
                    </div>
                </div>
                <div className="modal-body"></div>
                <div className="modal-footer">test</div>
            </div>
        </div>
    );
};

interface IModal {
    active: any | boolean;
    setActive: any;
    header: string;
}
