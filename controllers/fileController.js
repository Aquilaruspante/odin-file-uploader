const db = require('../db/queries');
const fileCategory = require('../utils/extractMimetype');
const ExpressError = require('../ExpressError');
const cloudinary = require('../config/cloudinary');

exports.fileCreateGet = function fileCreateGet(req, res) {
    const { folderId } = req.params;

    res.render('new-file', { folderId });
};

exports.fileCreatePost = async function fileCreatePost(req, res, next) {
    const { folderId } = req.params;
    const { originalname, size, mimetype, filename, buffer } = req.file;


    if (process.env.STORAGE === 'cloudinary') {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
            if(error) return next(error);
    
            await db.fileCreate(folderId, originalname, size, mimetype, filename, result.secure_url, result.public_id, result.resource_type);

            req.session.messages = { type: 'succes', message: 'File uploaded succesfully!' };
            return req.session.save(err => {
                if (err) next(err);
                res.redirect(`/folders/${folderId}`);
            });
        }).end(buffer);
    } else {
        await db.fileCreate(folderId, originalname, size, mimetype, filename, null);

        req.session.messages = { type: 'succes', message: 'File uploaded succesfully locally!' };
        return req.session.save(err => {
            if (err) next(err);
            res.redirect(`/folders/${folderId}`);
        });
    }    
};

exports.fileGet = async function fileGet(req, res, next) {
    const { id, folderId } = req.params;

    try {
        const file = await db.fileGetByid(id, folderId);

        if (file) {

            let size;

            if (file.size.toString().length > 6) {
                size = file.size.toString().slice(0, -6) + '.' + file.size.toString().slice(-6, -4) + 'MB';
            } else if (file.size.toString().length > 3) {
                size = file.size.toString().slice(0, -3) + '.' + file.size.toString().slice(-3, -1) + 'KB';
            };

            let url;

            if (file.url.startsWith('/home')) {
                url = `/folders/${folderId}/files/${id}/view`;
            } else {
                url = file.url;
            };

            const category = fileCategory(file.mimetype);
            res.render('file', { file, url, category, size });
        } else {
            const error = new ExpressError(404, 'Page not found!');
            next(error);
        };
    } catch (e) {
        console.log(e);
        const error = new ExpressError(500, 'Internal Server Error!');
        next(error);
    };
};

exports.fileSend = async function fileSend(req, res, next) {
    const { folderId, id } = req.params;

    const file = await db.fileGetByid(id, folderId);

    let type;
    type = file.mimetype === 'video/quicktime' ? 'video/mp4' : file.mimetype;
    type = file.mimetype === 'application/vnd.oasis.opendocument.graphics' ? 'image/jpeg' : file.mimetype;

    res.type(type);    
    res.sendFile(file.url);
};

exports.fileDelete = async function fileDelete(req, res, next) {
    const { id, folderId } = req.params;

    try {
        const file = await db.fileGetByid(id, folderId);
        cloudinary.uploader.destroy(file.publicId, { resource_type: file.resourceType, invalidate: true })
            .then(async (result) => {
                if (result.result === 'ok') {
                    await db.fileDeleteById(parseInt(id));

                    req.session.messages = { type: 'success', message: 'File succesfully deleted!' };
                    return req.session.save(err => {
                        if (err) return next(err);
                        res.redirect(`/folders/${folderId}`);
                    });
                } else {
                    const error = new ExpressError(404, 'file not found');
                    return next(error);
                }
                
            })
            .catch(err => {
                console.log(err);
                return next(new ExpressError());
            });
        } catch (err) {
            console.log(err);
            next(err);
        };
};
