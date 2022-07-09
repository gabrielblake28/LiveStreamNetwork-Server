import { ITwitchUserData } from "./ITwitchUserData";
import { IUser } from "./IUser";

export interface IUserService {
    // /**
    //  * Authenticate the credentials of a user
    //  * @param username
    //  * @param password
    //  */
    // AuthenticateUser(username: string, password: string): Promise<IUser>;

    /**
     * Create a user with given resource
     * @param resource user data
     * @returns user_id
     */
    CreateUser(resource: IUser): Promise<IUser>;

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

    /**
     * Get or create a user
     * @param resource twitch_data
     */
    GetOrCreateUser(resource: ITwitchUserData): Promise<IUser>;

    /**
     * Get subscriptions by user id
     * @param resource user_id
     */
    // GetSubscribedEventsByUserId(user_id: string): Promise<IEvent>;
}
