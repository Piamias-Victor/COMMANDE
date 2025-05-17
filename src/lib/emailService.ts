

// Configuration du transporteur d'email
// Pour le développement, on peut utiliser Ethereal qui simule des emails
// En production, vous utiliseriez un service comme Gmail, SendGrid, etc.

// Initialisation du transporteur
export async function initEmailService() {
  // Pour le développement, créer un compte de test
  if (process.env.NODE_ENV === 'development') {
        
    console.log('Compte de test pour les emails créé:');
  } else {  }
}

// Fonction pour envoyer un email
export async function sendEmail(to: string[], subject: string, text: string, html?: string) {
  

  
  console.log('Message envoyé: %s');
  
  // Si en développement, afficher l'URL pour voir l'email
 
  
  return;
}