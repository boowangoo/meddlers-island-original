import express from 'express';

export class ExpressSetup {
    public static setup(app: express.Application): void {
        app.use(express.static('dist/client'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
}
