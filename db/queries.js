const { prisma } = require('./prisma');

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


/*--------------------------------------------- Folders ----------------------*/

exports.folderGetById = async function folderGetById(id) {
    const folder = await prisma.folder.findFirst({
        where: { id: id },
        include: { files: true }
    });
     return folder;
};