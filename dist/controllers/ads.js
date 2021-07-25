"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const cloudinary_1 = require("./cloudinary");
function createAd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, creator, price, category, youtube, description, city, phone, way_communication } = yield req.body;
        const { photos, photo } = yield req.files;
        const date = new Date().toLocaleString();
        if (name.trim() &&
            creator.trim() &&
            price.trim() &&
            category.trim() &&
            description.trim() &&
            city.trim() &&
            phone.trim() &&
            way_communication.trim() &&
            photo) {
            db_1.connection.query(`
            INSERT INTO service.ads(ad_name, ad_creator, ad_price, ad_category, ad_youtube, ad_description, ad_city, ad_telephone, ad_way_communication, ad_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
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
            ], (err, result) => {
                if (err) {
                    res.json({ error: 'Что-то пошло не так', message: 'Ошибка' });
                }
                if (!err) {
                    addImageInCurrentAd(result.insertId, photo);
                    if (photos) {
                        addImagesInCloudinary(req, res, photos, result.insertId);
                    }
                    else {
                        res.json({ message: 'Создали объявление' });
                    }
                }
            });
        }
        else if (!name.trim() ||
            !creator.trim() ||
            !price.trim() ||
            !category.trim() ||
            !description.trim() ||
            !city.trim() ||
            !phone.trim() ||
            !way_communication.trim() ||
            !photos ||
            !photo) {
            res.json({ error: 'Заполните все поля', message: 'Ошибка' });
        }
    });
}
function getAd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield req.params;
        const PHOTOS = [];
        // TODO: Поправить запрос для того чтобы если нету фотографий все равно получали объявление
        db_1.connection.query(`
        SELECT * FROM service.ads, service.users
        LEFT JOIN service.ads_photos ON ad_ad_id = ${id}
        WHERE ad_id = ${id} AND user_id = ad_creator

    `, (err, result) => {
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
                }
                else {
                    deleteAdByIdError(id);
                    res.json({ error: 'Такого объявления нету', message: 'Ошибка' });
                }
            }
        });
    });
}
function addImagesInCloudinary(req, res, files, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!files || Object.keys(files).length === 0) {
                res.json({ error: 'Нету файлов', message: 'Ошибка' });
            }
            else if (!files.length) {
                cloudinary_1.cloudinary.v2.uploader.upload(files.tempFilePath, function (error, result) {
                    addImagesInDB(id, result.url, result.public_id);
                });
                res.json({ message: 'Объявление успешно создано' });
            }
            else if (files.length) {
                for (let elem of files) {
                    cloudinary_1.cloudinary.v2.uploader.upload(elem.tempFilePath, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                        addImagesInDB(id, result.url, result.public_id);
                    });
                }
                res.json({ message: 'Объявление успешно создано' });
            }
        }
        catch (error) {
            res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
        }
    });
}
function getAllAds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        db_1.connection.query(`
        SELECT * FROM service.ads
    `, (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }
            if (!err) {
                res.json({ message: 'Все объявления', ads: result });
            }
        });
    });
}
function getAllFavoriteAds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield req.params;
        db_1.connection.query(`
        SELECT * FROM service.favorites
        WHERE favorite_user = ${id}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Все избранные объявления', ads: result });
            }
        });
    });
}
function toggleFavoriteAd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id, ad_id } = yield req.body;
        db_1.connection.query(`
        SELECT * FROM service.favorites
        WHERE favorite_id = ? AND favorite_user = ?
        `, [ad_id, user_id], (err, result) => {
            if (err) {
                res.json({ message: 'Ошибка', error: 'Чтото пошло не так' });
            }
            if (!err) {
                if (result.length) {
                    deleteFavorite(res, ad_id, user_id);
                }
                else if (!result.length) {
                    addFavorite(res, ad_id, user_id);
                }
            }
        });
    });
}
function getFavoriteAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id } = yield req.body;
        db_1.connection.query(`
        SELECT * FROM service.favorites, service.ads
        WHERE favorite_user = ${user_id} AND ad_id = favorite_id
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Избранные объявления', ads: result });
            }
        });
    });
}
function deleteAdById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield req.params;
        db_1.connection.query(`
        DELETE FROM service.ads
        WHERE ad_id = ${id}
    `, (err, result) => {
            if (err) {
                res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
            }
            if (!err) {
                res.json({ message: 'Успешно удалили объявление' });
                getAdImagesById(id, 'delete');
                deleteFavoriteAdById(id);
            }
        });
    });
}
function editAdById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deleteImages, ad_name, ad_price, ad_category, ad_youtube, ad_description, ad_city, ad_telephone, ad_way_communication, } = yield req.body;
        const files = yield req.files;
        const { id } = yield req.params;
        const PARSE_DELETE_IMAGES = [];
        console.log(deleteImages);
        if (deleteImages) {
            if (Array.isArray(deleteImages)) {
                for (let elem of deleteImages) {
                    PARSE_DELETE_IMAGES.push(JSON.parse(elem));
                }
            }
            else {
                PARSE_DELETE_IMAGES.push(JSON.parse(deleteImages));
            }
        }
        db_1.connection.query(`
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
    `, (err, result) => {
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
        });
    });
}
function deleteAdByIdError(id) {
    db_1.connection.query(`
        DELETE FROM service.ads
        WHERE ad_id = ${id}
    `, (err, result) => {
        if (err) {
            console.log({ error: 'Чтото пошло не так', message: 'Ошибка' });
        }
        if (!err) {
            console.log({ message: 'Успешно удалили объявление' });
            getAdImagesById(id, 'delete');
            deleteFavoriteAdById(id);
        }
    });
}
function deleteFavoriteAdById(id) {
    db_1.connection.query(`
        DELETE FROM service.favorites
        WHERE favorite_id = ${id}
    `, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}
function getAdImagesById(id, type = 'get') {
    db_1.connection.query(`
        SELECT * FROM service.ads_photos
        WHERE ad_ad_id = ${id};
    `, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (!err) {
            if (type === 'get') {
            }
            else if (type === 'delete') {
                deleteAdImagesById(id, result);
            }
        }
    });
}
function deleteAdImagesById(id, images) {
    db_1.connection.query(`
        DELETE FROM service.ads_photos
        WHERE ad_ad_id = ${id}
    `, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (!err) {
            for (let elem of images) {
                cloudinary_1.cloudinary.v2.uploader.destroy(elem.ad_public_id, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    console.log(result);
                });
            }
        }
    });
}
function deleteFavorite(res, ad_id, user_id) {
    db_1.connection.query(`
        DELETE FROM service.favorites
        WHERE favorite_id = ${ad_id} AND favorite_user = ${user_id}
    `, [ad_id, user_id], (err, result) => {
        if (err) {
            res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
        }
        if (!err) {
            res.json({ message: 'Убрали из избранного' });
        }
    });
}
function addFavorite(res, ad_id, user_id) {
    db_1.connection.query(`
    INSERT INTO service.favorites(favorite_id, favorite_user)
    VALUES(?, ?)
    `, [ad_id, user_id], (err, result) => {
        if (err) {
            res.json({ error: 'Чтото пошло не так', message: 'Ошибка' });
        }
        if (!err) {
            res.json({ message: 'Добавили в избранное' });
        }
    });
}
function addImagesInDB(id, url, public_id) {
    db_1.connection.query(`
        INSERT INTO service.ads_photos(ad_ad_id, ad_photo_url, ad_public_id)
        VALUES(?, ?, ?)
    `, [id, url, public_id], (err, result) => {
        if (err) {
            console.log(err);
            return new Error(err);
        }
    });
}
function addImageInCurrentAd(id, avatar) {
    cloudinary_1.cloudinary.v2.uploader.upload(avatar.tempFilePath, function (error, result) {
        if (!error) {
            db_1.connection.query(`
                    UPDATE service.ads
                    SET ad_photo = '${result.url}'
                    WHERE ad_id = ${id};
                `, (err, result) => {
                if (err)
                    return new Error(err);
                if (!err) {
                    console.log({ message: 'Создали объявление' });
                }
            });
        }
    });
}
function deleteImagesInArray(images) {
    for (let elem of images) {
        db_1.connection.query(`
            DELETE FROM service.ads_photos
            WHERE ad_public_id = '${elem.ad_public_id}'
        `, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
        cloudinary_1.cloudinary.v2.uploader.destroy(elem.ad_public_id, function (error, result) {
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
//# sourceMappingURL=ads.js.map