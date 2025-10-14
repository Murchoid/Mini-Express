// just in memory storage

import { User } from "myServer/model/users.model";

type options = | string | number;

export class Db {
    private users: User[];

    constructor() {
        this.users = [];
    }

    save(user: User) {
        if (!user) {
            return;
        }
        let exists = false;

        exists = this.users.includes(user);
        if(exists) {
            return "User already exists!";
        }

        this.users.push(user);
        return user;
    }

    find() {
        return this.users;
    }

    findOne(option: options) {
        let user;
        if (typeof option == "number") {
            user = this.users.find(user => user.id === option);
            return user ? user : [];
        }
        if (typeof option == "string") {
            user = this.users.find(user => user.name === option);
            if (user) return user;
            user = this.users.find(user => user.email === option);
            if (user) return user;
        }

        return [];
    }

    delete(option: options) {
        let user;
        if (typeof option == "number") {
            user = this.users.find(user => user.id === option);
            this.users = this.users.filter(user => user.id != option);
            return user ? true : false;
        }
        if (typeof option == "string") {
            user = this.users.find(user => user.name === option);
            if (user) {
                this.users = this.users.filter(user => user.name != option);
                return true;
            }
            user = this.users.find(user => user.email === option);
            if (user) {
                this.users = this.users.filter(user => user.email != option);
                return true
            }
        }

        return false;
    }

}
