import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async sendTestEmail(@Body('email') email: string) {
    await this.mailService.sendVerificationEmail(email, 'test-token-123');

    return {
      message: 'Test email sent',
      email,
    };
  }
}
