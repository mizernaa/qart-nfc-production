import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${domain}/api/auth/verify-email/${token}`

  try {
    await resend.emails.send({
      from: "QART <noreply@qart.app>",
      to: email,
      subject: "E-posta Adresinizi Doğrulayın - QART",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>E-posta Doğrulama</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 QART</h1>
              <h2>E-posta Doğrulama</h2>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              
              <p>QART hesabınızı oluşturduğunuz için teşekkür ederiz! E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">E-postamı Doğrula</a>
              </div>
              
              <p>Eğer buton çalışmazsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
              <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <p><strong>Bu link 24 saat geçerlidir.</strong></p>
              
              <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı güvenle silebilirsiniz.</p>
              
              <p>Saygılarımızla,<br>QART Ekibi</p>
            </div>
            <div class="footer">
              <p>Bu e-posta QART dijital kartvizit sistemi tarafından gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
  } catch (error) {
    console.error("Failed to send verification email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${domain}/auth/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: "QART <noreply@qart.app>",
      to: email,
      subject: "Şifre Sıfırlama - QART",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Şifre Sıfırlama</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 QART</h1>
              <h2>Şifre Sıfırlama</h2>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              
              <p>QART hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifre oluşturmak için aşağıdaki butona tıklayın:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
              </div>
              
              <p>Eğer buton çalışmazsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
              <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Güvenlik Uyarısı:</strong>
                <ul>
                  <li>Bu link sadece 1 saat geçerlidir</li>
                  <li>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı silin</li>
                  <li>Hesabınızın güvenliği için güçlü bir şifre seçin</li>
                </ul>
              </div>
              
              <p>Saygılarımızla,<br>QART Ekibi</p>
            </div>
            <div class="footer">
              <p>Bu e-posta QART dijital kartvizit sistemi tarafından gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "QART <noreply@qart.app>",
      to: email,
      subject: "QART'a Hoş Geldiniz! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Hoş Geldiniz</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 QART</h1>
              <h2>Hoş Geldiniz!</h2>
            </div>
            <div class="content">
              <p>Merhaba <strong>${name}</strong>,</p>
              
              <p>QART dijital kartvizit ailesine katıldığınız için çok mutluyuz! 🎉</p>
              
              <p>Artık modern, etkileşimli dijital kartvizitler oluşturabilir ve iş ağınızı genişletebilirsiniz.</p>
              
              <h3>🚀 Neler Yapabilirsiniz:</h3>
              
              <div class="feature">
                <h4>📱 Dijital Kartvizit Oluşturun</h4>
                <p>Profesyonel görünümlü, mobil uyumlu kartvizitler tasarlayın</p>
              </div>
              
              <div class="feature">
                <h4>📊 Analitik Takibi</h4>
                <p>Kartvizitinizin performansını anlık olarak izleyin</p>
              </div>
              
              <div class="feature">
                <h4>🎨 Özel Temalar</h4>
                <p>Markanıza uygun renkler ve tasarımlar seçin</p>
              </div>
              
              <div class="feature">
                <h4>🔗 Sosyal Medya Entegrasyonu</h4>
                <p>Tüm sosyal medya hesaplarınızı tek yerde toplayın</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${domain}/dashboard" class="button">Dashboard'a Git</a>
              </div>
              
              <p>Herhangi bir sorunuz olursa, bize ulaşmaktan çekinmeyin!</p>
              
              <p>Başarılar dileriz,<br>QART Ekibi</p>
            </div>
            <div class="footer">
              <p>QART - Dijital Kartvizit Çözümleri</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    throw error
  }
}