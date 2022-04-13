import { IUser } from "./IUser";

export interface IUserService {
    /**
     * Authenticate the credentials of a user
     * @param username
     * @param password
     */
    AuthenticateUser(username: string, password: string): Promise<IUser>;

    /**
     * Create a user with given resource
     * @param resource user data
     * @returns user_id
     */
    CreateUser(resource: IUser): Promise<string>;

    /**
     * Update a user by a given id
     * @param id user id
     * @param resource user data
     */
    UpdateUser(id: string, resource: IUser): Promise<IUser>;

    /**
     * Get a user by a given id
     * @param id user id
     */
    GetUser(id: string): Promise<IUser>;

    /**
     * Delete a user by a given id
     * @param id user id
     * @param resource user data
     */
    DeleteUser(id: string): Promise<void>;

    /**
     * Get a user by a given username
     * @param username user username
     */
    GetUserByUsername(username: string): Promise<IUser>;
}
