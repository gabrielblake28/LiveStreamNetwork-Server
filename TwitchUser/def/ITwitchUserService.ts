import { ITwitchUser } from "./ITwitchUser";

export interface ITwitchUserService {
    /**
     * Create a user with given resource
     * @param resource user data
     * @returns user_id
     */
    CreateUser(resource: ITwitchUser): Promise<string>;

    /**
     * Update a user by a given id
     * @param id user id
     * @param resource user data
     */
    UpdateUser(id: string, resource: ITwitchUser): Promise<ITwitchUser>;

    /**
     * Get a user by a given id
     * @param id user id
     */
    GetUser(id: string): Promise<ITwitchUser>;

    /**
     * Delete a user by a given id
     * @param id user id
     * @param resource user data
     */
    DeleteUser(id: string): Promise<void>;

    /**
     * Get a user by a given twitch id
     * @param twitch_id user twitch id
     */
    GetUserByTwitchId(twitch_id: string): Promise<ITwitchUser>;




}
