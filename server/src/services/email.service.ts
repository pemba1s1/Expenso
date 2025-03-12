import { sendEmail } from "../utils/ses"
import { config } from "../config/env"

export const sendInviteEmail = async (email: string, inviteLink: string) => {
    const subject = 'You are invited to join a group';
    const bodyText = `Click the following link to join the group: ${inviteLink}`;
    await sendEmail([
        // email,
        config.CLIENT_EMAIL // temporarily using the client email for all accounts to get email
    ], config.SERVICE_EMAIL, subject, bodyText);
};

export const sendVerificationEmail = async (email: string, verificationLink: string) => {
    const subject = 'Verify your account';
    const bodyText = `Click the following link to verify your account: ${verificationLink}. This link will expire in 1 hour.`;
    await sendEmail([
        // email,
        config.CLIENT_EMAIL // temporarily using the client email for all accounts to
    ], config.SERVICE_EMAIL, subject, bodyText);
}
