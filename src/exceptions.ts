export class FetchException extends Error {
    code: number | null;
    extras: any | null;

    constructor(message: string, status: number | null = null, extras: any | null = null) {
        super(message);

        this.name = this.constructor.name;
        this.code = status;
        this.extras = extras;
    }
}