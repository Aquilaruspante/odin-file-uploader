const { prisma } = require('./prisma');
const path = require('node:path');

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
    });

    const folders = await prisma.folder.findMany({
        where: {
            userId: user.id,
        }, 
        include: {
            files: true
        }
    });

    user.folders = folders;

    return user;
};

exports.userGetByEmail = async function userGetByEmail(email) {
    const user = await prisma.user.findFirst({
        where: { email: email }
    });

    return user;
};

exports.usersGet = async function usersGet() {
    const users = await prisma.user.findMany();

    return users;
};

exports.userDeleteById = async function userDeleteById(id) {
    await prisma.user.delete({ where: { id }});
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

exports.folderDeletebyId = async function folderDeleteById(id) {
    await prisma.folder.delete({ where: { id } });
}

exports.foldersGet = async function foldersGet() {
    const folders = await prisma.folder.findMany()

    return folders;
};

/*--------------------------------------------- Files -------------------------*/

exports.fileCreate = async function fileCreate(folderId, name, size, mimetype, destName, url, publicId, resourceType) {
    const file = await prisma.file.create({
        data: {
            name: name,
            url: url ? url : path.join(__dirname, '..', `uploads/${destName}`),
            size: parseFloat(size),
            mimetype: mimetype,
            publicId,
            resourceType,
            folderId: parseInt(folderId),
        }
    });

    return file;
};

exports.fileGetByidAndFolderId = async function fileGetById(id, folderId) {
    const file = await prisma.file.findFirst({ 
        where: { id: parseInt(id), folderId: parseInt(folderId) }
    });

    return file;
};

exports.fileGetById = async function fileGetById(id) {
    const file = await prisma.file.findFirst({ where: { id }});

    const folder = await prisma.folder.findFirst({ where: { id: file.folderId }});

    const user = await prisma.user.findFirst({ where: { id: folder.userId }});

    file.user = user;
    
    return file;
};

exports.fileDeleteById = async function fileDeleteById(id) {
    await prisma.file.delete({ where: { id } });
};

exports.filesGet = async function filesGet() {
    const files = await prisma.file.findMany();

    return files;
}