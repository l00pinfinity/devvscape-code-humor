export interface ErrorResponse {
    code: string;
    message: string;
    errors: {
        message: string;
        domain: string;
        reason: string;
    }[];
}
