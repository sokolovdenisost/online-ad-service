import { connection } from '../db';

async function getUser(req, res) {
    const { id } = req.params;
    const ADS = [];
    connection.query(
        `
        SELECT * FROM service.users
        LEFT JOIN
            service.ads ON user_id = ad_creator
        WHERE
            user_id = ${id}
    `,
        (err, result) => {
            if (err) return new Error(err);
            if (!err) {
                if (result.length) {
                    const user: IUser = {
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
                } else {
                    res.json({
                        error: `Пользователь с таким ID: ${id} не найдено`,
                        message: 'Ошибка',
                    });
                }
            }
        },
    );
}

module.exports = {
    getUser,
    // getUserAds,
};

interface IUser {
    user_id: number;
    user_name: string;
    user_surname: string;
    user_date_register: string;
    user_place: string | null;
    user_phone: string | null;
    user_avatar: string;
}
