import { INotificationStrategy } from "../def/INotificationStrategy";

export class BatchEmailNotificationStrategy implements INotificationStrategy {
    send(): void {
        throw new Error("Method not implemented.");
    }
}
