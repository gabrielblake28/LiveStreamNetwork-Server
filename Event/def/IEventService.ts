import { IEvent } from "./IEvent";

/**
 * Service that manages CRUD operations for Twitch Events
 */
export interface IEventService {
    /**
     * Get all live events at a specific limit and page
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specify date as "live date", otherwise defaults to current datetime
     */
    GetLiveEvents(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Get featured events at a specified limit and page
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specified "start" date where events are filtered on, defaults to current datetime
     */
    GetFeaturedEvents(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Get trending events at a specified limit and page
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specified "start" date where events are filtered on, defaults to current datetime
     */
    GetTrendingEvents(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Get sponsored events at a specified limit and page
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specified "start" date where events are filtered on, defaults to current datetime
     */
    GetSponsoredEvents(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Get all matching events from a list of user_ids
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param UserIds list of user ids
     */
    GetEventsWithMatchingUserIds(
        limit: number,
        page: number,
        userIds: string[]
    ): Promise<IEvent[]>;

    /**
     * Get upcoming events ordered by event start_date closest to date ascending
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     */
    GetUpcomingEvents(
        limit: number,
        page: number,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Get events by a twitch category_id sorted ASC from current date
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specified "start" date where events are filtered on, defaults to current datetime
     * @param category_id twitch's category id
     */
    GetEventsByTwitchCategory(
        category_id: string,
        limit: number,
        page: number,
        date?: Date
    ): Promise<IEvent[]>;

    /**
     * Create an event with given resource
     * @param resource event data
     * @returns event_id
     */
    CreateEvent(resource: IEvent): Promise<string>;

    /**
     * Get an event by a given id
     * @param id event id
     */
    GetEvent(id: string): Promise<IEvent>;

    /**
     * Delete an event by a given id
     * @param id event id
     */
    DeleteEvent(id: string): Promise<void>;

    /**
     * Update an event by a given id
     * @param id event id
     * @param resource event data
     */
    UpdateEvent(id: string, resource: IEvent): Promise<IEvent>;

    /**
     * Gets whether a user has subcribed to an event
     * @param user_id
     * @param event_id
     */
    IsSubscribedToEvent(user_id: string, event_id: string): Promise<boolean>;

    /**
     * Subscribe a user to an event
     * @param event_id
     * @param user_id
     */
    SubscribeToEvent(user_id: string, event_id: string): Promise<string>;

    /**
     * Unsubscribe to event
     * @param subscription_id
     */
    UnsubscribeToEvent(subscription_id: string): Promise<void>;
}
