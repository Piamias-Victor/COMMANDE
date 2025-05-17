import { useState, useMemo } from 'react';
import { Order } from '@/types';
import { useProductsParser, Product } from '@/hooks/useProductsParser';

export function useProductList(order: Order) {
  const {
    products,
    filteredProducts: allFilteredProducts,
    totalQuantity,
    uniqueCodesCount,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage
  } = useProductsParser(order);

  // État local des produits filtrés et paginés
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allFilteredProducts.slice(startIndex, endIndex);
  }, [allFilteredProducts, currentPage, itemsPerPage]);

  // Fonction pour changer de page
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Fonction pour changer le nombre d'éléments par page
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Fonction pour rechercher un produit
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return {
    products,
    displayedProducts: paginatedProducts,
    totalQuantity,
    uniqueCodesCount,
    search,
    currentPage,
    totalPages,
    itemsPerPage,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
    totalFilteredProducts: allFilteredProducts.length
  };
}