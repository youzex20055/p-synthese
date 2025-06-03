"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'youssefhdilisse5@gmail.com',
                    pass: 'plcqwinfsufmimbu',
                },
                tls: {
                    rejectUnauthorized: false
                }
            },
            settings: {
                defaultFrom: 'youssefhdilisse5@gmail.com',
                defaultReplyTo: 'youssefhdilisse5@gmail.com',
            },
        },
    },
};
