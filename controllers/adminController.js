const db = require('../db/queries');
const ExpressError = require('../ExpressError');
const cloudinary = require('../config/cloudinary');
const fileCategory = require('../utils/extractMimetype');

exports.dashboard = function dashboard(req, res, next) {
    res.render('dashboard');
};

exports.usersGet = async function usersGet(req, res, next) {
    const users = await db.usersGet();

    res.render('userlist', { users });
};

exports.userGetById = async function userGetById(req, res, next) {
    const { userId } = req.params;
    
    const currentUser = await db.userGetById(parseInt(userId));

    res.render('user', { currentUser });
};

exports.userDelete = async function userDelete(req, res, next) {
    const { userId } = req.params;

    if (isNaN(parseInt(userId))) return (new ExpressError(400, 'Bad request!'));

    const user = await db.userGetById(parseInt(userId));

    if (user.role === 'ADMIN') {
        req.session.messages = { type: 'failure', message: 'cannot ban an admin' };
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect(`/admin/users/${userId}`);
        });
    };

    if (!user) {
        return next(new ExpressError(404, 'user not found'));
    };

    const files = [];
    user.folders.forEach(folder => {
        folder.files.forEach(file => {
            files.push(file);
        });
    });

    console.log('files: ', files, 'length: ', files.length);

    const results = await Promise.all(files.map(file => cloudinary.uploader.destroy(file.publicId, { resource_type: file.resource_type })));
    console.log('results: ', results)

    results.forEach((result, index) => {
        if (result.result !== 'ok') {
            console.log('Cloudinary', files[index].publicId, result.result);

            req.session.messages = { type: 'failure', message: `Failed to delete file ${files[index].publicId}`};
            return req.session.save(err => {
                if (err) return next(err);
                res.redirect(`/admin/users/${userId}`);
            });
        };
    });
    
    await db.userDeleteById(parseInt(userId));

    req.session.messages = { type: 'success', message: 'User succesfully deleted!' };
    return req.session.save(err => {
        if (err) return next(err);
        res.redirect('/admin/users');
    });
    
};

exports.filesGet = async function filesGet(req, res, next) {
    const files = await db.filesGet();

    res.render('filelist', { files });
};

exports.fileGetById = async function fileGetById(req, res, next) {
    const { fileId } = req.params;

    if (isNaN(parseInt(fileId))) return next(new ExpressError(400, 'bad request'));

    const file = await db.fileGetById(parseInt(fileId));

    if (!file) return next(new ExpressError(404, 'Not found'));

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
    res.render('file-with-user', { file, url, category, size });
};