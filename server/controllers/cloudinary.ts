import {
    API_KEY_CLOUDINARY,
    API_SECRET_CLOUDINARY,
    API_VARIABLE_CLOUDINARY,
    API_NAME_CLOUDINARY,
} from '../CONST';
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: API_NAME_CLOUDINARY,
    api_key: API_KEY_CLOUDINARY,
    api_secret: API_SECRET_CLOUDINARY,
});

export { cloudinary };
