import { connection } from '../db';
import { cloudinary } from './cloudinary';

async function createAd(req, res) {
    const { name, creator, price, category, youtube, description, city, phone, way_communication } =
        await req.body;

    const { photos, photo } = await req.files;
    const date = new Date().toLocaleString();

    if (
        name.trim() &&
        creator.trim() &&
        price.trim() &&
        category.trim() &&
        description.trim() &&
        city.trim() &&
        phone.trim() &&
        way_communication.trim() &&
        photo
    ) {
        connection.query(
            `
            INSERT INTO service.ads(ad_name, ad_creator, ad_price, ad_category, ad_youtube, ad_description, ad_city, ad_telephone, ad_way_communication, ad_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
            [
                name,
                creator,
                price,
                category,
                youtube,
                description,
                city,
                phone,
                way_communication,
                date,
            ],
            (err, result) => {
                if (err) {
                    res.json({ error: 'Что-то пошло не так', message: 'Ошибка' });
                }

                if (!err) {
                    addImageInCurrentAd(result.insertId, photo);
                    if (photos) {
                        addImagesInCloudinary(req, res, photos, result.insertId);
                    } else {
                        res.json({ message: 'Создали объявление' });
                    }
                }
            },
        );
    } else if (
        !name.trim() ||
        !creator.trim() ||
        !price.trim() ||
        !category.trim() ||
        !description.trim() ||
        !city.trim() ||
        !phone.trim() ||
        !way_communication.trim() ||
        !photos ||
        !photo
    ) {
        res.json({ error: 'Заполните все поля', message: 'Ошибка' });
    }
}

async function getAd(req, res) {
    const { id } = await req.params;
    const PHOTOS = [];
    // TODO: Поправить запрос для того чтобы если нету фотографий все равно получали объявление
    connection.query(
        `
        SELECT * FROM service.ads, service.users
        LEFT JOIN service.ads_photos ON ad_ad_id = ${id}
        WHERE ad_id = ${id} AND user_id = ad_creator

    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Что-то пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                if (result.length) {
                    const user = {
                        user_id: result[0].user_id,
                        user_name: result[0].user_name,
                        user_surname: result[0].user_surname,
                        user_email: result[0].user_email,
                        user_date_register: result[0].user_date_register,
                        user_avatar: result[0].user_avatar,
                    };

                    const ad = {
                        ad_id: result[0].ad_id,
                        ad_name: result[0].ad_name,
                        ad_creator: result[0].ad_creator,
                        ad_price: result[0].ad_price,
                        ad_category: result[0].ad_category,
                        ad_youtube: result[0].ad_youtube,
                        ad_description: result[0].ad_description,
                        ad_city: result[0].ad_city,
                        ad_telephone: result[0].ad_telephone,
                        ad_way_communication: result[0].ad_way_communication,
                        ad_photo: result[0].ad_photo,
                        ad_date: result[0].ad_date,
                    };

                    for (let elem of result) {
                        if (elem.ad_ad_id) {
                            PHOTOS.push({
                                ad_ad_id: elem.ad_ad_id,
                                ad_photo_url: elem.ad_photo_url,
                                ad_public_id: elem.ad_public_id,
                                tempFilePath: elem.ad_temp,
                            });
                        }
                    }

                    res.json({
                        message: `Объявление ID: ${id}`,
                        owner: user,
                        ad: ad,
                        photos: PHOTOS,
                    });
                } else {
                    deleteAdByIdError(id);
                    res.json({ error: 'Такого объявления нету', message: 'Ошибка' });
                }
            }
        },
    );
}

async function addImagesInCloudinary(req, res, files, id) {
    try {
        if (!files || Object.keys(files).length === 0) {
            res.json({ error: 'Нету файлов', message: 'Ошибка' });
        } else if (!files.length) {
            cloudinary.v2.uploader.upload(files.tempFilePath, function (error, result) {
                addImagesInDB(id, result.url, result.public_id);
            });
            res.json({ message: 'Объявление успешно создано' });
        } else if (files.length) {
            for (let elem of files) {
                cloudinary.v2.uploader.upload(elem.tempFilePath, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    addImagesInDB(id, result.url, result.public_id);
                });
            }

            res.json({ message: 'Объявление успешно создано' });
        }
    } catch (error) {
        res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
    }
}

async function getAllAds(req, res) {
    connection.query(
        `
        SELECT * FROM service.ads
    `,
        (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }

            if (!err) {
                res.json({ message: 'Все объявления', ads: result });
            }
        },
    );
}

async function getAllFavoriteAds(req, res) {
    const { id } = await req.params;

    connection.query(
        `
        SELECT * FROM service.favorites
        WHERE favorite_user = ${id}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Все избранные объявления', ads: result });
            }
        },
    );
}

async function toggleFavoriteAd(req, res) {
    const { user_id, ad_id } = await req.body;
    connection.query(
        `
        SELECT * FROM service.favorites
        WHERE favorite_id = ? AND favorite_user = ?
        `,
        [ad_id, user_id],
        (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }
            if (!err) {
                if (result.length) {
                    deleteFavorite(res, ad_id, user_id);
                } else if (!result.length) {
                    addFavorite(res, ad_id, user_id);
                }
            }
        },
    );
}

async function getFavoriteAll(req, res) {
    const { user_id } = await req.body;
    connection.query(
        `
        SELECT * FROM service.favorites, service.ads
        WHERE favorite_user = ${user_id} AND ad_id = favorite_id
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Избранные объявления', ads: result });
            }
        },
    );
}

