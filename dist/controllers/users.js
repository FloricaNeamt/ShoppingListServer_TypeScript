"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const users_1 = require("../db/users");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, users_1.getUsers)();
        return res.status(200).json(users).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=users.js.map