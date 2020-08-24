export class ProcedureError extends Error {
    constructor(
        error: Error,
    ) {
        super();
        this.message = error.message;
        this.stack = error.stack;
    }
}
