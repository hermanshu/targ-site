export interface Translations {
  // Общие элементы
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    yes: string;
    no: string;
    ok: string;
    or: string;
    and: string;
    noPhoto: string;
  };

  // Навигация
  navigation: {
    home: string;
    profile: string;
    messages: string;
    favorites: string;
    myListings: string;
    addListing: string;
  };

  // Главная страница
  home: {
    searchPlaceholder: string;
    allListings: string;
    electronics: string;
    homeAndGarden: string;
    fashion: string;
    services: string;
    work: string;
    realEstate: string;
    plants: string;
    animals: string;
    construction: string;
    free: string;
    other: string;
    vacancies: string;
    resume: string;
    rent: string;
    sale: string;
    transport: string;
    sport: string;
    books: string;
    kids: string;
    furniture: string;
    hobby: string;
    otherCategories: string;
    sortNewest: string;
    sortCheapest: string;
    sortExpensive: string;
    sortPopular: string;
    sortWithPhoto: string;
    emptyState: string;
    noResultsFound: string;
    noResultsDescription: string;
  };

  // Профиль
  profile: {
    title: string;
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    name: string;
    logout: string;
    addListingUnavailable: string;
    signInToAddListings: string;
    fileTypeError: string;
    fileSizeLimit: string;
    goToLanguage: string;
    signInDescription: string;
    signUpDescription: string;
    enterEmail: string;
    enterPassword: string;
    enterName: string;
    emailRequired: string;
    passwordRequired: string;
    nameRequired: string;
    nameMinLength: string;
      emailMissingAt: string;
      emailInvalidAt: string;
      emailInvalidDomain: string;
    emailInvalid: string;
    passwordMinLength: string;
    passwordUppercase: string;
    passwordNumber: string;
    passwordsDoNotMatch: string;
    termsRequired: string;
    signingIn: string;
    signingUp: string;
    invalidEmailOrPassword: string;
    emailNotFound: string;
    wrongPassword: string;
    tooManyRequests: string;
    userDisabled: string;
    networkError: string;
    userAlreadyExists: string;
    invalidVerificationCode: string;
    noPendingVerification: string;
    codeRequired: string;
    confirmPassword: string;
    createPassword: string;
    repeatPassword: string;
    iAgreeWith: string;
    termsAndConditions: string;
    privacyPolicy: string;
    creating: string;
    createAccount: string;
    noAccount: string;
    haveAccount: string;
    termsModalTitle: string;
    termsModalContent: string;
    privacyModalContent: string;
    dataCollection: string;
    dataUsage: string;
    dataProtection: string;
    understand: string;
    emailVerificationTitle: string;
    checkEmail: string;
    emailSentTo: string;
    emailVerificationSteps: string;
    openEmail: string;
    findEmail: string;
    clickLink: string;
    sending: string;
    resendEmail: string;
    enterCodeManually: string;
    codeInputTitle: string;
    verificationCode: string;
    enterCodePlaceholder: string;
    confirm: string;
    resendCodeAgain: string;
    cancel: string;
    avatar: string;
    myListings: string;
    myListingsDescription: string;
    notifications: string;
    notificationsDescription: string;
    helpAndSupport: string;
    helpAndSupportDescription: string;
    reviews: string;
    reviewsDescription: string;
    languageChange: string;
    languageChangeDescription: string;
    logoutFromAccount: string;
    phone: string;
    editProfile: string;
    saveChanges: string;
    cancelEdit: string;
    nameUpdated: string;
    emailUpdated: string;
    phoneUpdated: string;
    enterPhone: string;
    phoneRequired: string;
    phoneInvalid: string;
    emailChangeNote: string;
    };

  // Объявления
  listings: {
    category: string;
    price: string;
    currency: string;
    description: string;
    characteristics: string;
    delivery: string;
    pickup: string;
    sellerDelivery: string;
    characteristicBrand: string;
    characteristicModel: string;
    characteristicCondition: string;
    characteristicWarranty: string;
    characteristicYear: string;
    characteristicMaterial: string;
    characteristicDimensions: string;
    characteristicSize: string;
    characteristicColor: string;
    characteristicServiceType: string;
    characteristicExperience: string;
    characteristicSchedule: string;
    characteristicPlantType: string;
    maxPhotoCount: string;
    listingCreatedSuccess: string;
    errorCreatingListing: string;
    conditionNew: string;
    conditionLikeNew: string;
    conditionGood: string;
    conditionFair: string;
    warrantyYes: string;
    warrantyNo: string;
    warrantyExpired: string;
    title: string;
    location: string;
    images: string;
    contactMethod: string;
    phone: string;
    chat: string;
    addImages: string;
    removeImage: string;
    uploadHint: string;
    createListing: string;
    photosRequired: string;
    addPhotoText: string;
    photoOptionalNote: string;
    maxFileSizeNote: string;
    supportedFormatsNote: string;
    enterTitle: string;
    enterDescription: string;
    enterPrice: string;
    characteristicAge: string;
    characteristicHeight: string;
    characteristicPosition: string;
    characteristicSalary: string;
    characteristicEducation: string;
    characteristicSkills: string;
    characteristicPropertyType: string;
    characteristicRooms: string;
    characteristicArea: string;
    characteristicFloor: string;
    characteristicRentPeriod: string;
    characteristicMileage: string;
    characteristicFuelType: string;
    characteristicTransmission: string;
    characteristicAuthor: string;
    characteristicPublisher: string;
    characteristicLanguage: string;
    characteristicAgeGroup: string;
    characteristicStyle: string;
    characteristicHobbyType: string;
    conditionExcellent: string;
    conditionNeedsRepair: string;
    propertyTypeApartment: string;
    propertyTypeHouse: string;
    propertyTypeCommercial: string;
    propertyTypeLand: string;
    fuelTypePetrol: string;
    fuelTypeDiesel: string;
    fuelTypeElectric: string;
    fuelTypeHybrid: string;
    transmissionManual: string;
    transmissionAutomatic: string;
    transmissionRobot: string;
    transmissionCVT: string;
    selectCategory: string;
    subcategory: string;
    selectCharacteristic: string;
    enterCharacteristic: string;
    fromProfile: string;
    notSpecified: string;
    deliveryMethod: string;
    buyerWillPickup: string;
    selectCity: string;
  };

  // Детали объявления
  listingDetail: {
    contactSeller: string;
    write: string;
    writeMessage: string;
    openChat: string;
    published: string;
    views: string;
    delivery: string;
    pickup: string;
    sellerDelivery: string;
    description: string;
    characteristics: string;
    company: string;
    individual: string;
    noPhoto: string;
    chooseContactMethod: string;
    authRequired: string;
    authRequiredDescription: string;
    signIn: string;
    signInDescription: string;
    signUp: string;
    signUpDescription: string;
    shareOptions: string;
    copyLink: string;
    copyLinkDescription: string;
    reportListing: string;
    reportDescription: string;
    call: string;
    directCall: string;
    linkCopied: string;
    copyError: string;
    reportSent: string;
  };

  // Приветственное окно
  welcome: {
    title: string;
    description: string;
    selectLanguage: string;
    startExploring: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };

  // Сообщения
  messages: {
    title: string;
    noMessages: string;
    startChat: string;
    typeMessage: string;
    online: string;
    offline: string;
    messagesUnavailable: string;
    signInToChat: string;
  };

  // Избранное
  favorites: {
    title: string;
    noFavorites: string;
    noFavoritesDescription: string;
    addToFavorites: string;
    removeFromFavorites: string;
    searchFavorites: string;
    searchChats: string;
    favoritesUnavailable: string;
    signInToAccessFavorites: string;
    goToMessagesForContact: string;
    selectReportReason: string;
    reportSpam: string;
    reportSpamDesc: string;
    reportInappropriate: string;
    reportInappropriateDesc: string;
    reportHarassment: string;
    reportHarassmentDesc: string;
    reportFraud: string;
    reportFraudDesc: string;
    reportOther: string;
    reportOtherDesc: string;
    enterReportDetails: string;
    cancel: string;
    send: string;
    reportSent: string;
    dialogDeleted: string;
    userBlocked: string;
    blockUser: string;
    confirmBlockUser: string;
    emptyTitle: string;
    emptyDescription: string;
    listingsCount: string;
    searchListings: string;
    previewImage: string;
    enterCity: string;
    from: string;
    to: string;
    unknown: string;
    listing: string;
    listings: string;
    notSpecified: string;
    chatForListing: string;
    messages: string;
    online: string;
    offline: string;
    clickToViewListing: string;
    deleteDialog: string;
    reportUser: string;
    attachment: string;
    preview: string;
    enterMessage: string;
    selectChat: string;
    selectChatDescription: string;
    confirmDeleteDialog: string;
    delete: string;
    block: string;
  };

  // Мои объявления
  myListings: {
    title: string;
    add: string;
    active: string;
    archived: string;
    noListings: string;
    createFirstListing: string;
    edit: string;
    archive: string;
    activate: string;
    publish: string;
    delete: string;
    back: string;
    deleteConfirmation: string;
    status: {
      active: string;
      archived: string;
      draft: string;
      unknown: string;
    };
    statsLabels: {
      active: string;
      views: string;
      inFavorites: string;
      inArchive: string;
    };
    tabs: {
      active: string;
      drafts: string;
      archive: string;
    };
  };

  // Редактирование объявления
  editListing: {
    title: string;
    update: string;
    updating: string;
    success: string;
    error: string;
    existingImages: string;
  };
  sellerProfile: {
    title: string;
    listingDetails: string;
    aboutSeller: string;
    location: string;
    memberSince: string;
    notSpecified: string;
    sellerListings: string;
    noListings: string;
    noListingsDescription: string;
    totalListings: string;
    activeListings: string;
    totalViews: string;
    totalFavorites: string;
    reviews: string;
  };

  // Добавление объявления
  addListing: {
    title: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    subcategory: string;
    location: string;
    images: string;
    contactMethod: string;
    chat: string;
    phone: string;
    uploadImages: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    selectCategory: string;
    selectSubcategory: string;
    selectLocation: string;
    errors: {
      titleRequired: string;
      priceRequired: string;
      priceInvalid: string;
      categoryRequired: string;
      locationRequired: string;
      subcategoryRequired: string;
    };
  };

  // Уведомления
  notifications: {
    codeSent: string;
    emailVerified: string;
    settings: string;
    settingsDescription: string;
    settingsInfo: string;
    newListings: string;
    newListingsDescription: string;
    platformNews: string;
    platformNewsDescription: string;
    listingStats: string;
    listingStatsDescription: string;
  };

  // Помощь и поддержка
  help: {
    title: string;
    contactUs: string;
    emailSupport: string;
    frequentlyAskedQuestions: string;
    usefulLinks: string;
    termsOfService: string;
    termsOfServiceSubtitle: string;
    privacyPolicy: string;
    privacyPolicySubtitle: string;
    howToCreateListing: string;
    howToCreateListingAnswer: string;
    howToContactSeller: string;
    howToContactSellerAnswer: string;
    howToEditListing: string;
    howToEditListingAnswer: string;
    howToDeleteListing: string;
    howToDeleteListingAnswer: string;
    howToReport: string;
    howToReportAnswer: string;
    howToChangeLanguage: string;
    howToChangeLanguageAnswer: string;
  };

  // Отзывы
  reviews: {
    title: string;
    averageRating: string;
    averageGivenRating: string;
    totalReviews: string;
    totalGivenReviews: string;
    receivedReviews: string;
    givenReviews: string;
    noReceivedReviews: string;
    noGivenReviews: string;
    noReceivedReviewsDescription: string;
    noGivenReviewsDescription: string;
  };

  // Сортировка
  sort: {
    newestFirst: string;
    oldestFirst: string;
    cheapestFirst: string;
    expensiveFirst: string;
    mostPopular: string;
    withPhotoFirst: string;
  };

  // Сортировка (для SortSheet)
  sorting: {
    title: string;
    newestFirst: string;
    newestFirstDescription: string;
    cheapestFirst: string;
    cheapestFirstDescription: string;
    expensiveFirst: string;
    expensiveFirstDescription: string;
    mostPopular: string;
    mostPopularDescription: string;
    withPhotoFirst: string;
    withPhotoFirstDescription: string;
  };

  // Фильтры
  filters: {
    title: string;
    price: string;
    priceFrom: string;
    priceTo: string;
    location: string;
    category: string;
    condition: string;
    conditionNew: string;
    conditionUsed: string;
    conditionForParts: string;
    withPhoto: string;
    clearFilters: string;
    applyFilters: string;
    city: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    anyCategory: string;
    onlyWithPhoto: string;
    delivery: string;
    seller: string;
    reset: string;
    apply: string;
  };

  // Валидация
  validation: {
    minLength: string;
    invalidPrice: string;
    selectCategory: string;
    selectSubcategory: string;
    enterLocation: string;
    selectContactMethod: string;
  };
}

