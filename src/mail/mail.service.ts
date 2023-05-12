import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendNewPassword(email: string, newPassword: string) {
    this.mailerService.sendMail({
      to: email,
      from: '21520252@gm.uit.edu.vn',
      subject: 'Your new password',
      text: 'text here',
      html: `<h1>Your new password:${newPassword}</h1>`,
    });
  }
}
