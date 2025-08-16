import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowDownIcon,
  ArrowUpIcon,
  StarIcon,
  PhotoIcon,
  BriefcaseIcon,
  HomeModernIcon,
  SparklesIcon,
    UserGroupIcon,
  ShoppingBagIcon,
  GiftIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import ListingDetailView from './ListingDetailView';
import WebsiteFilterView, { FilterState } from './WebsiteFilterView';
import SortSheet from './SortSheet';
import ResponsiveListingsGrid from './ResponsiveListingsGrid';
import { Listing } from '../types';

const WebsiteAnnouncementsView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getPublishedListings, loadMoreListings, isLoading, hasMore } = useListings();
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
      { name: t('home.plants'), key: 'plants', icon: SparklesIcon, isEmoji: false },
      { name: t('home.animals'), key: 'animals', icon: HeartIcon, isEmoji: false },
      { name: t('home.construction'), key: 'construction', icon: WrenchScrewdriverIcon, isEmoji: false },
      { name: t('home.free'), key: 'free', icon: GiftIcon, isEmoji: false },
      { name: t('home.furniture'), key: 'furniture', icon: HomeIcon, isEmoji: false },
      { name: t('home.transport'), key: 'transport', icon: TruckIcon, isEmoji: false },
      { name: t('home.sport'), key: 'sport', icon: TrophyIcon, isEmoji: false },
      { name: t('home.books'), key: 'books', icon: BookOpenIcon, isEmoji: false },
      { name: t('home.kids'), key: 'kids', icon: HeartIcon, isEmoji: false },
      { name: t('home.hobby'), key: 'hobby', icon: SparklesIcon, isEmoji: false },
      { name: t('home.other'), key: 'other', icon: EllipsisHorizontalIcon, isEmoji: false }
    ];

    return cats;
  }, [t]);

  const subcategories = useMemo(() => ({
    [t('home.work')]: [
      { name: t('home.vacancies'), key: 'vacancies', icon: UserGroupIcon },
      { name: t('home.resume'), key: 'resume', icon: BriefcaseIcon }
    ],
    [t('home.realEstate')]: [
      { name: t('home.rent'), key: 'rent', icon: HomeModernIcon },
      { name: t('home.sale'), key: 'sale', icon: BuildingOfficeIcon }
    ]
  }), [t]);

  const sortOptions = useMemo(() => [
    { id: 'newest', title: t('home.sortNewest'), icon: ClockIcon },
    { id: 'cheap', title: t('home.sortCheapest'), icon: ArrowDownIcon },
    { id: 'expensive', title: t('home.sortExpensive'), icon: ArrowUpIcon },
    { id: 'popular', title: t('home.sortPopular'), icon: StarIcon },
    { id: 'withPhoto', title: t('home.sortWithPhoto'), icon: PhotoIcon }
  ], [t]);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('allListings');
  const [activeMainCategory, setActiveMainCategory] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    cityInput: '',
    selectedCategory: '',
    onlyWithPhoto: false,
    minPrice: '',
    maxPrice: ''
  });
  const [selectedSort, setSelectedSort] = useState('newest');

  const [listings, setListings] = useState<Listing[]>([]);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Получаем данные из контекста
  useEffect(() => {
    const { listings: publishedListings } = getPublishedListings();
    setListings(publishedListings);
  }, [getPublishedListings]);

  // Обновляем selectedCategory при изменении языка только при первой загрузке
  useEffect(() => {
    setSelectedCategory('allListings');
    setActiveMainCategory(null);
  }, []);

  // Отслеживаем изменения selectedCategory
  useEffect(() => {
    console.log('=== selectedCategory changed ===');
    console.log('New selectedCategory value:', selectedCategory);
    console.log('=== End change tracking ===');
  }, [selectedCategory]);

  // Фильтрация объявлений
  const filteredListings = useMemo(() => {
    let filtered = listings;

    // Поиск по тексту
    if (searchText) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Фильтр по категории
    console.log('=== Filtering Debug ===');
    console.log('selectedCategory:', selectedCategory);
    console.log('isAllListingsSelected:', selectedCategory === 'allListings');
    
    const isAllListingsSelected = selectedCategory === 'allListings';
    
    if (!isAllListingsSelected) {
      // Фильтруем объявления по ключу категории
      console.log('Filtering by category:', selectedCategory);
      console.log('Available listings categories:', Array.from(new Set(listings.map(l => l.category))));
      
      filtered = filtered.filter(listing => {
        const matches = listing.category === selectedCategory;
        console.log(`Listing "${listing.title}" category: "${listing.category}" matches "${selectedCategory}": ${matches}`);
        return matches;
      });
      
      console.log('Filtered listings count:', filtered.length);
    } else {
      console.log('Showing all listings (no category filter)');
    }
    console.log('=== End Filtering Debug ===');

    // Фильтры
    if (filterState.cityInput) {
      filtered = filtered.filter(listing => 
        listing.city.toLowerCase().includes(filterState.cityInput.toLowerCase())
      );
    }

    if (filterState.selectedCategory) {
      filtered = filtered.filter(listing => listing.category === filterState.selectedCategory);
    }

    if (filterState.onlyWithPhoto) {
      filtered = filtered.filter(listing => listing.imageName !== '');
    }

    if (filterState.minPrice) {
      const minPrice = parseFloat(filterState.minPrice);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(listing => {
          const listingPrice = parseFloat(listing.price.toString());
          return listingPrice >= minPrice;
        });
      }
    }

    if (filterState.maxPrice) {
      const maxPrice = parseFloat(filterState.maxPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(listing => {
          const listingPrice = parseFloat(listing.price.toString());
          return listingPrice <= maxPrice;
        });
      }
    }

    return filtered;
  }, [searchText, selectedCategory, filterState, listings]);

  // Сортировка объявлений
  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    
    switch (selectedSort) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'cheap':
        return sorted.sort((a, b) => {
          // Пропускаем объявления с "Договорная" ценой
          if (a.price === "Договорная" && b.price === "Договорная") return 0;
          if (a.price === "Договорная") return 1;
          if (b.price === "Договорная") return -1;
          
          const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
          return priceA - priceB;
        });
      case 'expensive':
        return sorted.sort((a, b) => {
          // Пропускаем объявления с "Договорная" ценой
          if (a.price === "Договорная" && b.price === "Договорная") return 0;
          if (a.price === "Договорная") return 1;
          if (b.price === "Договорная") return -1;
          
          const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
          return priceB - priceA;
        });
      case 'withPhoto':
        return sorted.sort((a, b) => {
          if (a.imageName && !b.imageName) return -1;
          if (!a.imageName && b.imageName) return 1;
          return 0;
        });
      default:
        return sorted;
    }
  }, [filteredListings, selectedSort]);

  const currentSortOption = sortOptions.find(option => option.id === selectedSort);
  const currentLanguageOption = languages.find(lang => lang.code === currentLanguage);

  const isFilterActive = Object.values(filterState).some(value => 
    value !== '' && value !== 'any' && value !== false
  );

  const handleFavoriteToggle = (listing: Listing) => {
    if (!currentUser) {
      // Редирект на профиль для авторизации
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
    console.log('Переходим к сообщениям для объявления:', listing.title, 'продавец:', listing.sellerName);
    
    // Переходим к сообщениям с полными параметрами объявления
    const params = new URLSearchParams({
      listingId: listing.id,
      sellerId: listing.userId,
      title: listing.title,
      sellerName: listing.sellerName,
      price: listing.price,
      currency: listing.currency,
      city: listing.city,
      category: listing.category,
      isCompany: listing.isCompany.toString(),
      imageName: listing.imageName || '',
      contactMethod: listing.contactMethod || 'chat'
    });
    navigate(`/messages?${params.toString()}`);
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

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
  };

  const handleFilterReset = () => {
    setFilterState({
      cityInput: '',
      selectedCategory: '',
      onlyWithPhoto: false,
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log('=== Category Click Debug ===');
    console.log('Clicked category name:', categoryName);
    
    const category = categories.find(cat => cat.name === categoryName);
    console.log('Found category:', category);
    
    if (category?.hasSubcategories) {
      // Если у категории есть подкатегории, переключаем их отображение
      console.log('Category has subcategories, toggling expansion');
      setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
      setActiveMainCategory(categoryName);
    } else if (category) {
      // Если это обычная категория, выбираем её
      console.log('Setting selected category to:', category.key);
      console.log('Before setSelectedCategory, selectedCategory is:', selectedCategory);
      
      setSelectedCategory(category.key);
      setExpandedCategory(null);
      setActiveMainCategory(null);
      
      // Если выбрали "Все объявления", сбрасываем активную основную категорию
      if (category.key === 'allListings') {
        setActiveMainCategory(null);
      }
    }
    
    console.log('Current selectedCategory will be:', category?.key);
    console.log('=== End Debug ===');
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    console.log('=== Subcategory Click Debug ===');
    console.log('Clicked subcategory name:', subcategoryName);
    
    // Находим подкатегорию в списке и получаем её ключ
    const subcategory = Object.values(subcategories).flat().find(sub => sub.name === subcategoryName);
    console.log('Found subcategory:', subcategory);
    
    if (subcategory) {
      console.log('Setting selected category to:', subcategory.key);
      setSelectedCategory(subcategory.key);
      
      // Находим основную категорию для этой подкатегории
      const mainCategory = Object.entries(subcategories).find(([mainCat, subs]) => 
        subs.some(sub => sub.name === subcategoryName)
      );
      
      if (mainCategory) {
        setActiveMainCategory(mainCategory[0]);
      }
    }
    setExpandedCategory(null);
    
    console.log('=== End Subcategory Debug ===');
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    setShowLanguageMenu(false);
  };

  // Закрытие выпадающего меню языка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.website-language-selector')) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);



  if (selectedListing) {
    return (
      <ListingDetailView
        listing={selectedListing}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isFavorite(selectedListing.id)}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }

  return (
    <div className="website-announcements-view">
      {/* Логотип и поисковая строка */}
      <div className="website-header-section">
        {/* Логотип */}
        <div className="website-logo-container">
          <img 
            src="/images/logo.png" 
            alt="TARG Logo" 
            className="website-logo"
            onError={(e) => {
              console.error('Ошибка загрузки логотипа:', e);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => console.log('Логотип загружен успешно')}
          />
        </div>
        
        {/* Поисковая строка с фильтрами */}
        <div className="website-search-section">
          <div className="website-search-bar-with-filters">
            <div className="website-search-input-group">
              <MagnifyingGlassIcon className="website-search-icon" />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="website-search-input"
              />
              <button 
                className={`website-filter-toggle-button ${isFilterActive ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="website-filter-icon" />
              </button>
            </div>
            
            <button 
              className={`website-sort-button ${selectedSort !== 'newest' ? 'active' : ''}`}
              onClick={() => setShowSortSheet(true)}
            >
              <ArrowDownIcon className="website-sort-icon" />
              <span className="website-sort-text">{currentSortOption?.title}</span>
            </button>
          </div>
        </div>
        
        {/* Кнопка переключения языка */}
        <div className="website-language-selector">
          <button 
            className="website-language-button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <GlobeAltIcon className="website-language-icon" />
            <span className="website-language-text">{currentLanguageOption?.flag}</span>
          </button>
          
          {showLanguageMenu && (
            <div className="website-language-dropdown">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`website-language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className="website-language-flag">{language.flag}</span>
                  <span className="website-language-name">{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Выпадающие фильтры */}
      <WebsiteFilterView
        isOpen={showFilters}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onClose={() => setShowFilters(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Категории */}
      <div className="website-categories-section">
        <div className="website-categories-scroll">
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.name;
            const hasSubcategories = category.hasSubcategories;
            const IconComponent = category.icon as React.ComponentType<{ className?: string }>;
            
            return (
              <React.Fragment key={category.name}>
                <button
                  className={`website-category-button ${selectedCategory === category.key || activeMainCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <IconComponent className="website-category-icon-hero" />
                  <span className="website-category-name">{category.name}</span>
                  {hasSubcategories && (
                    <ChevronDownIcon 
                      className={`website-category-chevron ${isExpanded ? 'expanded' : ''}`} 
                    />
                  )}
                </button>
                
                {/* Подкатегории */}
                {hasSubcategories && isExpanded && (
                  <>
                    {subcategories[category.name as keyof typeof subcategories]?.map((subcategory) => {
                      const SubIconComponent = subcategory.icon as React.ComponentType<{ className?: string }>;
                      return (
                        <button
                          key={subcategory.name}
                          className={`website-subcategory-button ${selectedCategory === subcategory.key ? 'active' : ''}`}
                          onClick={() => handleSubcategoryClick(subcategory.name)}
                        >
                          <SubIconComponent className="website-subcategory-icon" />
                          <span className="website-subcategory-name">{subcategory.name}</span>
                        </button>
                      );
                    })}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Виртуализированный список объявлений */}
      <div className="website-listings-grid" style={{ 
        height: 'calc(100vh - 300px)', 
        minHeight: '400px',
        marginTop: '0'
      }}>
        <ResponsiveListingsGrid
          listings={sortedListings}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorite={isFavorite}
          onCardClick={handleCardClick}
          hasMore={hasMore}
          onLoadMore={loadMoreListings}
          isLoading={isLoading}
        />
      </div>

      {/* Модальное окно сортировки */}
      <SortSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort={selectedSort}
        onSortSelect={handleSortSelect}
      />
    </div>
  );
};

export default WebsiteAnnouncementsView; 