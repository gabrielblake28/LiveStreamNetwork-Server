import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai, { expect } from "chai";
import { UserService } from "../User/impl/UserService";
import { IUser } from "../User/def/IUser";
import { EventService } from "../Event/impl/EventService";

let sandbox: sinon.SinonSandbox;
let userService: UserService;
describe("User Service", () => {
    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        userService = new UserService();
    });

    describe("Should create a user with given resources and user should be able to query user with returned id", async () => {
        let userData: IUser = {
            user_id: "5",
            created_date: new Date("2021-11-24T01:30"),
            username: "dauntx",
            password: "testPass",
            email: "gbalake7@yahoo.com",
            phone: "8633985277",
            status: "partner",
        };

        const userId = await userService.CreateUser(userData);

        const user = await userService.GetUser(userId);

        expect(user).to.eql(Object.assign(userData, { user_id: userId }));

        await userService.DeleteUser(userId);
    });
});

//should be able to update user information

//should be able to delete a user by user_id

//
