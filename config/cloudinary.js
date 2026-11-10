const cloudinary = rerquire('cloudinary').v2;

console.log(cloudinary.config().cloud_name);

module.exports = cloudinary;