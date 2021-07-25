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
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const ADS = [];
        db_1.connection.query(`
        SELECT * FROM service.users
        LEFT JOIN
            service.ads ON user_id = ad_creator
        WHERE
            user_id = ${id}
    `, (err, result) => {
            if (err)
                return new Error(err);
            if (!err) {
                if (result.length) {
                    const user = {
                        user_id: result[0].user_id,
                        user_name: result[0].user_name,
                        user_surname: result[0].user_surname,
                        user_date_register: result[0].user_date_register,
                        user_place: result[0].user_place,
                        user_phone: result[0].user_phone,
                        user_avatar: result[0].user_avatar,
                    };
                    for (let elem of result) {
                        if (elem.ad_id) {
                            ADS.push({
                                ad_id: elem.ad_id,
                                ad_name: elem.ad_name,
                                ad_creator: elem.ad_creator,
                                ad_price: elem.ad_price,
                                ad_category: elem.ad_category,
                                ad_youtube: elem.ad_youtube,
                                ad_description: elem.ad_description,
                                ad_city: elem.ad_city,
                                ad_telephone: elem.ad_telephone,
                                ad_way_communication: elem.ad_way_communication,
                                ad_photo: elem.ad_photo,
                                ad_date: elem.ad_date,
                            });
                        }
                    }
                    res.json({
                        message: `Пользователь ${result[0].user_id}`,
                        user,
                        ads: ADS,
                    });
                }
                else {
                    res.json({
                        error: `Пользователь с таким ID: ${id} не найдено`,
                        message: 'Ошибка',
                    });
                }
            }
        });
    });
}
module.exports = {
    getUser,
};
//# sourceMappingURL=user.js.map