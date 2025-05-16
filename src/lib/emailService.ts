import nodemailer from 'nodemailer';

// Configuration du transporteur d'email
// Pour le développement, on peut utiliser Ethereal qui simule des emails
// En production, vous utiliseriez un service comme Gmail, SendGrid, etc.
let transporter: nodemailer.Transporter;

// Initialisation du transporteur
export async function initEmailService() {
  // Pour le développement, créer un compte de test
  if (process.env.NODE_ENV === 'development') {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Compte de test pour les emails créé:', testAccount.web);
  } else {
    // Pour la production, utiliser votre propre configuration SMTP
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

// Fonction pour envoyer un email
export async function sendEmail(to: string[], subject: string, text: string, html?: string) {
  if (!transporter) {
    await initEmailService();
  }
  
  const info = await transporter.sendMail({
    from: `"PharmCSV Manager" <${process.env.EMAIL_FROM || 'notifications@pharmcsv.example.com'}>`,
    to: to.join(', '),
    subject,
    text,
    html: html || text,
  });
  
  console.log('Message envoyé: %s', info.messageId);
  
  // Si en développement, afficher l'URL pour voir l'email
  if (process.env.NODE_ENV === 'development') {
    console.log('URL de prévisualisation: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}