export const translations: Translations = {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      back: 'Назад',
      next: 'Далее',
      previous: 'Назад',
      close: 'Закрыть',
      yes: 'Да',
      no: 'Нет',
      ok: 'ОК',
          or: 'или',
    and: 'и',
    noPhoto: 'Нет фото',
    },

    navigation: {
      home: 'Главная',
      profile: 'Профиль',
      messages: 'Сообщения',
      favorites: 'Избранное',
      myListings: 'Мои объявления',
      addListing: 'Добавить объявление',
    },

    home: {
      searchPlaceholder: 'Поиск объявлений...',
      allListings: 'Все объявления',
      electronics: 'Электроника',
    homeAndGarden: 'Дом и сад',
    fashion: 'Мода',
      services: 'Услуги',
      work: 'Работа',
      realEstate: 'Недвижимость',
          plants: 'Растения',
    animals: 'Животные',
    construction: 'Строительство',
    free: 'Бесплатно',
    other: 'Другое',
    vacancies: 'Вакансии',
      resume: 'Резюме',
      rent: 'Аренда',
      sale: 'Продажа',
    transport: 'Транспорт',
      sport: 'Спорт',
      books: 'Книги',
    kids: 'Дети',
      furniture: 'Мебель',
      hobby: 'Хобби',
    otherCategories: 'Другие категории',
      sortNewest: 'Сначала новые',
    sortCheapest: 'Сначала дешевые',
      sortExpensive: 'Сначала дорогие',
      sortPopular: 'По популярности',
      sortWithPhoto: 'Сначала с фото',
      emptyState: 'Тут еще пусто',
      noResultsFound: 'Ничего не найдено',
      noResultsDescription: 'Попробуйте изменить поисковый запрос или фильтры',
    },

    profile: {
      title: 'Профиль',
      signIn: 'Войти',
      signUp: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      name: 'Имя',
    logout: 'Выйти',
      addListingUnavailable: 'Добавление объявлений недоступно',
    signInToAddListings: 'Войдите, чтобы добавлять объявления',
    fileTypeError: 'Неподдерживаемый тип файла',
    fileSizeLimit: 'Файл слишком большой',
    goToLanguage: 'Перейти к настройкам языка',
    signInDescription: 'Войдите в существующий аккаунт',
    signUpDescription: 'Создайте новый аккаунт',
    enterEmail: 'Введите email',
      enterPassword: 'Введите пароль',
    enterName: 'Введите имя',
    emailRequired: 'Email обязателен',
    passwordRequired: 'Пароль обязателен',
    nameRequired: 'Имя обязательно',
    nameMinLength: 'Имя должно содержать минимум 2 символа',
    emailMissingAt: 'Email должен содержать символ @',
    emailInvalidAt: 'Некорректное использование символа @',
    emailInvalidDomain: 'Некорректный домен email',
    emailInvalid: 'Некорректный формат email',
    passwordMinLength: 'Пароль должен содержать минимум 6 символов',
    passwordUppercase: 'Пароль должен содержать заглавную букву',
    passwordNumber: 'Пароль должен содержать цифру',
    passwordsDoNotMatch: 'Пароли не совпадают',
    termsRequired: 'Необходимо согласиться с условиями',
    signingIn: 'Вход...',
    signingUp: 'Регистрация...',
    invalidEmailOrPassword: 'Неверный email или пароль',
    emailNotFound: 'Email не найден',
    wrongPassword: 'Неверный пароль',
    tooManyRequests: 'Слишком много попыток. Попробуйте позже',
    userDisabled: 'Пользователь заблокирован',
    networkError: 'Ошибка сети',
    userAlreadyExists: 'Пользователь уже существует',
    invalidVerificationCode: 'Неверный код подтверждения',
    noPendingVerification: 'Нет ожидающего подтверждения',
    codeRequired: 'Код обязателен',
    confirmPassword: 'Подтвердите пароль',
      createPassword: 'Создайте пароль',
      repeatPassword: 'Повторите пароль',
      iAgreeWith: 'Я согласен с',
    termsAndConditions: 'Условиями использования',
    privacyPolicy: 'Политикой конфиденциальности',
      creating: 'Создание...',
      createAccount: 'Создать аккаунт',
      noAccount: 'Нет аккаунта?',
      haveAccount: 'Уже есть аккаунт?',
      termsModalTitle: 'Условия использования и политика конфиденциальности',
    termsModalContent: 'Используя наш сервис, вы соглашаетесь с условиями использования. Мы обязуемся защищать вашу конфиденциальность и обеспечивать безопасность ваших данных.',
    privacyModalContent: 'Мы собираем только необходимые данные для предоставления услуг. Ваша личная информация защищена и не передается третьим лицам без вашего согласия.',
    dataCollection: 'Сбор данных: Мы собираем только информацию, необходимую для работы сервиса.',
    dataUsage: 'Использование данных: Ваши данные используются исключительно для предоставления услуг.',
    dataProtection: 'Защита данных: Мы используем современные методы шифрования для защиты вашей информации.',
      understand: 'Понятно',
    emailVerificationTitle: 'Подтверждение email',
      checkEmail: 'Проверьте вашу почту',
    emailSentTo: 'Email отправлен на',
    emailVerificationSteps: 'Для подтверждения email выполните следующие шаги:',
      openEmail: 'Откройте вашу почту',
      findEmail: 'Найдите письмо от нас',
    clickLink: 'Нажмите на ссылку в письме',
      sending: 'Отправка...',
    resendEmail: 'Отправить письмо повторно',
    enterCodeManually: 'Ввести код вручную',
    codeInputTitle: 'Ввод кода подтверждения',
      verificationCode: 'Код подтверждения',
    enterCodePlaceholder: 'Введите 6-значный код',
      confirm: 'Подтвердить',
      resendCodeAgain: 'Отправить код повторно',
    cancel: 'Отмена',
    avatar: 'Аватар',
      myListings: 'Мои объявления',
      myListingsDescription: 'Управление вашими объявлениями',
      notifications: 'Уведомления',
      notificationsDescription: 'Настройки уведомлений',
      helpAndSupport: 'Помощь и поддержка',
    helpAndSupportDescription: 'Получить помощь и поддержку',
      reviews: 'Отзывы',
    reviewsDescription: 'Просмотр отзывов',
      languageChange: 'Смена языка',
    languageChangeDescription: 'Изменить язык интерфейса',
      logoutFromAccount: 'Выйти из аккаунта',
      phone: 'Телефон',
      editProfile: 'Редактировать профиль',
      saveChanges: 'Сохранить изменения',
      cancelEdit: 'Отменить редактирование',
      nameUpdated: 'Имя успешно обновлено',
      emailUpdated: 'Email успешно обновлен',
      phoneUpdated: 'Телефон успешно обновлен',
      enterPhone: 'Введите номер телефона',
      phoneRequired: 'Телефон обязателен',
      phoneInvalid: 'Неверный формат телефона',
      emailChangeNote: 'Изменение email потребует повторной верификации',
  },

    listings: {
    category: 'Категория',
      price: 'Цена',
      currency: 'Валюта',
    description: 'Описание',
      characteristics: 'Характеристики',
      delivery: 'Доставка',
    pickup: 'Самовывоз',
    sellerDelivery: 'Доставка продавцом',
      // Характеристики товаров
      characteristicBrand: 'Бренд',
      characteristicModel: 'Модель',
      characteristicCondition: 'Состояние',
      characteristicWarranty: 'Гарантия',
    characteristicYear: 'Год',
      characteristicMaterial: 'Материал',
      characteristicDimensions: 'Размеры',
      characteristicSize: 'Размер',
      characteristicColor: 'Цвет',
      characteristicServiceType: 'Тип услуги',
    characteristicExperience: 'Опыт',
    characteristicSchedule: 'График',
      characteristicPlantType: 'Тип растения',
    maxPhotoCount: 'Максимальное количество фото',
    listingCreatedSuccess: 'Объявление успешно создано',
    errorCreatingListing: 'Ошибка при создании объявления',
    conditionNew: 'Новое',
    conditionLikeNew: 'Как новое',
    conditionGood: 'Хорошее',
    conditionFair: 'Удовлетворительное',
    warrantyYes: 'Есть гарантия',
    warrantyNo: 'Нет гарантии',
    warrantyExpired: 'Гарантия истекла',
    title: 'Название',
    location: 'Местоположение',
    images: 'Фотографии',
    contactMethod: 'Способ связи',
    phone: 'Телефон',
    chat: 'Чат',
    addImages: 'Добавить фотографии',
    removeImage: 'Удалить фотографию',
    uploadHint: 'Перетащите фотографии сюда или нажмите для выбора',
    createListing: 'Создать объявление',
    photosRequired: 'Фотографии (обязательно)',
    addPhotoText: 'Добавить фото',
    photoOptionalNote: 'Фотографии не обязательны, но рекомендуются',
    maxFileSizeNote: 'Максимальный размер файла: 5 МБ',
    supportedFormatsNote: 'Поддерживаемые форматы: JPG, PNG, GIF',
    enterTitle: 'Введите название объявления',
    enterDescription: 'Введите описание объявления',
    enterPrice: 'Введите цену',
      characteristicAge: 'Возраст',
      characteristicHeight: 'Высота',
      characteristicPosition: 'Должность',
      characteristicSalary: 'Зарплата',
      characteristicEducation: 'Образование',
      characteristicSkills: 'Навыки',
      characteristicPropertyType: 'Тип недвижимости',
      characteristicRooms: 'Количество комнат',
    characteristicArea: 'Площадь',
      characteristicFloor: 'Этаж',
    characteristicRentPeriod: 'Период аренды',
    characteristicMileage: 'Пробег',
      characteristicFuelType: 'Тип топлива',
    characteristicTransmission: 'Трансмиссия',
      characteristicAuthor: 'Автор',
      characteristicPublisher: 'Издательство',
      characteristicLanguage: 'Язык',
      characteristicAgeGroup: 'Возрастная группа',
      characteristicStyle: 'Стиль',
      characteristicHobbyType: 'Тип хобби',
    conditionExcellent: 'Отличное',
    conditionNeedsRepair: 'Требует ремонта',
    propertyTypeApartment: 'Квартира',
    propertyTypeHouse: 'Дом',
    propertyTypeCommercial: 'Коммерческая недвижимость',
    propertyTypeLand: 'Земельный участок',
    fuelTypePetrol: 'Бензин',
    fuelTypeDiesel: 'Дизель',
    fuelTypeElectric: 'Электро',
    fuelTypeHybrid: 'Гибрид',
    transmissionManual: 'Механика',
    transmissionAutomatic: 'Автомат',
    transmissionRobot: 'Робот',
    transmissionCVT: 'Вариатор',
    selectCategory: 'Выберите категорию',
    subcategory: 'Подкатегория',
    selectCharacteristic: 'Выберите',
    enterCharacteristic: 'Введите',
    fromProfile: 'Из профиля',
    notSpecified: 'Не указано',
    deliveryMethod: 'Способ доставки',
    buyerWillPickup: 'Покупатель заберет сам',
    selectCity: 'Выберите город',
  },

  listingDetail: {
    contactSeller: 'Связаться с продавцом',
    write: 'Написать',
    writeMessage: 'Написать сообщение',
    openChat: 'Открыть чат',
    published: 'Опубликовано',
    views: 'просмотров',
    delivery: 'Доставка',
    pickup: 'Самовывоз',
    sellerDelivery: 'Доставка продавцом',
    description: 'Описание',
    characteristics: 'Характеристики',
    company: 'Компания',
    individual: 'Частное лицо',
    noPhoto: 'Фото отсутствует',
    chooseContactMethod: 'Выберите способ связи',
    authRequired: 'Требуется авторизация',
    authRequiredDescription: 'Войдите в аккаунт, чтобы связаться с продавцом',
    signIn: 'Войти',
    signInDescription: 'Войдите в существующий аккаунт',
    signUp: 'Регистрация',
    signUpDescription: 'Создайте новый аккаунт',
    shareOptions: 'Поделиться',
    copyLink: 'Копировать ссылку',
    copyLinkDescription: 'Скопировать ссылку на объявление',
    reportListing: 'Пожаловаться на объявление',
    reportDescription: 'Пожаловаться на это объявление',
    call: 'Позвонить',
    directCall: 'Прямой звонок',
    linkCopied: 'Ссылка скопирована',
    copyError: 'Ошибка копирования',
    reportSent: 'Жалоба отправлена',
  },

    welcome: {
      title: 'Добро пожаловать!',
      description: 'Ты попал на мультиязычную платформу объявлений товаров и услуг. Мы рады видеть вас на нашей платформе. Здесь вы можете найти и разместить объявления о продаже и покупке товаров, услуг и недвижимости.',
      selectLanguage: 'Выберите язык для начала',
      startExploring: 'Перейти к объявлениям',
      feature1: 'Легкость использования - простой интерфейс и понятные инструкции',
      feature2: 'Большой выбор - объявления из множества категорий',
      feature3: 'Надежность - безопасность данных и надежные сервисы',
      feature4: 'Поддержка 24/7 - наша команда всегда готова помочь',
    },

    messages: {
      title: 'Сообщения',
    noMessages: 'Пока нет сообщений',
    startChat: 'Начать разговор',
      typeMessage: 'Введите сообщение...',
      online: 'В сети',
    offline: 'Не в сети',
      messagesUnavailable: 'Сообщения недоступны',
    signInToChat: 'Войдите, чтобы общаться',
    },

    favorites: {
      title: 'Избранное',
    noFavorites: 'Пока нет избранного',
    noFavoritesDescription: 'Добавляйте объявления в избранное, нажимая на иконку сердца',
      addToFavorites: 'Добавить в избранное',
      removeFromFavorites: 'Удалить из избранного',
    searchFavorites: 'Поиск в избранном...',
    searchChats: 'Поиск чатов...',
      favoritesUnavailable: 'Избранное недоступно',
    signInToAccessFavorites: 'Войдите, чтобы получить доступ к избранному',
    goToMessagesForContact: 'Для связи с продавцом перейдите в раздел "Сообщения"',
    selectReportReason: 'Выберите причину жалобы',
    reportSpam: 'Спам',
    reportSpamDesc: 'Нежелательная реклама или рассылка',
    reportInappropriate: 'Неприемлемый контент',
    reportInappropriateDesc: 'Оскорбительный или неприличный контент',
    reportHarassment: 'Домогательства',
    reportHarassmentDesc: 'Угрозы или преследование',
    reportFraud: 'Мошенничество',
    reportFraudDesc: 'Обман или попытка мошенничества',
    reportOther: 'Другое',
    reportOtherDesc: 'Другие причины для жалобы',
    enterReportDetails: 'Опишите подробности жалобы...',
    cancel: 'Отмена',
    send: 'Отправить',
    reportSent: 'Жалоба отправлена',
    dialogDeleted: 'Диалог удален',
    userBlocked: 'Пользователь заблокирован',
    blockUser: 'Заблокировать пользователя',
    confirmBlockUser: 'Вы уверены, что хотите заблокировать этого пользователя?',
      emptyTitle: 'Избранное пусто',
    emptyDescription: 'Добавляйте объявления в избранное, нажимая на иконку сердца',
      listingsCount: 'объявлений',
      searchListings: 'Поиск объявлений...',
    previewImage: 'Предварительный просмотр изображения',
      enterCity: 'Введите город',
      from: 'От',
      to: 'До',
    unknown: 'Неизвестно',
    listing: 'Объявление',
    listings: 'Объявления',
    notSpecified: 'Не указано',
    chatForListing: 'Чат для объявления',
      messages: 'Сообщения',
      online: 'В сети',
      offline: 'Не в сети',
    clickToViewListing: 'Нажмите, чтобы просмотреть объявление',
      deleteDialog: 'Удалить диалог',
    reportUser: 'Пожаловаться на пользователя',
    attachment: 'Вложение',
    preview: 'Предварительный просмотр',
    enterMessage: 'Введите сообщение...',
      selectChat: 'Выберите чат',
      selectChatDescription: 'Выберите чат из списка слева, чтобы начать общение',
    confirmDeleteDialog: 'Вы уверены, что хотите удалить этот диалог?',
      delete: 'Удалить',
      block: 'Заблокировать',
  },

        myListings: {
      title: 'Мои объявления',
      add: 'Добавить',
      active: 'Активные',
      archived: 'Архив',
      noListings: 'Пока нет объявлений',
      createFirstListing: 'Создайте первое объявление',
      edit: 'Редактировать',
      archive: 'Архивировать',
      activate: 'Активировать',
      publish: 'Опубликовать',
      delete: 'Удалить',
      back: 'Назад',
      deleteConfirmation: 'Вы уверены, что хотите удалить это объявление?',
      status: {
        active: 'Активно',
        archived: 'В архиве',
        draft: 'Черновик',
        unknown: 'Неизвестно',
      },
      statsLabels: {
        active: 'Активных',
        views: 'Просмотров',
        inFavorites: 'В избранном',
        inArchive: 'В архиве',
      },
      tabs: {
        active: 'Активные',
        drafts: 'Черновики',
        archive: 'Архив',
      },
    },

      editListing: {
    title: 'Редактировать объявление',
    update: 'Обновить',
    updating: 'Обновление...',
    success: 'Объявление успешно обновлено',
    error: 'Ошибка при обновлении объявления',
    existingImages: 'Существующие изображения',
  },
  sellerProfile: {
    title: 'Профиль продавца',
    listingDetails: 'Детали объявления',
    aboutSeller: 'О продавце',
    location: 'Местоположение',
    memberSince: 'Участник с',
    notSpecified: 'Не указано',
    sellerListings: 'Объявления продавца',
    noListings: 'Нет объявлений',
    noListingsDescription: 'У этого продавца пока нет активных объявлений',
    totalListings: 'Всего объявлений',
    activeListings: 'Активных объявлений',
    totalViews: 'Всего просмотров',
    totalFavorites: 'Всего в избранном',
    reviews: 'отзывов',
  },

    addListing: {
      title: 'Название',
      description: 'Описание',
      price: 'Цена',
      currency: 'Валюта',
      category: 'Категория',
      subcategory: 'Подкатегория',
      location: 'Местоположение',
      images: 'Изображения',
      contactMethod: 'Способ связи',
      chat: 'Чат',
      phone: 'Телефон',
      uploadImages: 'Загрузить изображения',
      titlePlaceholder: 'Введите название объявления',
      descriptionPlaceholder: 'Опишите товар или услугу...',
      selectCategory: 'Выберите категорию',
      selectSubcategory: 'Выберите подкатегорию',
      selectLocation: 'Выберите город',
      errors: {
        titleRequired: 'Название обязательно',
        priceRequired: 'Цена обязательна',
        priceInvalid: 'Некорректная цена',
        categoryRequired: 'Категория обязательна',
        locationRequired: 'Местоположение обязательно',
        subcategoryRequired: 'Подкатегория обязательна',
      },
    },

    notifications: {
    codeSent: 'Код подтверждения отправлен',
      emailVerified: 'Email подтвержден',
      settings: 'Настройки уведомлений',
    settingsDescription: 'Выберите, какие уведомления вы хотите получать',
      settingsInfo: 'Настройки сохраняются автоматически',
      newListings: 'Новые объявления',
    newListingsDescription: 'Уведомления о новых объявлениях в избранных категориях',
      platformNews: 'Новости платформы',
    platformNewsDescription: 'Важные обновления и новости о платформе',
      listingStats: 'Статистика объявлений',
    listingStatsDescription: 'Уведомления о просмотрах и активности ваших объявлений',
    },

    help: {
      title: 'Помощь и поддержка',
    contactUs: 'Связаться с нами',
    emailSupport: 'Поддержка по email',
      frequentlyAskedQuestions: 'Часто задаваемые вопросы',
      usefulLinks: 'Полезные ссылки',
    termsOfService: 'Условия использования',
    termsOfServiceSubtitle: 'Правила использования платформы',
    privacyPolicy: 'Политика конфиденциальности',
    privacyPolicySubtitle: 'Как мы защищаем ваши данные',
      howToCreateListing: 'Как создать объявление?',
    howToCreateListingAnswer: 'Перейдите в раздел "Добавить объявление", заполните все необходимые поля и нажмите "Опубликовать".',
      howToContactSeller: 'Как связаться с продавцом?',
    howToContactSellerAnswer: 'На странице объявления нажмите кнопку "Связаться с продавцом" и выберите способ связи.',
      howToEditListing: 'Как отредактировать объявление?',
    howToEditListingAnswer: 'В разделе "Мои объявления" найдите нужное объявление и нажмите кнопку "Редактировать".',
      howToDeleteListing: 'Как удалить объявление?',
    howToDeleteListingAnswer: 'В разделе "Мои объявления" найдите нужное объявление и нажмите кнопку "Удалить".',
      howToReport: 'Как пожаловаться на объявление?',
    howToReportAnswer: 'На странице объявления нажмите кнопку "Поделиться" и выберите "Пожаловаться на объявление".',
      howToChangeLanguage: 'Как изменить язык?',
    howToChangeLanguageAnswer: 'В профиле выберите "Смена языка" и выберите нужный язык интерфейса.',
  },

    reviews: {
    title: 'Отзывы',
    averageRating: 'Средний рейтинг',
    averageGivenRating: 'Средний рейтинг данных',
    totalReviews: 'Всего отзывов',
    totalGivenReviews: 'Всего данных отзывов',
    receivedReviews: 'Полученные отзывы',
    givenReviews: 'Данные отзывы',
    noReceivedReviews: 'Пока нет полученных отзывов',
    noGivenReviews: 'Пока нет данных отзывов',
    noReceivedReviewsDescription: 'Когда другие пользователи оставят вам отзыв, он появится здесь',
    noGivenReviewsDescription: 'Когда вы оставите отзыв другому пользователю, он появится здесь',
  },

  sort: {
    newestFirst: 'Сначала новые',
    oldestFirst: 'Сначала старые',
    cheapestFirst: 'Сначала дешевые',
    expensiveFirst: 'Сначала дорогие',
    mostPopular: 'По популярности',
    withPhotoFirst: 'Сначала с фото',
  },

    sorting: {
    title: 'Сортировка',
    newestFirst: 'Сначала новые',
    newestFirstDescription: 'Самые свежие объявления',
    cheapestFirst: 'Сначала дешевые',
    cheapestFirstDescription: 'От низкой к высокой цене',
    expensiveFirst: 'Сначала дорогие',
    expensiveFirstDescription: 'От высокой к низкой цене',
    mostPopular: 'По популярности',
    mostPopularDescription: 'Самые просматриваемые',
    withPhotoFirst: 'Сначала с фото',
    withPhotoFirstDescription: 'Объявления с фотографиями',
  },

    filters: {
    title: 'Фильтры',
    price: 'Цена',
    priceFrom: 'От',
    priceTo: 'До',
    location: 'Местоположение',
    category: 'Категория',
    condition: 'Состояние',
    conditionNew: 'Новое',
    conditionUsed: 'Б/у',
    conditionForParts: 'На запчасти',
    withPhoto: 'Только с фото',
    clearFilters: 'Очистить фильтры',
    applyFilters: 'Применить фильтры',
    city: 'Город',
    priceRange: 'Диапазон цен',
    minPrice: 'Мин. цена',
    maxPrice: 'Макс. цена',
    anyCategory: 'Любая категория',
    onlyWithPhoto: 'Только с фото',
    delivery: 'Доставка',
    seller: 'Продавец',
    reset: 'Сбросить',
    apply: 'Применить',
  },

    validation: {
    minLength: 'Минимальная длина',
    invalidPrice: 'Некорректная цена',
    selectCategory: 'Выберите категорию',
    selectSubcategory: 'Выберите подкатегорию',
    enterLocation: 'Введите местоположение',
    selectContactMethod: 'Выберите способ связи',
  },
}; 