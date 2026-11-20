const db = require('../db/queries');
const ExpressError = require('../ExpressError');

exports.shareFolderCreate = async function shareFolderCreate(req, res, next) {
    const { folderId } = req.params;
    const { duration } = req.body;

    const shareFolder = await db.folderShareCreate(parseInt(folderId), duration);

    res.redirect(`/folders/${folderId}/${shareFolder.id}`);
};

exports.folderShare = async function folderShare(req, res, next) {
    const { shareId } = req.params;

    const shareFolder = await db.folderShareGet(shareId);

    res.render('folder', { folder });
};

exports.folderShareGetLink = async function folderShareGetLink(req, res, next) {
    const { shareFolderId } = req.params;

    const folderShare = await db.folderShareGet(shareFolderId);
    console.log(folderShare);

    res.render('share-link', { folderShare });
};

exports.shareFolderShow = async function shareFolderShow(req, res, next) {
    const { shareId } = req.params;

    const foldeShare = await db.folderShareGet(shareId);

    const folder = await db.folderGetById(foldeShare.folderId);

    res.render('folder', { folder });
};