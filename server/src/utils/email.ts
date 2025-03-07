import nodemailer from 'nodemailer';

export const sendInviteEmail = async (email: string, inviteLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'You are invited to join a group',
    text: `Click the following link to join the group: ${inviteLink}`,
  };

  await transporter.sendMail(mailOptions);
};