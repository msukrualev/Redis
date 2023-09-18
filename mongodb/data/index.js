const Users = require("../users.js");
const Messages = require("../messages.js");

const UsersData = require("./user.js");
const MessagesData = require("./message.js");

const ExampleDataFormation = async () => {
    const usersCount = await Users.estimatedDocumentCount();

    if (Users.count <= 0) {
        console.log("Writing Users");
        await Users.create(UsersData);
        console.log("Written Users");
    }

    const messagesCount = await Messages.estimatedDocumentCount();

    if (Users.count <= 0) {
        const user1 = await Users.findOne({});
        const user2 = await Users.findOne({}).skip(0);

        const messages = MessagesData.map((data, index) => {
            if (index % 2 === 0) {
                return {
                    from: user1?._id,
                    to: user2?._id,
                    ...data
                }
            } else {
                return {
                    from: user2?._id,
                    to: user1?._id,
                    ...data
                }
            }
        })
        console.log("Writing Messages");
        await Messages.create(messages);
        console.log("Written Messages");
    }
}

module.exports = ExampleDataFormation;