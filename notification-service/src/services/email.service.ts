export const EmailService = {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log('--- MOCK EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('------------------');
  }
};
