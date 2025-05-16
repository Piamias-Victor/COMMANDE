import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';
import { getServerSession } from 'next-auth';
import { usePharmacyStore } from '@/store/pharmacyStore';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    // Vérifier si l'utilisateur est authentifié
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const data = await request.json();
    const { labName, pharmacyId, fileName } = data;
    
    if (!labName || !pharmacyId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    
    // Récupérer les données du store (on doit les charger côté serveur)
    // Ceci est simplifié, vous devriez utiliser une base de données en production
    const pharmacyStore = usePharmacyStore.getState();
    const allPharmacies = pharmacyStore.pharmacies;
    
    // Récupérer la pharmacie qui a déposé la commande
    const senderPharmacy = allPharmacies.find(p => p.id === pharmacyId) || 
                           { name: 'Une pharmacie', email: session.user.email || 'unknown@example.com' };
    
    // Filtrer les destinataires (toutes les pharmacies sauf celle qui envoie)
    const recipients = allPharmacies
      .filter(p => p.id !== pharmacyId && p.email)
      .map(p => p.email);
    
    if (recipients.length === 0) {
      return NextResponse.json({ message: 'Aucun destinataire disponible' }, { status: 200 });
    }
    
    // Envoyer l'email
    await sendEmail(
      recipients,
      `Nouvelle commande pour ${labName}`,
      `La pharmacie ${senderPharmacy.name} vient de déposer une commande "${fileName}" pour le laboratoire ${labName}.`,
      `<h2>Nouvelle commande déposée</h2>
       <p>La pharmacie <strong>${senderPharmacy.name}</strong> vient de déposer une commande "${fileName}" pour le laboratoire <strong>${labName}</strong>.</p>
       <p>Connectez-vous à PharmCSV Manager pour voir les détails.</p>`
    );
    
    return NextResponse.json({ success: true, recipients: recipients.length });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}