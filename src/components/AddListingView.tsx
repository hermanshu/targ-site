import React, { useState, useRef } from 'react';
import { 
  ArrowLeftIcon,
  CameraIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';


// Кастомный компонент выпадающего списка
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; emoji?: string }[];
  placeholder: string;
  error?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  error = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-button ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-text">
          {selectedOption ? (
            <>
              {selectedOption.emoji && <span className="custom-select-emoji">{selectedOption.emoji}</span>}
              {selectedOption.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="custom-select-chevron" />
        ) : (
          <ChevronDownIcon className="custom-select-chevron" />
        )}
      </button>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-option ${option.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.emoji && <span className="custom-select-emoji">{option.emoji}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'EUR' | 'RSD';
  category: string;
  subcategory: string;
  location: string;
  images: File[];
  contactMethod: 'phone' | 'chat';
  delivery?: 'pickup' | 'delivery';
  characteristics: Record<string, string>;
}

const AddListingView: React.FC = () => {
  const { currentUser } = useAuth();
  const { addListing } = useListings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Константы
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MIN_DESCRIPTION_LENGTH = 20;
  const MAX_DESCRIPTION_LENGTH = 2000;
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    category: '',
    subcategory: '',
    location: '',
    images: [],
    contactMethod: 'chat',
    characteristics: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'electronics', label: t('home.electronics'), emoji: '📱', hasSubcategories: true },
    { value: 'home', label: t('home.homeAndGarden'), emoji: '🏠', hasSubcategories: true },
    { value: 'fashion', label: t('home.fashion'), emoji: '👕' },
    { value: 'services', label: t('home.services'), emoji: '🔧' },
    { value: 'work', label: t('home.work'), emoji: '💼' },
    { value: 'real-estate', label: t('home.realEstate'), emoji: '🏢' },
    { value: 'plants', label: t('home.plants'), emoji: '☀️' },
    { value: 'transport', label: t('home.transport'), emoji: '🚗' },
    { value: 'sport', label: t('home.sport'), emoji: '⚽' },
    { value: 'books', label: t('home.books'), emoji: '📚' },
    { value: 'kids', label: t('home.kids'), emoji: '🎓' },
    { value: 'furniture', label: t('home.furniture'), emoji: '🪑' },
    { value: 'hobby', label: t('home.hobby'), emoji: '🎨' },
    { value: 'animals', label: t('home.animals'), emoji: '🐾' },
    { value: 'construction', label: t('home.construction'), emoji: '🔨' },
    { value: 'free', label: t('home.free'), emoji: '🎁' },
    { value: 'other', label: t('home.other'), emoji: '📦' }
  ];

  const cities = [
    "Белград", "Нови Сад", "Ниш", "Крагуевац", "Суботица",
    "Зренянин", "Панчево", "Чачак", "Кралево", "Нови Пазар",
    "Крушевац", "Ужице", "Вране", "Шабац", "Сомбор",
    "Пожаревац", "Смедерево", "Лесковац", "Валево", "Кикинда",
    "Вршац", "Бор", "Прокупле", "Сремска Митровица", "Ягодина",
    "Лозница", "Приеполе", "Пирот", "Златибор", "Копаоник"
  ];

  const subcategories = {
    work: [
      { value: 'vacancies', label: t('home.vacancies'), emoji: '👥' },
      { value: 'resume', label: t('home.resume'), emoji: '💼' }
    ],
    'real-estate': [
      { value: 'rent', label: t('home.rent'), emoji: '🏠' },
      { value: 'sale', label: t('home.sale'), emoji: '🏢' }
    ],
    electronics: [
      { value: 'smartphones', label: 'Смартфоны / планшеты', emoji: '📱' },
      { value: 'computers', label: 'Ноутбуки / ПК', emoji: '💻' },
      { value: 'audio', label: 'Аудио / аксессуары', emoji: '🎧' },
      { value: 'tv', label: 'ТВ / мониторы', emoji: '📺' },
      { value: 'gaming', label: 'Консоли / игры', emoji: '🕹' },
      { value: 'other-electronics', label: 'Другая электроника', emoji: '📦' }
    ],
    home: [
      { value: 'home-goods', label: 'Товары для дома', emoji: '🧹' },
      { value: 'tools', label: 'Инструменты', emoji: '⚒' },
      { value: 'garden', label: 'Садовая техника и инвентарь', emoji: '🌿' },
      { value: 'other-home', label: 'Что-то другое', emoji: '📦' }
    ]
  };

  // Типы для характеристик
  type CharacteristicField = {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options?: string[];
  };

  // Характеристики для каждой категории и подкатегории
  const categoryCharacteristics: Record<string, CharacteristicField[]> = {
    // Общие характеристики для всей электроники
    electronics: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' }
    ],

    // Смартфоны / планшеты
    smartphones: [
      // Общие характеристики
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' },
      
      // Специфичные для смартфонов
      { key: 'os', label: t('listings.characteristicOS'), type: 'select', options: [t('listings.osIOS'), t('listings.osAndroid'), t('listings.osHarmonyOS')] },
      { key: 'screenDiagonal', label: t('listings.characteristicScreenDiagonal'), type: 'text' },
      { key: 'memory', label: t('listings.characteristicMemory'), type: 'text' },
      { key: 'ram', label: t('listings.characteristicRAM'), type: 'text' },
      { key: 'sim', label: t('listings.characteristicSIM'), type: 'select', options: [t('listings.simNano'), t('listings.simESIM'), t('listings.simDual')] },
      { key: 'network', label: t('listings.characteristicNetwork'), type: 'select', options: [t('listings.network4G'), t('listings.network5G')] },
      { key: 'camera', label: t('listings.characteristicCamera'), type: 'text' },
      { key: 'cameraModules', label: t('listings.characteristicCameraModules'), type: 'text' },
      { key: 'battery', label: t('listings.characteristicBattery'), type: 'text' },
      { key: 'screenCondition', label: t('listings.characteristicScreenCondition'), type: 'select', options: [t('listings.screenConditionPerfect'), t('listings.screenConditionScratches'), t('listings.screenConditionChips')] }
    ],

    // Ноутбуки / ПК
    computers: [
      // Общие характеристики
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' },
      
      // Специфичные для компьютеров
      { key: 'processor', label: t('listings.characteristicProcessor'), type: 'text' },
      { key: 'ram', label: t('listings.characteristicRAM'), type: 'text' },
      { key: 'storage', label: t('listings.characteristicStorage'), type: 'select', options: [t('listings.storageHDD'), t('listings.storageSSD')] },
      { key: 'graphics', label: t('listings.characteristicGraphics'), type: 'select', options: [t('listings.graphicsIntegrated'), t('listings.graphicsDiscrete')] },
      { key: 'screenDiagonal', label: t('listings.characteristicScreenDiagonal'), type: 'text' },
      { key: 'os', label: t('listings.characteristicOS'), type: 'select', options: [t('listings.osWindows'), t('listings.osMacOS'), t('listings.osLinux'), t('listings.osNone')] },
      { key: 'batteryLife', label: t('listings.characteristicBatteryLife'), type: 'text' }
    ],

    // Аудио / аксессуары
    audio: [
      // Общие характеристики
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' },
      
      // Специфичные для аудио
      { key: 'deviceType', label: t('listings.characteristicDeviceType'), type: 'text' },
      { key: 'connection', label: t('listings.characteristicConnection'), type: 'select', options: [t('listings.connectionWired'), t('listings.connectionBluetooth'), t('listings.connectionWiFi')] },
      { key: 'compatibility', label: t('listings.characteristicCompatibility'), type: 'select', options: [t('listings.compatibilityIOS'), t('listings.compatibilityAndroid'), t('listings.compatibilityUniversal')] },
      { key: 'batteryHealth', label: t('listings.characteristicBatteryHealth'), type: 'text' }
    ],

    // ТВ / мониторы
    tv: [
      // Общие характеристики
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' },
      
      // Специфичные для ТВ/мониторов
      { key: 'screenDiagonal', label: t('listings.characteristicScreenDiagonal'), type: 'text' },
      { key: 'resolution', label: t('listings.characteristicResolution'), type: 'select', options: [t('listings.resolutionHD'), t('listings.resolutionFullHD'), t('listings.resolution4K'), t('listings.resolution8K')] },
      { key: 'smartTV', label: t('listings.characteristicSmartTV'), type: 'select', options: [t('listings.smartTVYes'), t('listings.smartTVNo')] },
      { key: 'matrix', label: t('listings.characteristicMatrix'), type: 'select', options: [t('listings.matrixOLED'), t('listings.matrixQLED'), t('listings.matrixIPS'), t('listings.matrixVA')] },
      { key: 'ports', label: t('listings.characteristicPorts'), type: 'text' }
    ],

    // Консоли / игры
    gaming: [
      // Общие характеристики
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' },
      
      // Специфичные для игр
      { key: 'consoleType', label: t('listings.characteristicConsoleType'), type: 'select', options: [t('listings.consolePlayStation'), t('listings.consoleXbox'), t('listings.consoleNintendo'), t('listings.consolePortable')] },
      { key: 'memory', label: t('listings.characteristicMemory'), type: 'text' },
      { key: 'games', label: t('listings.characteristicGames'), type: 'text' },
      { key: 'controllers', label: t('listings.characteristicControllers'), type: 'text' }
    ],

    // Другая электроника
    'other-electronics': [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'warranty', label: t('listings.characteristicWarranty'), type: 'select', options: [t('listings.warrantyYes'), t('listings.warrantyNo'), t('listings.warrantyPeriod')] },
      { key: 'year', label: t('listings.characteristicYear'), type: 'text' },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' },
      { key: 'completeness', label: t('listings.characteristicCompleteness'), type: 'text' }
    ],
    // Общие характеристики для дома и сада
    home: [
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'dimensions', label: t('listings.characteristicDimensions'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' }
    ],



    // Товары для дома
    'home-goods': [
      // Общие характеристики
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      
      // Специфичные для товаров для дома
      { key: 'homeType', label: t('listings.characteristicHomeType'), type: 'text' },
      { key: 'power', label: t('listings.characteristicPower'), type: 'text' },
      { key: 'volume', label: t('listings.characteristicVolume'), type: 'text' }
    ],

    // Инструменты
    tools: [
      // Общие характеристики
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      
      // Специфичные для инструментов
      { key: 'toolType', label: t('listings.characteristicToolType'), type: 'text' },
      { key: 'powerSource', label: t('listings.characteristicPowerSource'), type: 'text' },
      { key: 'power', label: t('listings.characteristicPower'), type: 'text' },
      { key: 'batteryCapacity', label: t('listings.characteristicBatteryCapacity'), type: 'text' }
    ],

    // Садовая техника и инвентарь
    garden: [
      // Общие характеристики
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      
      // Специфичные для садовой техники
      { key: 'gardenType', label: t('listings.characteristicGardenType'), type: 'text' },
      { key: 'fuel', label: t('listings.characteristicFuel'), type: 'text' },
      { key: 'enginePower', label: t('listings.characteristicEnginePower'), type: 'text' },
      { key: 'workingWidth', label: t('listings.characteristicWorkingWidth'), type: 'text' },
      { key: 'workingDepth', label: t('listings.characteristicWorkingDepth'), type: 'text' }
    ],

    // Что-то другое (общие характеристики)
    'other-home': [
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'dimensions', label: t('listings.characteristicDimensions'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' }
    ],
    fashion: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'size', label: t('listings.characteristicSize'), type: 'text' },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'color', label: t('listings.characteristicColor'), type: 'text' }
    ],
    services: [
      { key: 'serviceType', label: t('listings.characteristicServiceType'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'location', label: t('listings.location'), type: 'text' },
      { key: 'schedule', label: t('listings.characteristicSchedule'), type: 'text' }
    ],
    plants: [
      { key: 'plantType', label: t('listings.characteristicPlantType'), type: 'text' },
      { key: 'age', label: t('listings.characteristicAge'), type: 'text' },
      { key: 'height', label: t('listings.characteristicHeight'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionExcellent'), t('listings.conditionGood'), t('listings.conditionFair')] }
    ],
    
    // Общие характеристики для недвижимости (когда выбрана только категория без подкатегории)
    'real-estate': [
      { key: 'propertyType', label: t('listings.characteristicPropertyType'), type: 'select', options: [t('listings.propertyTypeApartment'), t('listings.propertyTypeHouse'), t('listings.propertyTypeRoom'), t('listings.propertyTypeCommercial'), t('listings.propertyTypeLand')] },
      { key: 'areaTotal', label: t('listings.characteristicAreaTotal'), type: 'number' },
      { key: 'areaLiving', label: t('listings.characteristicAreaLiving'), type: 'number' },
      { key: 'rooms', label: t('listings.characteristicRooms'), type: 'number' },
      { key: 'floor', label: t('listings.characteristicFloor'), type: 'number' },
      { key: 'floorsTotal', label: t('listings.characteristicFloorsTotal'), type: 'number' },
      { key: 'layout', label: t('listings.characteristicLayout'), type: 'select', options: [t('listings.layoutStudio'), t('listings.layoutSeparate'), t('listings.layoutOpen')] },
      { key: 'renovation', label: t('listings.characteristicRenovation'), type: 'select', options: [t('listings.renovationNone'), t('listings.renovationRough'), t('listings.renovationCosmetic'), t('listings.renovationDesign')] },
      { key: 'furniture', label: t('listings.characteristicFurniture'), type: 'select', options: [t('listings.furnitureYes'), t('listings.furnitureNo')] },
      { key: 'balcony', label: t('listings.characteristicBalcony'), type: 'select', options: [t('listings.balconyYes'), t('listings.balconyNo')] },
      { key: 'parking', label: t('listings.characteristicParking'), type: 'select', options: [t('listings.parkingYes'), t('listings.parkingNo'), t('listings.parkingGarage'), t('listings.parkingYard'), t('listings.parkingUnderground')] },
      { key: 'heating', label: t('listings.characteristicHeating'), type: 'select', options: [t('listings.heatingCentral'), t('listings.heatingAutonomous'), t('listings.heatingElectric'), t('listings.heatingNone')] },
      { key: 'utilities', label: t('listings.characteristicUtilities'), type: 'select', options: [t('listings.utilitiesIncluded'), t('listings.utilitiesSeparate')] }
    ],
    // Подкатегории для работы
    vacancies: [
      { key: 'position', label: t('listings.characteristicPosition'), type: 'text' },
      { key: 'salary', label: t('listings.characteristicSalary'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'schedule', label: t('listings.characteristicSchedule'), type: 'text' },
      { key: 'location', label: t('listings.location'), type: 'text' }
    ],
    resume: [
      { key: 'position', label: t('listings.characteristicPosition'), type: 'text' },
      { key: 'experience', label: t('listings.characteristicExperience'), type: 'text' },
      { key: 'education', label: t('listings.characteristicEducation'), type: 'text' },
      { key: 'skills', label: t('listings.characteristicSkills'), type: 'text' }
    ],
    // Подкатегории для недвижимости - Аренда
    rent: [
      // Общие характеристики недвижимости
      { key: 'propertyType', label: t('listings.characteristicPropertyType'), type: 'select', options: [t('listings.propertyTypeApartment'), t('listings.propertyTypeHouse'), t('listings.propertyTypeRoom'), t('listings.propertyTypeCommercial'), t('listings.propertyTypeLand')] },
      { key: 'areaTotal', label: t('listings.characteristicAreaTotal'), type: 'number' },
      { key: 'areaLiving', label: t('listings.characteristicAreaLiving'), type: 'number' },
      { key: 'rooms', label: t('listings.characteristicRooms'), type: 'number' },
      { key: 'floor', label: t('listings.characteristicFloor'), type: 'number' },
      { key: 'floorsTotal', label: t('listings.characteristicFloorsTotal'), type: 'number' },
      { key: 'layout', label: t('listings.characteristicLayout'), type: 'select', options: [t('listings.layoutStudio'), t('listings.layoutSeparate'), t('listings.layoutOpen')] },
      { key: 'renovation', label: t('listings.characteristicRenovation'), type: 'select', options: [t('listings.renovationNone'), t('listings.renovationRough'), t('listings.renovationCosmetic'), t('listings.renovationDesign')] },
      { key: 'furniture', label: t('listings.characteristicFurniture'), type: 'select', options: [t('listings.furnitureYes'), t('listings.furnitureNo')] },
      { key: 'balcony', label: t('listings.characteristicBalcony'), type: 'select', options: [t('listings.balconyYes'), t('listings.balconyNo')] },
      { key: 'parking', label: t('listings.characteristicParking'), type: 'select', options: [t('listings.parkingYes'), t('listings.parkingNo'), t('listings.parkingGarage'), t('listings.parkingYard'), t('listings.parkingUnderground')] },
      { key: 'heating', label: t('listings.characteristicHeating'), type: 'select', options: [t('listings.heatingCentral'), t('listings.heatingAutonomous'), t('listings.heatingElectric'), t('listings.heatingNone')] },
      { key: 'utilities', label: t('listings.characteristicUtilities'), type: 'select', options: [t('listings.utilitiesIncluded'), t('listings.utilitiesSeparate')] },
      
      // Характеристики для аренды
      { key: 'rentPeriod', label: t('listings.characteristicRentPeriod'), type: 'select', options: [t('listings.rentPeriodDaily'), t('listings.rentPeriodMonthly'), t('listings.rentPeriodLongTerm')] },
      { key: 'deposit', label: t('listings.characteristicDeposit'), type: 'select', options: [t('listings.depositYes'), t('listings.depositNo'), t('listings.depositMonth'), t('listings.depositHalf'), t('listings.depositCustom')] },
      { key: 'minRentPeriod', label: t('listings.characteristicMinRentPeriod'), type: 'text' },
      { key: 'payment', label: t('listings.characteristicPayment'), type: 'select', options: [t('listings.paymentAdvance'), t('listings.paymentMonthly'), t('listings.paymentContract')] },
      { key: 'pets', label: t('listings.characteristicPets'), type: 'select', options: [t('listings.petsYes'), t('listings.petsNo')] },
      { key: 'children', label: t('listings.characteristicChildren'), type: 'select', options: [t('listings.childrenYes'), t('listings.childrenNo')] },
      { key: 'smoking', label: t('listings.characteristicSmoking'), type: 'select', options: [t('listings.smokingYes'), t('listings.smokingNo')] },
      { key: 'internet', label: t('listings.characteristicInternet'), type: 'select', options: [t('listings.internetYes'), t('listings.internetNo'), t('listings.internetWiFi'), t('listings.internetCable')] },
      { key: 'neighbors', label: t('listings.characteristicNeighbors'), type: 'select', options: [t('listings.neighborsSeparate'), t('listings.neighborsCommunal')] }
    ],
    
    // Подкатегории для недвижимости - Продажа
    sale: [
      // Общие характеристики недвижимости
      { key: 'propertyType', label: t('listings.characteristicPropertyType'), type: 'select', options: [t('listings.propertyTypeApartment'), t('listings.propertyTypeHouse'), t('listings.propertyTypeRoom'), t('listings.propertyTypeCommercial'), t('listings.propertyTypeLand')] },
      { key: 'areaTotal', label: t('listings.characteristicAreaTotal'), type: 'number' },
      { key: 'areaLiving', label: t('listings.characteristicAreaLiving'), type: 'number' },
      { key: 'rooms', label: t('listings.characteristicRooms'), type: 'number' },
      { key: 'floor', label: t('listings.characteristicFloor'), type: 'number' },
      { key: 'floorsTotal', label: t('listings.characteristicFloorsTotal'), type: 'number' },
      { key: 'layout', label: t('listings.characteristicLayout'), type: 'select', options: [t('listings.layoutStudio'), t('listings.layoutSeparate'), t('listings.layoutOpen')] },
      { key: 'renovation', label: t('listings.characteristicRenovation'), type: 'select', options: [t('listings.renovationNone'), t('listings.renovationRough'), t('listings.renovationCosmetic'), t('listings.renovationDesign')] },
      { key: 'furniture', label: t('listings.characteristicFurniture'), type: 'select', options: [t('listings.furnitureYes'), t('listings.furnitureNo')] },
      { key: 'balcony', label: t('listings.characteristicBalcony'), type: 'select', options: [t('listings.balconyYes'), t('listings.balconyNo')] },
      { key: 'parking', label: t('listings.characteristicParking'), type: 'select', options: [t('listings.parkingYes'), t('listings.parkingNo'), t('listings.parkingGarage'), t('listings.parkingYard'), t('listings.parkingUnderground')] },
      { key: 'heating', label: t('listings.characteristicHeating'), type: 'select', options: [t('listings.heatingCentral'), t('listings.heatingAutonomous'), t('listings.heatingElectric'), t('listings.heatingNone')] },
      { key: 'utilities', label: t('listings.characteristicUtilities'), type: 'select', options: [t('listings.utilitiesIncluded'), t('listings.utilitiesSeparate')] },
      
      // Характеристики для продажи
      { key: 'ownership', label: t('listings.characteristicOwnership'), type: 'select', options: [t('listings.ownershipPrivate'), t('listings.ownershipShared'), t('listings.ownershipMunicipal')] },
      { key: 'documents', label: t('listings.characteristicDocuments'), type: 'select', options: [t('listings.documentsOwnership'), t('listings.documentsMortgage'), t('listings.documentsPowerOfAttorney')] },
      { key: 'mortgage', label: t('listings.characteristicMortgage'), type: 'select', options: [t('listings.mortgageYes'), t('listings.mortgageNo')] },
      { key: 'encumbrances', label: t('listings.characteristicEncumbrances'), type: 'select', options: [t('listings.encumbrancesYes'), t('listings.encumbrancesNo')] },
      { key: 'constructionYear', label: t('listings.characteristicConstructionYear'), type: 'number' },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'landPurpose', label: t('listings.characteristicLandPurpose'), type: 'select', options: [t('listings.landPurposeIZHS'), t('listings.landPurposeSNT'), t('listings.landPurposeCommercial')] },
      { key: 'replanning', label: t('listings.characteristicReplanning'), type: 'select', options: [t('listings.replanningYes'), t('listings.replanningNo')] }
    ],
    // Подкатегории для других категорий
    transport: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'model', label: t('listings.characteristicModel'), type: 'text' },
      { key: 'year', label: t('listings.characteristicYear'), type: 'number' },
      { key: 'mileage', label: t('listings.characteristicMileage'), type: 'number' },
      { key: 'fuelType', label: t('listings.characteristicFuelType'), type: 'select', options: [t('listings.fuelTypePetrol'), t('listings.fuelTypeDiesel'), t('listings.fuelTypeElectric'), t('listings.fuelTypeHybrid')] },
      { key: 'transmission', label: t('listings.characteristicTransmission'), type: 'select', options: [t('listings.transmissionManual'), t('listings.transmissionAutomatic'), t('listings.transmissionRobot'), t('listings.transmissionCVT')] }
    ],
    sport: [
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'size', label: t('listings.characteristicSize'), type: 'text' },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ],
    books: [
      { key: 'author', label: t('listings.characteristicAuthor'), type: 'text' },
      { key: 'publisher', label: t('listings.characteristicPublisher'), type: 'text' },
      { key: 'year', label: t('listings.characteristicYear'), type: 'number' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionExcellent'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'language', label: t('listings.characteristicLanguage'), type: 'text' }
    ],
    kids: [
      { key: 'ageGroup', label: t('listings.characteristicAgeGroup'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ],
    furniture: [
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionAfterRepair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' },
      { key: 'dimensions', label: t('listings.characteristicDimensions'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'style', label: t('listings.characteristicStyle'), type: 'text' },
      
      // Специфичные для мебели
      { key: 'furnitureType', label: t('listings.characteristicFurnitureType'), type: 'text' },
      { key: 'finish', label: t('listings.characteristicFinish'), type: 'text' }
    ],
    hobby: [
      { key: 'hobbyType', label: t('listings.characteristicHobbyType'), type: 'text' },
      { key: 'brand', label: t('listings.characteristicBrand'), type: 'text' },
      { key: 'condition', label: t('listings.characteristicCondition'), type: 'select', options: [t('listings.conditionNew'), t('listings.conditionLikeNew'), t('listings.conditionGood'), t('listings.conditionFair')] },
      { key: 'material', label: t('listings.characteristicMaterial'), type: 'text' }
    ]
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Проверяем, если пользователь пытается выбрать телефон, но у него нет номера
    if (field === 'contactMethod' && value === 'phone' && currentUser && !currentUser.phone) {
      // Автоматически переключаем на чат
      setFormData(prev => ({ ...prev, [field]: 'chat' }));
      alert(t('listings.fillPhoneInProfile'));
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCharacteristicChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: value
      }
    }));
    // Очищаем ошибку при изменении характеристики
    if (errors[`characteristic_${key}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`characteristic_${key}`];
        return newErrors;
      });
    }
  };

  const clearCharacteristicErrors = () => {
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('characteristic_')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ 
      ...prev, 
      category,
      subcategory: '',
      characteristics: {}, // Сбрасываем характеристики при смене категории
      ...((category === 'work' || category === 'real-estate') && { delivery: undefined }) // Убираем доставку для категорий "Работа" и "Недвижимость"
    }));
    // Очищаем ошибки характеристик
    clearCharacteristicErrors();
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({ 
      ...prev, 
      subcategory,
      characteristics: {} // Сбрасываем характеристики при смене подкатегории
    }));
    // Очищаем ошибки характеристик
    clearCharacteristicErrors();
  };

  const handleImagesChange = (images: File[]) => {
    setFormData(prev => ({ ...prev, images }));
    // Очищаем ошибку при изменении поля
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isValidSize = file.size <= MAX_FILE_SIZE; // 5MB
      
      if (!isValidType) {
        alert(t('profile.fileTypeError'));
        return false;
      }
      
      if (!isValidSize) {
        alert(t('profile.fileSizeLimit'));
        return false;
      }
      
      return true;
    });

    if (formData.images.length + validFiles.length > MAX_IMAGES) {
      alert(t('listings.maxPhotoCount'));
      return;
    }

    const newImages = [...formData.images, ...validFiles];
    handleImagesChange(newImages);

    // Создаем превью для новых изображений
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.onerror = () => {
        console.error('Ошибка при чтении файла:', file.name);
        alert(t('profile.fileReadError') || 'Ошибка при чтении файла');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    handleImagesChange(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('listings.enterTitle');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('listings.enterDescription');
    } else if (formData.description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = t('validation.minLength') + ' ' + MIN_DESCRIPTION_LENGTH;
    }

    if (!formData.price.trim()) {
      newErrors.price = t('listings.enterPrice');
    }

    if (!formData.category) {
      newErrors.category = t('validation.selectCategory');
    }

    // Проверяем подкатегорию, если она требуется
    if (formData.category && subcategories[formData.category as keyof typeof subcategories] && !formData.subcategory) {
      newErrors.subcategory = t('validation.selectSubcategory');
    }

    if (!formData.location.trim()) {
      newErrors.location = t('validation.enterLocation');
    }

    if (!formData.contactMethod) {
      newErrors.contactMethod = t('validation.selectContactMethod');
    } else if (formData.contactMethod === 'phone' && currentUser && !currentUser.phone) {
      newErrors.contactMethod = t('listings.fillPhoneInProfile');
    }

    // Проверяем поле доставки для категорий, где оно обязательно
    if (formData.category !== 'work' && formData.category !== 'real-estate' && !formData.delivery) {
      newErrors.delivery = t('validation.selectDeliveryMethod') || 'Выберите способ доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Создаем новое объявление
      const newListing: any = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        category: formData.subcategory || formData.category, // Используем подкатегорию, если она есть
        city: formData.location,
        sellerName: currentUser?.name || currentUser?.email || 'Пользователь',
        isCompany: currentUser?.isCompany || false,
        imageName: formData.images.length > 0 ? 'user-upload' : '',
        userId: currentUser?.id || 'anonymous',
        characteristics: formData.characteristics,
        contactMethod: formData.contactMethod
      };

      // Добавляем поле доставки только для категорий, где это логично
      if (formData.category !== 'work' && formData.category !== 'real-estate') {
        newListing.delivery = formData.delivery;
      }

      // Добавляем объявление в контекст
      addListing(newListing);
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Показываем модальное окно успеха
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
      alert(t('listings.errorCreatingListing'));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="add-listing-container">
      
      {/* Заголовок */}
      <div className="add-listing-header">
        <button 
          onClick={() => window.history.back()}
          className="back-button"
        >
          <ArrowLeftIcon className="back-icon" />
          <span>{t('common.back')}</span>
        </button>
        <h1 className="add-listing-title">{t('listings.createListing')}</h1>
        <div style={{ width: '80px' }}></div> {/* Для центрирования заголовка */}
      </div>

      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* Загрузка изображений */}
        <div className="form-section">
          <label className="form-label">
            <PhotoIcon className="label-icon" />
            {t('listings.photosRequired')}
          </label>
          <div className="image-upload-area">
            <div className="image-grid">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`${t('favorites.previewImage')} ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-button"
                  >
                    <XMarkIcon className="remove-icon" />
                  </button>
                </div>
              ))}
              
              {formData.images.length < MAX_IMAGES && (
                <div 
                  className="image-upload-placeholder"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraIcon className="upload-icon" />
                  <span>{t('listings.addPhotoText')}</span>
                  <small>{String(formData.images.length)}/{MAX_IMAGES}</small>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            

            
            <div className="upload-hint">
              <p>{t('listings.photoOptionalNote')}</p>
              <p>{t('listings.maxPhotoCount')}</p>
              <p>{t('listings.maxFileSizeNote')}</p>
              <p>{t('listings.supportedFormatsNote')}</p>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="form-section">
          <label className="form-label">
            <DocumentTextIcon className="label-icon" />
                          {t('listings.title')} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder={t('listings.title')}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && (
            <div className="error-message">{errors.title}</div>
          )}
        </div>

        <div className="form-section">
                      <label className="form-label">
              <DocumentTextIcon className="label-icon" />
              {t('listings.description')} *
            </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={t('listings.description')}
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            rows={6}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
          <div className="char-counter">
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </div>
        </div>

        {/* Цена, валюта и категория */}
        <div className="form-row">
          <div className="form-section">
            <label className="form-label">
              <CurrencyDollarIcon className="label-icon" />
              {formData.category === 'work' || formData.subcategory === 'vacancies' ? 'Зарплата в месяц' : 
               formData.subcategory === 'rent' ? 'Стоимость в месяц' : 
               t('listings.price')} *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">
              <CurrencyDollarIcon className="label-icon" />
              {t('listings.currency')}
            </label>
            <CustomSelect
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value as 'EUR' | 'RSD')}
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'RSD', label: 'RSD' }
              ]}
              placeholder="Выберите валюту"
              className="currency-select"
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              <TagIcon className="label-icon" />
              {t('listings.category')} *
            </label>
            <CustomSelect
              value={formData.category}
              onChange={handleCategoryChange}
              options={[{ value: '', label: t('listings.selectCategory') }, ...categories]}
              placeholder={t('listings.selectCategory')}
              error={!!errors.category}
            />
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
        </div>

        {/* Подкатегории */}
        {formData.category && subcategories[formData.category as keyof typeof subcategories] && (
          <div className="form-section">
            <label className="form-label">
              <TagIcon className="label-icon" />
              {t('listings.subcategory')} *
            </label>
            <CustomSelect
              value={formData.subcategory}
              onChange={handleSubcategoryChange}
              options={[{ value: '', label: t('validation.selectSubcategory') }, ...(subcategories[formData.category as keyof typeof subcategories] || [])]}
              placeholder={t('validation.selectSubcategory')}
              error={!!errors.subcategory}
            />
            {errors.subcategory && (
              <div className="error-message">{errors.subcategory}</div>
            )}
          </div>
        )}

        {/* Характеристики */}
        {(formData.category && categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]) ||
         (formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]) ? (
          <div className="form-section">
            <label className="form-label">
              <DocumentTextIcon className="label-icon" />
              {t('listings.characteristics')}
            </label>
            
            {/* Группировка характеристик для недвижимости */}
            {(formData.category === 'real-estate' || formData.subcategory === 'rent' || formData.subcategory === 'sale') ? (
              <div className="characteristics-grouped">
                {/* Основные характеристики */}
                <div className="characteristics-group">
                  <h4 className="characteristics-group-title">🏠 Основные характеристики</h4>
                  <div className="characteristics-grid">
                    {(formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics] 
                      ? categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]
                      : categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]
                    ).filter(char => ['propertyType', 'areaTotal', 'areaLiving', 'rooms', 'floor', 'floorsTotal', 'layout', 'renovation'].includes(char.key)).map(char => (
                      <div key={char.key} className="characteristic-field">
                        <label className="characteristic-label">{char.label}</label>
                        {char.type === 'select' ? (
                          <select
                            value={formData.characteristics[char.key] || ''}
                            onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                            className="characteristic-select"
                          >
                            <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                            {char.options?.map((option: string) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={char.type}
                            value={formData.characteristics[char.key] || ''}
                            onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                            placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                            className="characteristic-input"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Комфорт и удобства */}
                <div className="characteristics-group">
                  <h4 className="characteristics-group-title">✨ Комфорт и удобства</h4>
                  <div className="characteristics-grid">
                    {(formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics] 
                      ? categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]
                      : categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]
                    ).filter(char => ['furniture', 'balcony', 'parking', 'heating', 'utilities'].includes(char.key)).map(char => (
                      <div key={char.key} className="characteristic-field">
                        <label className="characteristic-label">{char.label}</label>
                        {char.type === 'select' ? (
                          <select
                            value={formData.characteristics[char.key] || ''}
                            onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                            className="characteristic-select"
                          >
                            <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                            {char.options?.map((option: string) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={char.type}
                            value={formData.characteristics[char.key] || ''}
                            onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                            placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                            className="characteristic-input"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Специфичные характеристики для аренды */}
                {formData.subcategory === 'rent' && (
                  <div className="characteristics-group">
                    <h4 className="characteristics-group-title">🔑 Условия аренды</h4>
                    <div className="characteristics-grid">
                      {categoryCharacteristics.rent.filter(char => ['rentPeriod', 'deposit', 'minRentPeriod', 'payment', 'pets', 'children', 'smoking', 'internet', 'neighbors'].includes(char.key)).map(char => (
                        <div key={char.key} className="characteristic-field">
                          <label className="characteristic-label">{char.label}</label>
                          {char.type === 'select' ? (
                            <select
                              value={formData.characteristics[char.key] || ''}
                              onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                              className="characteristic-select"
                            >
                              <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                              {char.options?.map((option: string) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={char.type}
                              value={formData.characteristics[char.key] || ''}
                              onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                              placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                              className="characteristic-input"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Специфичные характеристики для продажи */}
                {formData.subcategory === 'sale' && (
                  <div className="characteristics-group">
                    <h4 className="characteristics-group-title">💰 Юридические и финансовые параметры</h4>
                    <div className="characteristics-grid">
                      {categoryCharacteristics.sale.filter(char => ['ownership', 'documents', 'mortgage', 'encumbrances', 'constructionYear', 'material', 'landPurpose', 'replanning'].includes(char.key)).map(char => (
                        <div key={char.key} className="characteristic-field">
                          <label className="characteristic-label">{char.label}</label>
                          {char.type === 'select' ? (
                            <select
                              value={formData.characteristics[char.key] || ''}
                              onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                              className="characteristic-select"
                            >
                              <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                              {char.options?.map((option: string) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={char.type}
                              value={formData.characteristics[char.key] || ''}
                              onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                              placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                              className="characteristic-input"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Обычное отображение для других категорий */
              <div className="characteristics-grid">
                {(formData.subcategory && categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics] 
                  ? categoryCharacteristics[formData.subcategory as keyof typeof categoryCharacteristics]
                  : categoryCharacteristics[formData.category as keyof typeof categoryCharacteristics]
                ).map(char => (
                  <div key={char.key} className="characteristic-field">
                    <label className="characteristic-label">{char.label}</label>
                    {char.type === 'select' ? (
                      <select
                        value={formData.characteristics[char.key] || ''}
                        onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                        className="characteristic-select"
                      >
                        <option value="">{t('listings.selectCharacteristic')} {char.label.toLowerCase()}</option>
                        {char.options?.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={char.type}
                        value={formData.characteristics[char.key] || ''}
                        onChange={(e) => handleCharacteristicChange(char.key, e.target.value)}
                        placeholder={`${t('listings.enterCharacteristic')} ${char.label.toLowerCase()}`}
                        className="characteristic-input"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Местоположение */}
        <div className="form-section">
          <label className="form-label">
            <MapPinIcon className="label-icon" />
            {t('listings.location')} *
          </label>
          <CustomSelect
            value={formData.location}
            onChange={(value) => handleInputChange('location', value)}
            options={[{ value: '', label: t('listings.selectCity') }, ...cities.map(city => ({ value: city, label: city }))]}
            placeholder={t('listings.selectCity')}
            error={!!errors.location}
          />
          {errors.location && (
            <div className="error-message">{errors.location}</div>
          )}
        </div>

        {/* Дополнительное поле для адреса недвижимости */}
        {(formData.category === 'real-estate' || formData.subcategory === 'rent' || formData.subcategory === 'sale') && (
          <div className="form-section">
            <label className="form-label">
              <MapPinIcon className="label-icon" />
              Точный адрес недвижимости
            </label>
            <input
              type="text"
              value={formData.characteristics.address || ''}
              onChange={(e) => handleCharacteristicChange('address', e.target.value)}
              placeholder="Улица, дом, квартира, район"
              className="form-input"
            />
            <small className="form-hint">
              Укажите точный адрес для удобства потенциальных клиентов
            </small>
          </div>
        )}

        {/* Способ связи */}
        <div className="form-section">
          <label className="form-label">{t('listings.contactMethod')} *</label>
          <div className="contact-method-buttons">
            <button
              type="button"
              className={`contact-method-button ${formData.contactMethod === 'phone' ? 'active' : ''} ${currentUser && !currentUser.phone ? 'disabled' : ''}`}
              onClick={() => currentUser && currentUser.phone ? handleInputChange('contactMethod', 'phone') : null}
              disabled={!currentUser || !currentUser.phone}
            >
              <span className="method-text">{t('listings.phone')}</span>
              <span className="method-hint">
                {currentUser && currentUser.phone ? `${t('listings.fromProfile')} ${currentUser.phone}` : t('listings.fillPhoneInProfile')}
              </span>
            </button>
            <button
              type="button"
              className={`contact-method-button ${formData.contactMethod === 'chat' ? 'active' : ''}`}
              onClick={() => handleInputChange('contactMethod', 'chat')}
            >
              <span className="method-text">{t('listings.chat')}</span>
              <span className="method-hint">Email: {currentUser?.email}</span>
            </button>
          </div>
          {errors.contactMethod && (
            <div className="error-message">{errors.contactMethod}</div>
          )}
        </div>

        {/* Доставка - не показываем для категорий "Работа" и "Недвижимость" */}
        {formData.category !== 'work' && formData.category !== 'real-estate' && (
          <div className="form-section">
            <label className="form-label">{t('listings.deliveryMethod')} *</label>
            <div className="delivery-buttons">
              <button
                type="button"
                className={`delivery-button ${formData.delivery === 'pickup' ? 'active' : ''}`}
                onClick={() => handleInputChange('delivery', 'pickup')}
              >
                <span className="delivery-text">{t('listings.pickup')}</span>
                <span className="delivery-hint">{t('listings.buyerWillPickup')}</span>
              </button>
              <button
                type="button"
                className={`delivery-button ${formData.delivery === 'delivery' ? 'active' : ''}`}
                onClick={() => handleInputChange('delivery', 'delivery')}
              >
                <span className="delivery-text">{t('listings.delivery')}</span>
                <span className="delivery-hint">{t('listings.sellerWillDeliver')}</span>
              </button>
            </div>
            {errors.delivery && (
              <div className="error-message">{errors.delivery}</div>
            )}
          </div>
        )}

        {/* Кнопка отправки */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? t('common.loading') : t('listings.createListing')}
          </button>
        </div>
      </form>

      {/* Модальное окно успешного создания объявления */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content success-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-header">
              <div className="success-icon">✅</div>
              <h3 className="success-modal-title">{t('listings.listingCreatedSuccess')}</h3>
            </div>
            
            <div className="success-modal-body">
              <p className="success-modal-description">
                Твое объявление успешно опубликовано и теперь доступно для просмотра другими пользователями.
              </p>
            </div>
            
            <div className="success-modal-actions">
              <button 
                className="success-modal-button primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/my-listings');
                }}
              >
                Перейти к моим объявлениям
              </button>
              <button 
                className="success-modal-button secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Сброс формы
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    currency: 'EUR',
                    category: '',
                    subcategory: '',
                    location: '',
                    contactMethod: 'chat',
                    delivery: 'pickup',
                    images: [],
                    characteristics: {}
                  });
                  setImagePreviewUrls([]);
                  setErrors({});
                }}
              >
                Создать еще одно объявление
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListingView;

// Добавляем стили для группировки характеристик
const styles = `
  .characteristics-grouped {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .characteristics-group {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    background-color: #f9fafb;
  }

  .characteristics-group-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #3b82f6;
  }

  .characteristics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .characteristic-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .characteristic-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .characteristic-input,
  .characteristic-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background-color: white;
    transition: border-color 0.2s;
  }

  .characteristic-input:focus,
  .characteristic-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .characteristic-input::placeholder {
    color: #9ca3af;
  }

  .form-hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .characteristics-grid {
      grid-template-columns: 1fr;
    }
    
    .characteristics-group {
      padding: 1rem;
    }
  }
`;

// Вставляем стили в head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
} 