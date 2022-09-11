import { ResponsePayload } from "../../common/message/MessageService";
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
    ): Promise<ResponsePayload<IEvent[]>>;

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
    ): Promise<ResponsePayload<IEvent[]>>;

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
    ): Promise<ResponsePayload<IEvent[]>>;

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
    ): Promise<ResponsePayload<IEvent[]>>;

    /**
     * Get all matching events from a list of user_ids
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param UserIds list of user ids
     */
    GetEventsByUserId(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<ResponsePayload<IEvent[]>>;

    /**
     * Get upcoming events ordered by event start_date closest to date ascending
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     */
    GetUpcomingEvents(
        limit: number,
        page: number,
        user_id: string,
        date?: Date
    ): Promise<ResponsePayload<IEvent[]>>;

    /**
     * Gets all events at a specific Date and Time
     * @param limit the amount of data to return
     * @param page where in the dataset to start
     * @param date specified datetime events are filtered on, defaults to current datetime
     */
    GetEventsAtStartTime(
        limit: number,
        page: number,
        date?: Date
    ): Promise<ResponsePayload<IEvent[]>>;

    /**
     * Create an event with given resource
     * @param resource event data
     * @returns event_id
     */
    CreateEvent(resource: IEvent): Promise<ResponsePayload<string>>;

    /**
     * Get an event by a given id
     * @param event_id event id
     */
    GetEvent(
        event_id: string,
        user_id: string
    ): Promise<ResponsePayload<IEvent>>;

    /**
     * Delete an event by a given id
     * @param id event id
     */
    DeleteEvent(id: string): Promise<ResponsePayload<string>>;

    /**
     * Update an event by a given id
     * @param id event id
     * @param resource event data
     */
    UpdateEvent(id: string, resource: IEvent): Promise<ResponsePayload<IEvent>>;

    /**
     * Gets events a user is subscribed to by the user_id
     * @param user_id
     */
    GetSubscribedEvents(
        user_id: string,
        start_timestamp?: Date
    ): Promise<ResponsePayload<Partial<IEvent>[]>>;
}
