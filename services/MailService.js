const nodemailer = require('nodemailer');
const config = require('config');
// MailService 
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  //Button quysak ham buladi
  async sendActivationMail(toEmail, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "ITINFO akkauntni faollashtirish",
      text: "",
      html: `
                    <div>
                        <h1> Akkauntni faollashtirish uchun quyidagi linkni bosing</h1>
                        <a href = "${link}">FAOLLSHTIRISH</a>
                        </div>
                    `,
    });
  }
}

module.exports = new MailService();
