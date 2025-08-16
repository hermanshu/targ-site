import React, { useState, useMemo } from 'react';
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
  GiftIcon,
  EllipsisHorizontalIcon,
  Squares2X2Icon,
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  StarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import ListingCard from './ListingCard';
import FilterView, { FilterState } from './FilterView';
import MobileFilterSheet from './MobileFilterSheet';
import SortSheet from './SortSheet';
import { Listing } from '../types';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useIsMobile } from '../hooks/useIsMobile';

const AnnouncementsView: React.FC = () => {
  const { getPublishedListings } = useListings();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const initialListings = getPublishedListings();

  const categories = [
    { name: "Популярное", icon: "🔥", isEmoji: true },
    { name: "Мебель", icon: HomeIcon, isEmoji: false },
    { name: "Услуги", icon: WrenchScrewdriverIcon, isEmoji: false },
    { name: "Недвижимость", icon: BuildingOfficeIcon, isEmoji: false },
    { name: "Авто", icon: TruckIcon, isEmoji: false },
    { name: "Электроника", icon: DevicePhoneMobileIcon, isEmoji: false },
    { name: "Спорт", icon: TrophyIcon, isEmoji: false },
    { name: "Книги", icon: BookOpenIcon, isEmoji: false },
    { name: "Детям", icon: HeartIcon, isEmoji: false },
    { name: "Животные", icon: HeartIcon, isEmoji: false },
    { name: "Строительство и ремонт", icon: WrenchScrewdriverIcon, isEmoji: false },
    { name: "Бесплатно", icon: GiftIcon, isEmoji: false },
    { name: "Все категории", icon: Squares2X2Icon, isEmoji: false },
    { name: "Другое", icon: EllipsisHorizontalIcon, isEmoji: false }
  ];

  const sortOptions = [
    { id: 'newest', title: 'Сначала новые', icon: ClockIcon },
    { id: 'cheap', title: 'Сначала дешёвые', icon: ArrowDownIcon },
    { id: 'expensive', title: 'Сначала дорогие', icon: ArrowUpIcon },
    { id: 'popular', title: 'По популярности', icon: StarIcon },
    { id: 'withPhoto', title: 'Сначала с фото', icon: PhotoIcon }
  ];

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Популярное');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filterState, setFilterState] = useState<FilterState>({
    cityInput: '',
    selectedCategory: '',
    selectedCondition: 'any',
    onlyWithPhoto: false,
    selectedDelivery: 'any',
    selectedSeller: 'any',
    minPrice: '',
    maxPrice: ''
  });

  // Слушатель изменения размера окна
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Отладочная информация


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
    if (selectedCategory !== 'Популярное' && selectedCategory !== 'Все категории') {
      filtered = filtered.filter((listing: Listing) => {
        const matchesCategory = listing.category === selectedCategory;
        const matchesSubcategory = listing.subcategory === selectedCategory;
        return matchesCategory || matchesSubcategory;
      });
    }

    // Фильтры
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

    if (filterState.onlyWithPhoto) {
      filtered = filtered.filter((listing: Listing) => listing.imageName !== '');
    }

    if (filterState.selectedSeller !== 'any') {
      filtered = filtered.filter((listing: Listing) => 
        (filterState.selectedSeller === 'company' && listing.isCompany) ||
        (filterState.selectedSeller === 'private' && !listing.isCompany)
      );
    }

    return filtered;
  }, [searchText, selectedCategory, filterState, initialListings]);

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

  const handleFavoriteToggle = (listing: Listing) => {
    setFavorites(prev => 
      prev.includes(listing.id) 
        ? prev.filter(id => id !== listing.id)
        : [...prev, listing.id]
    );
  };

  const handleCardClick = (listing: Listing) => {
    // Навигация к деталям объявления будет реализована позже
    console.log('Открыть детали объявления:', listing.title);
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
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

  const currentSortOption = sortOptions.find(option => option.id === selectedSort);
  const SortIcon = currentSortOption?.icon || ClockIcon;

  const isFilterActive = Object.values(filterState).some(value => 
    value !== '' && value !== 'any' && value !== false
  );

  return (
    <div className="announcements-view">
      {/* Поисковая строка с фильтрами */}
      <div className="search-section">
        <div className="search-bar-with-filters">
          <div className="search-input-group">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder={t('favorites.searchListings')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
            <button 
              className={`filter-toggle-button ${isFilterActive || showFilters ? 'active' : ''}`}
              onClick={() => {
                setShowFilters(!showFilters);
              }}
            >
              <FunnelIcon className="filter-icon" />
            </button>
          </div>
          
          <button 
            className="sort-button"
            onClick={() => setShowSortSheet(true)}
          >
            <SortIcon className="sort-icon" />
            <span className="sort-text">{currentSortOption?.title}</span>
          </button>
        </div>
      </div>

      {/* Категории */}
      <div className="categories-section">
        <div className="categories-scroll">
          {categories.map((category) => {
            if (category.isEmoji) {
              return (
                <button
                  key={category.name}
                  className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="category-emoji">{category.icon as string}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              );
            } else {
              const IconComponent = category.icon as React.ComponentType<{ className?: string }>;
              return (
                <button
                  key={category.name}
                  className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <IconComponent className="category-icon-hero" />
                  <span className="category-name">{category.name}</span>
                </button>
              );
            }
          })}
        </div>
      </div>

      {/* Список объявлений */}
      <div className="listings-grid">
        {sortedListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={favorites.includes(listing.id)}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Модальные окна */}
      {/* Мобильный фильтр */}
      {(() => {
        const isMobileDevice = windowWidth <= 767;
        const mobileFilterIsOpen = showFilters && isMobileDevice;

        
        return (
          <MobileFilterSheet
            isOpen={showFilters} // Принудительно показываем на всех устройствах
            onClose={() => setShowFilters(false)}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        );
      })()}

      {/* Десктопный фильтр */}
      <FilterView
        isOpen={false} // Принудительно скрываем десктопный фильтр
        onClose={() => setShowFilters(false)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Отладочная информация */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          isMobile: {isMobile ? 'true' : 'false'}<br/>
          showFilters: {showFilters ? 'true' : 'false'}<br/>
          window.innerWidth: {window.innerWidth}
        </div>
      )}

      <SortSheet
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort={selectedSort}
        onSortSelect={setSelectedSort}
      />
    </div>
  );
};

export default AnnouncementsView; 