import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { fromEnv } from '@aws-sdk/credential-providers';
import { config } from '../config/env';
import { logger } from './logger';

const sesClient = new SESClient({
    region: config.AWS_REGION,
    credentials: fromEnv(),
});

// Function to send an email
export async function sendEmail(
    toAddresses: string[],
    fromAddress: string,
    subject: string,
    bodyText: string,
    bodyHtml?: string // optional
) {
    const params = {
        Source: fromAddress,
        Destination: {
            ToAddresses: toAddresses,
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: "UTF-8",
            },
            Body: {
                Text: {
                    Data: bodyText,
                    Charset: "UTF-8",
                },
                Html: bodyHtml
                    ? {
                        Data: bodyHtml,
                        Charset: "UTF-8",
                    }
                    : undefined, // Only include HTML if provided
            },
        },
    };

    try {
        const command = new SendEmailCommand(params);
        const data = await sesClient.send(command);
        logger.info("Email sent", data);
        return data;
    } catch (error) {
        logger.error("Error sending email", error);
        throw error; // Re-throw the error so the caller can handle it
    }
}
