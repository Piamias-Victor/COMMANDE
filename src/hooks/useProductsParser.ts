// src/hooks/useProductsParser.ts
import { useMemo, useState } from 'react';
import { Order } from '@/types';

export interface Product {
  code: string;
  quantity: number;
  index: number;
}

interface UseProductsParserResult {
  products: Product[];
  filteredProducts: Product[];
  totalQuantity: number;
  uniqueCodesCount: number;
  search: string;
  setSearch: (search: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
}

export function useProductsParser(order: Order): UseProductsParserResult {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Assure que les produits sont correctement formatés
  const products = useMemo(() => {
    if (!order.parsedData) return [];
    
    return order.parsedData.map((item, index) => ({
      code: item.code,
      quantity: item.quantity,
      index
    }));
  }, [order.parsedData]);
  
  // Filtrer les produits en fonction de la recherche
  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }
    
    const searchLower = search.toLowerCase();
    return products.filter(product => 
      product.code.toLowerCase().includes(searchLower)
    );
  }, [products, search]);
  
  // Calculer les statistiques
  const totalQuantity = useMemo(() => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  }, [products]);
  
  const uniqueCodesCount = useMemo(() => {
    return new Set(products.map(product => product.code)).size;
  }, [products]);
  
  // Calculer la pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts, itemsPerPage]);
  
  // Obtenir les produits de la page actuelle
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);
  
  return {
    products,
    filteredProducts: paginatedProducts,
    totalQuantity,
    uniqueCodesCount,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage
  };
}