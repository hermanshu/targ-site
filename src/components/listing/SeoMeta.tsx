import React from 'react';
import { Helmet } from 'react-helmet-async';
import { NormalizedListing } from './useListingData';

interface SeoMetaProps {
  listing: NormalizedListing;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({ listing }) => {
  const description = listing.description.length > 160 
    ? `${listing.description.slice(0, 157)}...` 
    : listing.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "image": listing.images?.[0]?.src,
    "description": listing.description.slice(0, 300),
    "sku": listing.id,
    "brand": { 
      "@type": "Brand", 
      "name": "Targ" 
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": listing.currency,
      "price": listing.price,
      "availability": "https://schema.org/InStock",
      "url": `https://targ.app/p/${listing.id}`
    }
  };

  return (
    <Helmet>
      <title>{listing.title} — Targ</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://targ.app/p/${listing.id}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={listing.title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={listing.images?.[0]?.src} />
      <meta property="og:url" content={`https://targ.app/p/${listing.id}`} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="Targ" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={listing.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={listing.images?.[0]?.src} />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}; 