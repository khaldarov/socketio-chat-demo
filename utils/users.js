
class Users {

    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    getUsers() {
        return this.users;
    }

    getUserById(socketId) {
       return this.users.find(user => user.id === socketId);
    }

    removeUserById(socketId) {
        const index = this.users.findIndex(user => user.id === socketId);

        if (index > -1) {
            this.users.splice(index, 1);
        }
    }
}


module.exports = Users;