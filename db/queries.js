const { prisma } = require('./prisma');

/*----------------------- User --------------------------------*/

exports.userCreate = async function userCreate(username, email, hash) {
    await prisma.user.create({
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

    console.log('user created!');
};

exports.userGetByUsername = async function userGetByUsername(username) {
    const user = await prisma.user.findFirst({
        where: { username: username }
    });

    return user;
};

exports.userGetById = async function userGetById(id) {
    const user = await prisma.user.findFirst({
        where: { id: id }
    });

    return user;
};