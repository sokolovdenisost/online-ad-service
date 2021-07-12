import React, { useState } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { Modal } from '../Modal/Modal';

import './Photos.css';

export const Photos = ({ arrayObj }: IPhotos) => {
    const [image, setImage] = useState<IObjectImage | IPhotosSmall>(arrayObj[0]);
    const [modal, setModal] = useState<IStateModal>({
        active: false,
        img: image.ad_photo_url,
    });
    const mapImages = arrayObj.map((c: IObjectImage | IPhotosSmall) => {
        return <img src={c.ad_photo_url} key={c.ad_photo_url} alt="" onClick={changeMainPhoto} />;
    });

    function toggleModal(e: React.MouseEvent) {
        const currentImg = String(e.currentTarget.getAttribute('src'));
        if (!modal.active) {
            setModal({ ...modal, active: !modal.active, img: currentImg });
            document.body.style.overflow = 'hidden';
        } else if (modal) {
            setModal({ ...modal, active: !modal.active, img: undefined });
            document.body.style.overflow = 'auto';
        }
    }

    function arrowChangeImg(event: React.MouseEvent, type: string) {
        let idxInObj = arrayObj.findIndex(
            (c: IObjectImage | IPhotosSmall) => c.ad_photo_url === image.ad_photo_url,
        );

        if (type === '+') {
            if (idxInObj === arrayObj.length - 1) {
                setImage(arrayObj[0]);
                setModal({ ...modal, img: arrayObj[0].ad_photo_url });
            } else if (idxInObj <= arrayObj.length) {
                idxInObj++;
                setImage(arrayObj[idxInObj]);
                setModal({ ...modal, img: arrayObj[idxInObj].ad_photo_url });
            }
        } else if (type === '-') {
            if (idxInObj === 0) {
                setImage(arrayObj[arrayObj.length - 1]);
                setModal({ ...modal, img: arrayObj[arrayObj.length - 1].ad_photo_url });
            } else if (idxInObj <= arrayObj.length) {
                idxInObj--;
                setImage(arrayObj[idxInObj]);
                setModal({ ...modal, img: arrayObj[idxInObj].ad_photo_url });
            }
        }
    }

    function changeMainPhoto(e: React.MouseEvent) {
        const src = e.currentTarget.getAttribute('src');

        let objImg = arrayObj.filter((c: IObjectImage | IPhotosSmall) => c.ad_photo_url === src);
        setImage({ ...image, ...objImg[0] });
    }
    return (
        <>
            <div className="photos-block">
                <div className="photos-main">
                    {arrayObj.length > 1 ? (
                        <>
                            <div
                                className="photo-main-arrow-left"
                                onClick={(e: React.MouseEvent) => arrowChangeImg(e, '-')}>
                                <AiOutlineArrowLeft size={30} color="fff" />
                            </div>
                            <div
                                className="photo-main-arrow-right"
                                onClick={(e: React.MouseEvent) => arrowChangeImg(e, '+')}>
                                <AiOutlineArrowRight size={30} color="fff" />
                            </div>
                        </>
                    ) : null}
                    <img className="photo-main-bg" src={image.ad_photo_url} alt="" />
                    <div className="photo-main-shadow"></div>
                    <img
                        className="photo-main-img"
                        onClick={(e: React.MouseEvent) => toggleModal(e)}
                        src={image.ad_photo_url}
                        alt="1"
                    />
                </div>
                {arrayObj.length > 1 ? <div className="photos-all">{mapImages}</div> : null}
            </div>
            <Modal
                imgCount={arrayObj.length}
                changeImage={arrowChangeImg}
                toggleModal={toggleModal}
                modal={modal}
                setModal={setModal}
            />
        </>
    );
};

interface IStateModal {
    active: Boolean;
    img: string | undefined;
}

interface IObjectImage {
    ad_ad_id: number;
    ad_photo_url: string;
}

interface IPhotos {
    arrayObj: Array<IObjectImage | IPhotosSmall>;
}

interface IPhotosSmall {
    ad_photo_url: string;
}
