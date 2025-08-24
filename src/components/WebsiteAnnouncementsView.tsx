import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
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
  SwatchIcon,
  SunIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { ListingPage } from './listing/ListingPage';
import WebsiteFilterView, { FilterState } from './WebsiteFilterView';
import WebsiteCategoryView from './WebsiteCategoryView';
import ResponsiveListingsGrid from './ResponsiveListingsGrid';
import Pagination from './Pagination';


import { Listing } from '../types';

interface WebsiteAnnouncementsViewProps {
  showSortSheet?: boolean;
  setShowSortSheet?: (show: boolean) => void;
  selectedSort?: string;
  setSelectedSort?: (sort: string) => void;
}

const WebsiteAnnouncementsView: React.FC<WebsiteAnnouncementsViewProps> = ({ 
  showSortSheet: externalShowSortSheet, 
  setShowSortSheet: externalSetShowSortSheet,
  selectedSort: externalSelectedSort,
  setSelectedSort: externalSetSelectedSort
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getPublishedListings, isLoading, incrementViews } = useListings();

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      { name: t('home.furniture'), key: 'furniture', icon: SwatchIcon, isEmoji: false },
      { name: t('home.transport'), key: 'transport', icon: TruckIcon, isEmoji: false },
      { name: t('home.sport'), key: 'sport', icon: TrophyIcon, isEmoji: false },
      { name: t('home.books'), key: 'books', icon: BookOpenIcon, isEmoji: false },
      { name: t('home.kids'), key: 'kids', icon: AcademicCapIcon, isEmoji: false },
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
  // Удаляем неиспользуемую переменную activeMainCategory

  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    cityInput: '',
    selectedCategory: '',
    onlyWithPhoto: false,
    minPrice: '',
    maxPrice: ''
  });

  
  // Используем внешние пропсы, если они предоставлены, иначе внутренние состояния
  const selectedSort = externalSelectedSort !== undefined ? externalSelectedSort : 'newest';

  const [listings, setListings] = useState<Listing[]>([]);

  // Функция для конвертации цены в EUR для сравнения
  const convertPriceToEUR = (price: string, currency: string): number => {
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    if (isNaN(numericPrice)) return 0;
    
    if (currency === 'EUR') {
      return numericPrice;
    } else if (currency === 'RSD') {
      // 1 EUR = 117 RSD
      return numericPrice / 117;
    }
    return numericPrice; // По умолчанию считаем как EUR
  };

  // Получаем данные из контекста
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { listings: publishedListings } = getPublishedListings();
    setListings(publishedListings);
  }, [getPublishedListings]);

  // Синхронизируем состояние selectedListing с URL параметрами
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const listingId = searchParams.get('listingId');
    
    if (listingId && listings.length > 0) {
      const listing = listings.find(l => l.id === listingId);
      if (listing) {
        setSelectedListing(listing);
      }
    }
  }, [location.search, listings]); // Добавляем listings обратно для корректной работы

  // Обновляем selectedCategory при изменении языка только при первой загрузке
  useEffect(() => {
    setSelectedCategory('allListings');
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

    // Фильтр "только с фото" - показываем только объявления с фото
    if (filterState.onlyWithPhoto) {
      filtered = filtered.filter((listing: Listing) => {
        return listing.imageName && 
               listing.imageName !== '' && 
               listing.imageName !== null && 
               listing.imageName !== undefined;
      });
    }

    if (filterState.minPrice) {
      const minPriceEUR = parseFloat(filterState.minPrice);
      if (!isNaN(minPriceEUR)) {
        filtered = filtered.filter(listing => {
          // Пропускаем объявления с "Договорная" ценой
          if (listing.price === "Договорная") return false;
          
          const listingPriceEUR = convertPriceToEUR(listing.price.toString(), listing.currency || 'EUR');
          return listingPriceEUR >= minPriceEUR;
        });
      }
    }

    if (filterState.maxPrice) {
      const maxPriceEUR = parseFloat(filterState.maxPrice);
      if (!isNaN(maxPriceEUR)) {
        filtered = filtered.filter(listing => {
          // Пропускаем объявления с "Договорная" ценой
          if (listing.price === "Договорная") return false;
          
          const listingPriceEUR = convertPriceToEUR(listing.price.toString(), listing.currency || 'EUR');
          return listingPriceEUR <= maxPriceEUR;
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
          
          const priceA = convertPriceToEUR(a.price, a.currency || 'EUR');
          const priceB = convertPriceToEUR(b.price, b.currency || 'EUR');
          return priceA - priceB;
        });
      case 'expensive':
        return sorted.sort((a, b) => {
          // Пропускаем объявления с "Договорная" ценой
          if (a.price === "Договорная" && b.price === "Договорная") return 0;
          if (a.price === "Договорная") return 1;
          if (b.price === "Договорная") return -1;
          
          const priceA = convertPriceToEUR(a.price, a.currency || 'EUR');
          const priceB = convertPriceToEUR(b.price, b.currency || 'EUR');
          return priceB - priceA;
        });
      case 'withPhoto':
        return sorted.sort((a, b) => {
          const aHasPhoto = a.imageName && a.imageName !== '';
          const bHasPhoto = b.imageName && b.imageName !== '';
          
          if (aHasPhoto && !bHasPhoto) return -1;
          if (!aHasPhoto && bHasPhoto) return 1;
          return 0;
        });
      default:
        return sorted;
    }
  }, [filteredListings, selectedSort]);

  // Пагинация объявлений
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedListings.slice(startIndex, endIndex);
  }, [sortedListings, currentPage, itemsPerPage]);

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(sortedListings.length / itemsPerPage);

  // Сбрасываем на первую страницу при изменении фильтров или количества элементов на странице
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, filterState, selectedSort, itemsPerPage]);



  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentSortOption = sortOptions.find(option => option.id === selectedSort);


  const isFilterActive = Object.values(filterState).some(value => 
    value !== '' && value !== 'any' && value !== false
  );

  // Определяем, применялись ли фильтры или поиск
  const hasActiveFilters = useMemo(() => {
    return Boolean(searchText) || isFilterActive || selectedCategory !== 'allListings';
  }, [searchText, isFilterActive, selectedCategory]);

  const handleFavoriteToggle = useCallback((listing: Listing) => {
    if (!currentUser) {
      // Редирект на профиль для авторизации
      navigate('/profile');
      return;
    }

    // Предотвращаем перезагрузку страницы
    try {
      // Обновляем избранное напрямую, минуя контекст списков
      if (isFavorite(listing.id)) {
        removeFromFavorites(listing.id);
      } else {
        addToFavorites(listing);
      }
      
      // Принудительно обновляем состояние без изменения URL
      // Это предотвратит перезагрузку страницы
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
    }
  }, [currentUser, isFavorite, removeFromFavorites, addToFavorites, navigate]);

  const handleCardClick = (listing: Listing) => {
    // Увеличиваем счетчик просмотров при клике на карточку
    incrementViews(listing.id);
    setSelectedListing(listing);
    
    // Добавляем параметр в URL для возможности прямых ссылок
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('listingId', listing.id);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleBackToList = () => {
    setSelectedListing(null);
    
    // Очищаем параметр из URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('listingId');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
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
      <ListingPage
        listingId={selectedListing.id}
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



  const handleCategoryClick = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category?.hasSubcategories) {
      // Если у категории есть подкатегории, переключаем их отображение
      setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    } else if (category) {
      // Если это обычная категория, выбираем её
      setSelectedCategory(category.key);
      setExpandedCategory(null); // Закрываем выпадающий список
      setShowCategories(false); // Закрываем панель категорий
      setShowFilters(false); // Закрываем фильтры
    }
  };







  if (selectedListing) {
    return renderListingDetail();
  }

  return (
    <div className="website-announcements-view">
      
      {/* Поисковая строка с фильтрами и категориями */}
      <div className="website-header-section">
        {/* Поисковая строка с фильтрами и категориями */}
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
                onClick={() => {
                  setShowFilters(!showFilters);
                  if (showCategories) {
                    setShowCategories(false);
                  }
                }}
              >
                <FunnelIcon className="website-filter-icon" />
              </button>
            </div>
            
            {/* Кнопка выбора категории - показывает выбранную категорию */}
            <button
              className="website-category-select-button"
              onClick={() => {
                setShowCategories(!showCategories);
                if (showFilters) {
                  setShowFilters(false);
                }
              }}
            >
              {(() => {
                // Сначала ищем основную категорию
                let selectedCategoryData = categories.find(cat => cat.key === selectedCategory);
                let displayName = selectedCategoryData?.name || categories[0].name;
                let IconComponent = selectedCategoryData?.icon || categories[0].icon;
                
                // Если не нашли основную категорию, ищем подкатегорию
                if (!selectedCategoryData) {
                  for (const [mainCategoryName, subcats] of Object.entries(subcategories)) {
                    const subcategory = subcats.find(sub => sub.key === selectedCategory);
                    if (subcategory) {
                      // Находим основную категорию для этой подкатегории
                      const mainCategory = categories.find(cat => cat.name === mainCategoryName);
                      if (mainCategory) {
                        selectedCategoryData = mainCategory;
                        displayName = subcategory.name; // Показываем название подкатегории
                        IconComponent = subcategory.icon;
                      }
                      break;
                    }
                  }
                }
                
                const IconComponentFinal = IconComponent as React.ComponentType<{ className?: string }>;
                
                return (
                  <>
                    <IconComponentFinal className="website-category-icon-hero" />
                    <span className="category-select-text">{displayName}</span>
                    <ChevronDownIcon 
                      className={`category-select-chevron ${showCategories ? 'expanded' : ''}`} 
                    />
                  </>
                );
              })()}
            </button>
            
            {/* Кнопка с количеством объявлений */}
            <button 
              className="website-category-count-button"
              onClick={() => handleCategoryClick(selectedCategory)}
            >
              <span className="category-count-text">
                {sortedListings.length} {t('home.listings')}
              </span>
            </button>
            
            <button 
              className={`website-sort-button ${selectedSort !== 'newest' ? 'active' : ''}`}
                              onClick={() => externalSetShowSortSheet?.(true)}
            >
              <ArrowDownIcon className="website-sort-icon" />
              <span className="website-sort-text">{currentSortOption?.title}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Выпадающие фильтры */}
      <WebsiteFilterView
        isOpen={showFilters}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onClose={() => {
          setShowFilters(false);
          setShowCategories(false);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Выпадающие категории */}
      <WebsiteCategoryView
        isOpen={showCategories}
        categories={categories}
        subcategories={subcategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onClose={() => {
          setShowCategories(false);
          setShowFilters(false);
        }}
        expandedCategory={expandedCategory}
        onCategoryExpand={setExpandedCategory}
      />

      {/* Виртуализированный список объявлений */}
      <div 
        className={`website-listings-grid ${(showCategories || showFilters) ? 'with-filters' : ''}`}
        style={{
          transition: 'top 0.3s ease, height 0.3s ease'
        }}
      >
        <ResponsiveListingsGrid
          listings={paginatedListings}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorite={isFavorite}
          onCardClick={handleCardClick}
          hasMore={false}
          onLoadMore={() => {}}
          isLoading={isLoading}
          hasFilters={hasActiveFilters}
          pagination={
            sortedListings.length > 0 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={sortedListings.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            ) : undefined
          }
        />
      </div>



      {/* Кнопка "Наверх" */}


      {/* Детальная карточка объявления */}
      {renderListingDetail()}
    </div>
  );
};

export default WebsiteAnnouncementsView; 