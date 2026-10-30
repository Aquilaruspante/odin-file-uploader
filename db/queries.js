const { prisma } = require('./prisma');
const path = require('node:path');
const ExpressError = require('../ExpressError');

/*----------------------- User --------------------------------*/

exports.userCreate = async function userCreate(username, email, hash) {
    const user = await prisma.user.create({
        data: {
            username: username,
            email: email,
            hashedPW: hash,
            folders: {
                create: [
                    {
                        name: 'Photos'
                    },
                    {
                        name: 'Videos'
                    },
                    {
                        name: 'Documents'
                    }
                ]
            }
        }
    });

    return user;
};

exports.userGetByUsername = async function userGetByUsername(username) {
    const user = await prisma.user.findFirst({
        where: { username: username }
    });

    return user;
};

exports.userGetById = async function userGetById(id) {
    const user = await prisma.user.findFirst({
        where: { id: id },
        include: { folders: true }
    });

    return user;
};

exports.userGetByEmail = async function userGetByEmail(email) {
    const user = await prisma.user.findFirst({
        where: { email: email }
    });

    return user;
};


/*--------------------------------------------- Folders ----------------------*/

exports.folderGetById = async function folderGetById(id) {
    const folder = await prisma.folder.findFirst({
        where: { id: id },
        include: { files: true }
    });
     return folder;
};

exports.folderCreate = async function folderCreate(name, userId) {    
    const folder = await prisma.folder.create({ data: { name, userId } });

    return folder;
};

/*--------------------------------------------- Files -------------------------*/

exports.fileCreate = async function fileCreate(folderId, name) {
    const file = await prisma.file.create({
        data: {
            name: name,
            url: path.join(__dirname, `uploads/${name}`),
            folderId: parseInt(folderId)
        }
    });
};