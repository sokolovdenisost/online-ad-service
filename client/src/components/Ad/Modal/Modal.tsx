import React from 'react';
import { CgClose } from 'react-icons/cg';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import './Modal.css';

export const Modal = ({ changeImage, toggleModal, modal, imgCount }: IModal) => {
    return (
        <div
            className={modal.active ? 'ad-modal active' : 'ad-modal'}
            onClick={(e: React.MouseEvent) => toggleModal(e)}>
            <div
                className={modal.active ? 'ad-modal-block active' : 'ad-modal-block'}
                onClick={(e) => e.stopPropagation()}>
                <div className="ad-modal-close" onClick={(e: React.MouseEvent) => toggleModal(e)}>
                    <CgClose size={26} color="4a4b57" />
                </div>
                {imgCount > 1 ? (
                    <>
                        <div
                            className="ad-modal-arrow-left"
                            onClick={(e: React.MouseEvent) => changeImage(e, '-')}>
                            <AiOutlineArrowLeft size={30} color="fff" />
                        </div>
                        <div
                            className="ad-modal-arrow-right"
                            onClick={(e: React.MouseEvent) => changeImage(e, '+')}>
                            <AiOutlineArrowRight size={30} color="fff" />
                        </div>
                    </>
                ) : null}
                <div className="ad-modal-block-img">
                    <img src={modal.img} alt="" className="ad-modal-img" />
                </div>
            </div>
        </div>
    );
};

interface IModal {
    imgCount: number;
    modal: IStateModal;
    setModal: React.Dispatch<React.SetStateAction<IStateModal>>;
    toggleModal: Function;
    changeImage: Function;
}

interface IStateModal {
    active: Boolean;
    img: string | undefined;
}
