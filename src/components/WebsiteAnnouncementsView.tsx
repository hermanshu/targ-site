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
  ChevronDownIcon,
  UserIcon,
  SwatchIcon
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
import ScrollToTopButton from './ScrollToTopButton';

import { Listing } from '../types';

const WebsiteAnnouncementsView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getPublishedListings, loadMoreListings, isLoading, hasMore, incrementViews } = useListings();
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
      { name: t('home.furniture'), key: 'furniture', icon: SwatchIcon, isEmoji: false },
      { name: t('home.transport'), key: 'transport', icon: TruckIcon, isEmoji: false },
      { name: t('home.sport'), key: 'sport', icon: TrophyIcon, isEmoji: false },
      { name: t('home.books'), key: 'books', icon: BookOpenIcon, isEmoji: false },
      { name: t('home.kids'), key: 'kids', icon: UserIcon, isEmoji: false },
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
    const isAllListingsSelected = selectedCategory === 'allListings';
    
    if (!isAllListingsSelected) {
      // Фильтруем объявления по ключу категории или подкатегории
      filtered = filtered.filter(listing => {
        // Проверяем совпадение по основной категории или подкатегории
        const matchesCategory = listing.category === selectedCategory;
        const matchesSubcategory = listing.subcategory === selectedCategory;
        return matchesCategory || matchesSubcategory;
      });
    }

    // Фильтры
    if (filterState.cityInput) {
      filtered = filtered.filter(listing => 
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
      filtered = filtered.filter(listing => {
        const matchesCategory = listing.category === categoryKey;
        const matchesSubcategory = listing.subcategory === categoryKey;
        return matchesCategory || matchesSubcategory;
      });
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
        return sorted.sort((a, b) => {
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
          return dateB.getTime() - dateA.getTime();
        });
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
    // Увеличиваем счетчик просмотров при клике на карточку
    incrementViews(listing.id);
    setSelectedListing(listing);
  };

  const handleBackToList = () => {
    setSelectedListing(null);
  };

  const handleNavigateToMessages = (listing: Listing) => {
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

  const handleNavigateToSellerProfile = (sellerId: string, sellerName: string, isCompany: boolean) => {
    // Навигация к отдельной странице профиля продавца
    const params = new URLSearchParams({
      sellerId,
      sellerName,
      isCompany: isCompany.toString()
    });
    navigate(`/seller?${params.toString()}`);
  };

  const renderListingDetail = () => {
    if (!selectedListing) {
      return null;
    }
    
    const isListingFavorite = isFavorite(selectedListing.id);
    
    return (
      <ListingDetailView
        listing={selectedListing}
        onBack={handleBackToList}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={isListingFavorite}
        onNavigateToMessages={handleNavigateToMessages}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToSellerProfile={handleNavigateToSellerProfile}
      />
    );
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
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category?.hasSubcategories) {
      // Если у категории есть подкатегории, переключаем их отображение
      setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
      setActiveMainCategory(categoryName);
    } else if (category) {
      // Если это обычная категория, выбираем её
      setSelectedCategory(category.key);
      setExpandedCategory(null);
      setActiveMainCategory(null);
      
      // Если выбрали "Все объявления", сбрасываем активную основную категорию
      if (category.key === 'allListings') {
        setActiveMainCategory(null);
      }
    }
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    // Находим подкатегорию в списке и получаем её ключ
    const subcategory = Object.values(subcategories).flat().find(sub => sub.name === subcategoryName);
    
    if (subcategory) {
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
        onNavigateToSellerProfile={handleNavigateToSellerProfile}
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

      {/* Кнопка "Наверх" */}
      <ScrollToTopButton />

      {/* Детальная карточка объявления */}
      {renderListingDetail()}
    </div>
  );
};

export default WebsiteAnnouncementsView; 