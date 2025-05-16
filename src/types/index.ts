/**
 * Représente un utilisateur pharmacie
 */
export interface Pharmacy {
  /** Identifiant unique de la pharmacie */
  id: string;
  /** Nom de la pharmacie */
  name: string;
  /** Email de contact (login) */
  email: string;
  /** Mot de passe (stocké en clair pour la démo, en production utiliser un hash) */
  password: string;
  /** Adresse */
  address?: string;
  /** Date de création dans le système */
  createdAt: Date;
  /** Date de dernière modification */
  updatedAt: Date;
}

/**
 * États possibles pour une commande
 */
export type OrderStatus = 
  | 'pending' // En attente d'approbation
  | 'approved' // Approuvée
  | 'rejected' // Rejetée
  | 'awaiting_delivery' // En attente de livraison
  | 'delivered'; // Livrée

/**
 * Représente une commande importée via un fichier CSV
 */
export interface Order {
  /** Identifiant unique de la commande */
  id: string;
  /** Identifiant du laboratoire associé */
  labId: string;
  /** Identifiant de la pharmacie associée */
  pharmacyId: string;
  /** Nom du fichier original */
  fileName: string;
  /** Date de création de la commande */
  createdAt: Date;
  /** Contenu brut du fichier CSV */
  rawContent: string;
  /** Données analysées du fichier CSV */
  parsedData: Array<{
    code: string;
    quantity: number;
  }>;
  /** Nombre de références uniques */
  referencesCount: number;
  /** Nombre total de boîtes */
  boxesCount: number;
  /** Statut actuel de la commande */
  status: OrderStatus;
  /** Date d'approbation/rejet */
  reviewedAt?: Date;
  /** Commentaire sur l'approbation/rejet */
  reviewNote?: string;
  /** Date prévue de livraison */
  expectedDeliveryDate?: Date;
  /** Date effective de livraison */
  deliveredAt?: Date;
  /** Personne qui a approuvé/rejeté la commande */
  reviewedBy?: string;
}

/**
 * Statistiques agrégées par laboratoire
 */
export interface LabStatistics {
  /** Identifiant du laboratoire */
  labId: string;
  /** Nombre total de commandes */
  orderCount: number;
  /** Date de la première commande */
  firstOrderDate: Date | null;
  /** Date de la dernière commande */
  lastOrderDate: Date | null;
  /** Nombre total de références uniques */
  totalReferences: number;
  /** Nombre total de boîtes */
  totalBoxes: number;
  /** Nombre de pharmacies différentes */
  pharmacyCount: number;
  /** Liste des pharmacies ayant déposé des commandes */
  pharmacies: Array<{
    id: string;
    name: string;
    orderCount: number;
  }>;
}