import { IFeedback } from "./Ifeedback";

/**
 * Service that manages user feedback for LiveStreamNetwork
 */

export interface IFeedbackService {
    /**
     * Create a feedback message in database
     * 
     * @param resource user_id and feedback string
     */
    CreateFeedback(resource: IFeedback): Promise<string>;
}
