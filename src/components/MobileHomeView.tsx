import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon,
  WrenchScrewdriverIcon, 
  BuildingOfficeIcon, 
  TruckIcon, 
  DevicePhoneMobileIcon, 
  TrophyIcon, 
  BookOpenIcon, 
  HeartIcon,
  Squares2X2Icon,
  ClockIcon,
  BriefcaseIcon,
  SparklesIcon,
  ShoppingBagIcon,
  GiftIcon,
  EllipsisHorizontalIcon,
  SunIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import ListingDetailView from './ListingDetailView';
import MobileFilterSheet from './MobileFilterSheet';
import SortSheet from './SortSheet';
import { Listing } from '../types';

const MobileHomeView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getPublishedListings } = useListings();
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const cats = [
      { name: t('home.allListings'), key: 'allListings', icon: Squares2X2Icon, isEmoji: false },
      { name: t('home.electronics'), key: 'electronics', icon: DevicePhoneMobileIcon, isEmoji: false },
      { name: t('home.homeAndGarden'), key: 'homeAndGarden', icon: HomeIcon, isEmoji: false },
      { name: t('home.fashion'), key: 'fashion', icon: ShoppingBagIcon, isEmoji: false },
      { name: t('home.services'), key: 'services', icon: WrenchScrewdriverIcon, isEmoji: false },
      { name: t('home.work'), key: 'work', icon: BriefcaseIcon, isEmoji: false, hasSubcategories: true },
      { name: t('home.realEstate'), key: 'realEstate', icon: BuildingOfficeIcon, isEmoji: false, hasSubcategories: true },
      { name: t('home.plants'), key: 'plants', icon: SunIcon, isEmoji: false },
      { name: t('home.animals'), key: 'animals', icon: HeartIcon, isEmoji: false },
      { name: t('home.construction'), key: 'construction', icon: WrenchScrewdriverIcon, isEmoji: false },
      { name: t('home.free'), key: 'free', icon: GiftIcon, isEmoji: false },
      { name: t('home.furniture'), key: 'furniture', icon: HomeIcon, isEmoji: false },
      { name: t('home.transport'), key: 'transport', icon: TruckIcon, isEmoji: false },
      { name: t('home.sport'), key: 'sport', icon: TrophyIcon, isEmoji: false },
      { name: t('home.books'), key: 'books', icon: BookOpenIcon, isEmoji: false },
      { name: t('home.kids'), key: 'kids', icon: AcademicCapIcon, isEmoji: false },
      { name: t('home.hobby'), key: 'hobby', icon: SparklesIcon, isEmoji: false },
      { name: t('home.other'), key: 'other', icon: EllipsisHorizontalIcon, isEmoji: false }
    ];

    return cats;
  }, [t]);



  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('allListings');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filterState, setFilterState] = useState({
    cityInput: '',
    selectedCategory: '',
    selectedCondition: 'any',
    onlyWithPhoto: false,
    selectedDelivery: 'any',
    selectedSeller: 'any',
    minPrice: '',
    maxPrice: ''
  });

  const initialListings = getPublishedListings();

  // Фильтрация объявлений
  const filteredListings = useMemo(() => {
    let filtered = initialListings.listings;

    // Поиск по тексту
    if (searchText) {
      filtered = filtered.filter((listing: Listing) =>
        listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Фильтр по категории
    if (selectedCategory !== 'allListings') {
      filtered = filtered.filter((listing: Listing) => {
        const matchesCategory = listing.category === selectedCategory;
        const matchesSubcategory = listing.subcategory === selectedCategory;
        return matchesCategory || matchesSubcategory;
      });
    }

    // Дополнительные фильтры
    if (filterState.cityInput) {
      filtered = filtered.filter((listing: Listing) => 
        listing.city.toLowerCase().includes(filterState.cityInput.toLowerCase())
      );
    }

    if (filterState.selectedCategory) {
      // Преобразуем название категории в ключ
      const getCategoryKey = (categoryName: string): string => {
        const categoryMap: { [key: string]: string } = {
          'Любая категория': 'allListings',
          'Электроника': 'electronics',
          'Мебель': 'furniture',
          'Одежда': 'fashion',
          'Книги': 'books',
          'Спорт': 'sport',
          'Авто': 'transport',
          'Детям': 'kids',
          'Недвижимость': 'realEstate',
          'Услуги': 'services',
          'Животные': 'animals',
          'Строительство и ремонт': 'construction',
          'Бесплатно': 'free',
          'Другое': 'other',
          'Работа': 'work',
          'Вакансии': 'vacancies',
          'Резюме': 'resume',
          'Аренда': 'rent',
          'Продажа': 'sale',
          'Растения': 'plants'
        };
        return categoryMap[categoryName] || categoryName;
      };
      
      const categoryKey = getCategoryKey(filterState.selectedCategory);
      filtered = filtered.filter((listing: Listing) => {
        const matchesCategory = listing.category === categoryKey;
        const matchesSubcategory = listing.subcategory === categoryKey;
        return matchesCategory || matchesSubcategory;
      });
    }

    // Фильтр "только с фото" - сортируем объявления, ставя те с фото в начало
    if (filterState.onlyWithPhoto) {
      filtered = filtered.sort((a, b) => {
        const aHasPhoto = a.imageName && a.imageName !== '';
        const bHasPhoto = b.imageName && b.imageName !== '';
        
        if (aHasPhoto && !bHasPhoto) return -1;
        if (!aHasPhoto && bHasPhoto) return 1;
        return 0;
      });
    }

    return filtered;
  }, [initialListings.listings, searchText, selectedCategory, filterState]);

  const handleFilterChange = (newFilters: any) => {
    setFilterState(newFilters);
  };

  const handleFilterReset = () => {
    setFilterState({
      cityInput: '',
      selectedCategory: '',
      selectedCondition: 'any',
      onlyWithPhoto: false,
      selectedDelivery: 'any',
      selectedSeller: 'any',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleFavoriteToggle = (listing: Listing) => {
    if (!currentUser) {
      navigate('/profile');
      return;
    }

    if (isFavorite(listing.id)) {
      removeFromFavorites(listing.id);
    } else {
      addToFavorites(listing);
    }
  };

  const handleCardClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleBackToList = () => {
    setSelectedListing(null);
  };

  const handleNavigateToMessages = (listing: Listing) => {
    if (!currentUser) {
      navigate('/profile');
      return;
    }
    navigate('/messages');
  };

  const handleNavigateToProfile = (mode?: 'signin' | 'signup') => {
    if (mode === 'signup') {
      navigate('/profile?mode=signup');
    } else if (mode === 'signin') {
      navigate('/profile?mode=signin');
    } else {
      navigate('/profile');
    }
  };

  const handleNavigateToSellerProfile = (sellerId: string, sellerName: string, isCompany: boolean) => {
    // Навигация к отдельной странице профиля продавца
    const params = new URLSearchParams({
      sellerId,
      sellerName,
      isCompany: isCompany.toString()
    });
    navigate(`/seller?${params.toString()}`);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setShowLanguageMenu(false);
  };

  const currentLanguageOption = languages.find(lang => lang.code === currentLanguage);

  if (selectedListing) {
    return (
      <ListingDetailView
        listing={selectedListing}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToSellerProfile={handleNavigateToSellerProfile}
      />
    );
  }

  return (
    <div className="mobile-home-view">
      {/* Заголовок */}
      <div className="mobile-header">
        {/* Поисковая строка */}
        <div className="mobile-search-container">
          <div className="mobile-search-bar">
            <div className="mobile-search-input-wrapper">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Поиск объявлений"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mobile-search-input"
              />
            </div>
            <button 
              className="mobile-filter-button"
              onClick={() => setShowFilters(true)}
            >
              <FunnelIcon className="filter-icon" />
            </button>
            <button 
              className="mobile-language-button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <GlobeAltIcon className="language-icon" />
              <span className="language-text">{currentLanguageOption?.flag}</span>
            </button>
          </div>
          
          {/* Выпадающее меню языков */}
          {showLanguageMenu && (
            <div className="mobile-language-dropdown">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`mobile-language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className="mobile-language-flag">{language.flag}</span>
                  <span className="mobile-language-name">{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Категории */}
      <div className="mobile-categories">
        <div className="mobile-categories-scroll">
          {categories.map((category) => {
            const IconComponent = category.icon as React.ComponentType<{ className?: string }>;
            return (
              <button
                key={category.key}
                className={`mobile-category-item ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <IconComponent className="mobile-category-icon" />
                <span className="mobile-category-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Список объявлений */}
      <div className="mobile-listings">
        <div className="mobile-listings-header">
          <span className="mobile-listings-count">
            {filteredListings.length} объявлений
          </span>
          <button 
            className="mobile-sort-button"
            onClick={() => setShowSortSheet(true)}
          >
            <ClockIcon className="sort-icon" />
            <span>Сначала новые</span>
          </button>
        </div>

        <div className="mobile-listings-grid">
          {filteredListings.map((listing) => (
            <div 
              key={listing.id} 
              className="mobile-listing-card"
              onClick={() => handleCardClick(listing)}
            >
              <div className="mobile-listing-image">
                {listing.imageName ? (
                  <img 
                    src={`/images/${listing.imageName}`} 
                    alt={listing.title}
                    className="mobile-listing-img"
                  />
                ) : (
                  <div className="mobile-listing-placeholder">
                    <HomeIcon className="placeholder-icon" />
                  </div>
                )}
                <button 
                  className="mobile-favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(listing);
                  }}
                >
                  <HeartIcon className={`favorite-icon ${isFavorite(listing.id) ? 'active' : ''}`} />
                </button>
              </div>
              <div className="mobile-listing-content">
                <h3 className="mobile-listing-title">{listing.title}</h3>
                <div className="mobile-listing-price">{listing.price}</div>
                <div className="mobile-listing-location">{listing.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальные окна */}
      <MobileFilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <SortSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort="newest"
        onSortSelect={() => {}}
      />
    </div>
  );
};

export default MobileHomeView; 