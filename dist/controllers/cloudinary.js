"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("../CONST");
const cloudinary = require('cloudinary');
exports.cloudinary = cloudinary;
cloudinary.config({
    cloud_name: CONST_1.API_NAME_CLOUDINARY,
    api_key: CONST_1.API_KEY_CLOUDINARY,
    api_secret: CONST_1.API_SECRET_CLOUDINARY,
});
//# sourceMappingURL=cloudinary.js.map