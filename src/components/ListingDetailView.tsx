import React from 'react';
import { ListingPage } from './listing/ListingPage';
import { Listing } from '../types';

interface ListingDetailViewProps {
  listing: Listing;
  onBack: () => void;
  onFavoriteToggle: (listing: Listing) => void;
  isFavorite: boolean;
  onNavigateToMessages?: (listing: Listing) => void;
  onNavigateToProfile?: (mode?: 'signin' | 'signup') => void;
  onNavigateToSellerProfile?: (sellerId: string, sellerName: string, isCompany: boolean) => void;
}

const ListingDetailView: React.FC<ListingDetailViewProps> = (props) => {
  // Просто проксируем все пропсы в ListingPage
  return <ListingPage {...props} />;
};

export default ListingDetailView;