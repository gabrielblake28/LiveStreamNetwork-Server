export interface SuccessPayload<T> {
    result: "success";
    data: T;
    status: number;
}

export interface ErrorPayload {
    result: "error";
    message: string;
    status: number;
}

export type ResponsePayload<T> = SuccessPayload<T> | ErrorPayload;

export const sendSuccess = <T>(
    status: number = 200,
    data: T
): ResponsePayload<T> => {
    return { data, status, result: "success" };
};

export const sendFailure = (
    status: number = 400,
    message: string
): ErrorPayload => {
    return { status, message, result: "error" };
};

const MessageService = {
    sendSuccess: sendSuccess,
    sendFailure: sendFailure,
};

export default MessageService;
