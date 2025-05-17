// src/app/orders/[id]/page.tsx (mise à jour finale)
'use client';

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { useOrderActions } from '@/hooks/useOrderActions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { OrderBasicInfo } from '@/components/features/OrderBasicInfo';
import { ProductList } from '@/components/features/ProductList';
import { OrderHistory } from '@/components/features/OrderHistory';
import { OrderWorkflow } from '@/components/features/OrderWorkflow';
import { OrderExports } from '@/components/features/OrderExports';
import { OrderComments } from '@/components/features/OrderComments';
import { Spinner } from '@/components/ui/Spinner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { order, isLoading, error, lab, pharmacy } = useOrderDetails(orderId);
  const { handleRefresh } = useOrderActions(orderId);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  if (error || !order) {
    return (
      <MainLayout>
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {error || "Commande introuvable"}
            </h2>
            <Button onClick={() => router.push('/orders')}>
              Retour à la liste des commandes
            </Button>
          </div>
        </Card>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Détail de la commande</h1>
            <span className="text-gray-500">#{order.id.substring(0, 8)}</span>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push('/orders')}
          >
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </span>
          </Button>
        </div>
        
        <OrderBasicInfo order={order} lab={lab} pharmacy={pharmacy} />
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="products">Produits ({order.referencesCount})</TabsTrigger>
            <TabsTrigger value="status">Statut et livraison</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
            <TabsTrigger value="comments">Commentaires</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Informations détaillées</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-500">Commande</h4>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Nom du fichier</dt>
                      <dd className="text-sm">{order.fileName}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Références uniques</dt>
                      <dd className="text-sm">{order.referencesCount}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Nombre de boîtes</dt>
                      <dd className="text-sm">{order.boxesCount}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                      <dd className="text-sm">{new Date(order.createdAt).toLocaleString('fr-FR')}</dd>
                    </div>
                    {order.reviewedAt && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Date de revue</dt>
                        <dd className="text-sm">{new Date(order.reviewedAt).toLocaleString('fr-FR')}</dd>
                      </div>
                    )}
                    {order.reviewedBy && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Revu par</dt>
                        <dd className="text-sm">{order.reviewedBy}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-500">Informations associées</h4>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Laboratoire</dt>
                      <dd className="text-sm">{lab?.name || 'Inconnu'}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <dt className="text-sm font-medium text-gray-500">Pharmacie</dt>
                      <dd className="text-sm">{pharmacy?.name || 'Inconnue'}</dd>
                    </div>
                    {pharmacy?.email && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Email pharmacie</dt>
                        <dd className="text-sm">{pharmacy.email}</dd>
                      </div>
                    )}
                    {pharmacy?.address && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Adresse pharmacie</dt>
                        <dd className="text-sm">{pharmacy.address}</dd>
                      </div>
                    )}
                    {order.expectedDeliveryDate && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Livraison prévue</dt>
                        <dd className="text-sm">{new Date(order.expectedDeliveryDate).toLocaleDateString('fr-FR')}</dd>
                      </div>
                    )}
                    {order.deliveredAt && (
                      <div className="grid grid-cols-2 gap-4">
                        <dt className="text-sm font-medium text-gray-500">Livré le</dt>
                        <dd className="text-sm">{new Date(order.deliveredAt).toLocaleString('fr-FR')}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              {order.reviewNote && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2 text-gray-500">Note</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                    <p className="text-sm">{order.reviewNote}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([order.rawContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = order.fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Télécharger le fichier CSV
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <ProductList order={order} />
          </TabsContent>
          
          <TabsContent value="status" className="mt-4">
            <OrderWorkflow 
              order={order} 
              onUpdate={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="exports" className="mt-4">
            <OrderExports 
              order={order}
              lab={lab}
              pharmacy={pharmacy}
            />
          </TabsContent>
          
          <TabsContent value="comments" className="mt-4">
            <OrderComments orderId={order.id} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <OrderHistory order={order} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}