async function deleteAdById(req, res) {
    const { id } = await req.params;
    connection.query(
        `
        DELETE FROM service.ads
        WHERE ad_id = ${id}
    `,
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Успешно удалили объявление' });
                getAdImagesById(id, 'delete');
                deleteFavoriteAdById(id);
            }
        },
    );
}

async function editAdById(req, res) {
    const {
        deleteImages,
        ad_name,
        ad_price,
        ad_category,
        ad_youtube,
        ad_description,
        ad_city,
        ad_telephone,
        ad_way_communication,
    } = await req.body;
    const files = await req.files;
    const { id } = await req.params;
    const PARSE_DELETE_IMAGES = [];
    console.log(deleteImages);
    if (deleteImages) {
        if (Array.isArray(deleteImages)) {
            for (let elem of deleteImages) {
                PARSE_DELETE_IMAGES.push(JSON.parse(elem));
            }
        } else {
            PARSE_DELETE_IMAGES.push(JSON.parse(deleteImages));
        }
    }

    connection.query(
        `
        UPDATE service.ads
        SET
            ad_name = '${ad_name}',
            ad_price = '${ad_price}',
            ad_category = '${ad_category}',
            ad_youtube = '${ad_youtube}',
            ad_description = '${ad_description}',
            ad_city = '${ad_city}',
            ad_telephone = '${ad_telephone}',
            ad_way_communication = '${ad_way_communication}'
        WHERE ad_id = ${id};
    `,
        (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }

            if (!err) {
                if (!files) {
                    deleteImagesInArray(PARSE_DELETE_IMAGES);
                    res.json({ message: 'Объявление отредактировано' });
                }
                if (files) {
                    addImagesInCloudinary(req, res, files['files'], id);
                }
            }
        },
    );
}

function deleteAdByIdError(id) {
    connection.query(
        `
        DELETE FROM service.ads
        WHERE ad_id = ${id}
    `,
        (err, result) => {
            if (err) {
                console.log({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                console.log({ message: 'Успешно удалили объявление' });
                getAdImagesById(id, 'delete');
                deleteFavoriteAdById(id);
            }
        },
    );
}

function deleteFavoriteAdById(id) {
    connection.query(
        `
        DELETE FROM service.favorites
        WHERE favorite_id = ${id}
    `,
        (err, result) => {
            if (err) {
                console.log(err);
            }
        },
    );
}

function getAdImagesById(id, type = 'get') {
    connection.query(
        `
        SELECT * FROM service.ads_photos
        WHERE ad_ad_id = ${id};
    `,
        (err, result) => {
            if (err) {
                console.log(err);
            }

            if (!err) {
                if (type === 'get') {
                } else if (type === 'delete') {
                    deleteAdImagesById(id, result);
                }
            }
        },
    );
}

function deleteAdImagesById(id, images) {
    connection.query(
        `
        DELETE FROM service.ads_photos
        WHERE ad_ad_id = ${id}
    `,
        (err, result) => {
            if (err) {
                console.log(err);
            }

            if (!err) {
                for (let elem of images) {
                    cloudinary.v2.uploader.destroy(elem.ad_public_id, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                        console.log(result);
                    });
                }
            }
        },
    );
}

function deleteFavorite(res, ad_id, user_id) {
    connection.query(
        `
        DELETE FROM service.favorites
        WHERE favorite_id = ${ad_id} AND favorite_user = ${user_id}
    `,
        [ad_id, user_id],
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Убрали из избранного' });
            }
        },
    );
}

function addFavorite(res, ad_id, user_id) {
    connection.query(
        `
    INSERT INTO service.favorites(favorite_id, favorite_user)
    VALUES(?, ?)
    `,
        [ad_id, user_id],
        (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }

            if (!err) {
                res.json({ message: 'Добавили в избранное' });
            }
        },
    );
}

function addImagesInDB(id, url, public_id) {
    connection.query(
        `
        INSERT INTO service.ads_photos(ad_ad_id, ad_photo_url, ad_public_id)
        VALUES(?, ?, ?)
    `,
        [id, url, public_id],
        (err, result) => {
            if (err) {
                console.log(err);
                return new Error(err);
            }
        },
    );
}

function addImageInCurrentAd(id, avatar) {
    cloudinary.v2.uploader.upload(avatar.tempFilePath, function (error, result) {
        if (!error) {
            connection.query(
                `
                    UPDATE service.ads
                    SET ad_photo = '${result.url}'
                    WHERE ad_id = ${id};
                `,
                (err, result) => {
                    if (err) return new Error(err);
                    if (!err) {
                        console.log({ message: 'Создали объявление' });
                    }
                },
            );
        }
    });
}

function deleteImagesInArray(images: any[]) {
    for (let elem of images) {
        connection.query(
            `
            DELETE FROM service.ads_photos
            WHERE ad_public_id = '${elem.ad_public_id}'
        `,
            (err, result) => {
                if (err) {
                    console.log(err);
                }
            },
        );

        cloudinary.v2.uploader.destroy(elem.ad_public_id, function (error, result) {
            if (error) {
                console.log(error);
            }
            console.log(result);
        });
    }
}

module.exports = {
    createAd,
    getAd,
    addImagesInCloudinary,
    getAllAds,
    toggleFavoriteAd,
    getFavoriteAll,
    getAllFavoriteAds,
    deleteAdById,
    editAdById,
};
