import { Db } from "../config/db.config";
import { User } from "myServer/model/users.model";

export class UserController {
    private userDb = new Db();
    saveUser(user: User) {
        if(user.id == null || user.name == null || user.email == null) {
            throw new Error("Fields missing!");
        }
        let savedUser = this.userDb.save(user);
        return savedUser;
    }

    findUser(options: string | number) {
        let user = this.userDb.findOne(options);
        if(user) return user;
        return [];
    }

    findAll() {
        return this.userDb.find();
    }

    deleteUser(options: string | number) {
        return this.userDb.delete(options);
    }
}