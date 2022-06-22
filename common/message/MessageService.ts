export interface SuccessPayload<T> {
    data: T;
    status: number;
}

export interface ErrorPayload {
    message: string;
    status: number;
}

export type ResponsePayload<T> = SuccessPayload<T> | ErrorPayload;

export const sendSuccess = <T>(
    status: number = 200,
    data: T
): ResponsePayload<T> => {
    return { data, status };
};

export const sendFailure = (
    status: number = 400,
    message: string
): ErrorPayload => {
    return { status, message };
};

const MessageService = {
    sendSuccess: sendSuccess,
    sendFailure: sendFailure,
};

export default MessageService;
