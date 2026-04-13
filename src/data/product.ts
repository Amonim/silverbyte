export type Product = {
  id: number;
  title: string;
  category: "smartphones" | "laptops" | "computers" | "periphery";
  price: number;
  images: string[];
  description: string;
  specs: {
    brand: string;
    model: string;
    category: string;
    warranty: string;
  };
};

export const products: Product[] = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    category: "smartphones",
    price: 649990,
    images: [
      "/images/iphone_15_pro_1.png",
      "/images/iphone_15_pro_2.png",
      "/images/iphone_15_pro_3.png",
    ],
    description:
      "Флагманский смартфон Apple с мощным процессором, премиальным корпусом и продвинутой камерой.",
    specs: {
      brand: "Apple",
      model: "iPhone 15 Pro",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 2,
    title: "Samsung Galaxy S24",
    category: "smartphones",
    price: 529990,
    images: [
      "/images/Samsung_Galaxy_S24_1.png",
      "/images/Samsung_Galaxy_S24_2.png",
      "/images/Samsung_Galaxy_S24_3.png",
    ],
    description:
      "Современный смартфон Samsung с ярким дисплеем, высокой производительностью и стильным дизайном.",
    specs: {
      brand: "Samsung",
      model: "Galaxy S24",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 3,
    title: "Xiaomi 14",
    category: "smartphones",
    price: 389990,
    images: [
      "/images/Xiaomi_14_1.png",
      "/images/Xiaomi_14_2.png",
      "/images/Xiaomi_14_3.png",
    ],
    description:
      "Флагман Xiaomi с высокой производительностью, стильным дизайном и отличной камерой.",
    specs: {
      brand: "Xiaomi",
      model: "Xiaomi 14",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 4,
    title: "Google Pixel 8",
    category: "smartphones",
    price: 419990,
    images: [
      "/images/Google_Pixel_8_1.png",
      "/images/Google_Pixel_8_2.png",
      "/images/Google_Pixel_8_3.png",
    ],
    description:
      "Смартфон Google с чистым Android и отличной камерой для фото и видео.",
    specs: {
      brand: "Google",
      model: "Pixel 8",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 5,
    title: "Honor Magic 6",
    category: "smartphones",
    price: 359990,
    images: [
      "/images/Honor_Magic_6_1.png",
      "/images/Honor_Magic_6_2.png",
      "/images/Honor_Magic_6_3.png",
    ],
    description:
      "Современный смартфон Honor с мощным процессором и ярким дисплеем.",
    specs: {
      brand: "Honor",
      model: "Magic 6",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 6,
    title: "OnePlus 12",
    category: "smartphones",
    price: 449990,
    images: [
      "/images/OnePlus_12_1.png",
      "/images/OnePlus_12_2.png",
      "/images/OnePlus_12_3.png",
    ],
    description:
      "Быстрый и плавный смартфон OnePlus с высокой производительностью.",
    specs: {
      brand: "OnePlus",
      model: "OnePlus 12",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },


  {
    id: 7,
    title: "MacBook Air M3",
    category: "laptops",
    price: 729990,
    images: [
      "/images/MacBook Air_M3_1.png",
      "/images/MacBook Air_M3_2.png",
      "/images/MacBook Air_M3_3.png",
    ],
    description: "Лёгкий и мощный ноутбук Apple с процессором M3.",
    specs: {
      brand: "Apple",
      model: "MacBook Air M3",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 8,
    title: "ASUS Zenbook 14",
    category: "laptops",
    price: 559990,
    images: [
      "/images/ASUS Zenbook_14_1.png",
      "/images/ASUS Zenbook_14_2.png",
      "/images/ASUS Zenbook_14_3.png",
    ],
    description: "Тонкий и стильный ноутбук ASUS для работы и учебы.",
    specs: {
      brand: "ASUS",
      model: "Zenbook 14",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 9,
    title: "Lenovo IdeaPad 5",
    category: "laptops",
    price: 399990,
    images: [
      "/images/Lenovo_IdeaPad_5_1.png",
      "/images/Lenovo_IdeaPad_5_2.png",
      "/images/Lenovo_IdeaPad_5_3.png",
    ],
    description: "Надежный ноутбук Lenovo для повседневных задач.",
    specs: {
      brand: "Lenovo",
      model: "IdeaPad 5",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 10,
    title: "HP Pavilion 15",
    category: "laptops",
    price: 429990,
    images: [
      "/images/HP_Pavilion_15_1.png",
      "/images/HP_Pavilion_15_2.png",
      "/images/HP_Pavilion_15_3.png",
    ],
    description: "Универсальный ноутбук HP для работы и развлечений.",
    specs: {
      brand: "HP",
      model: "Pavilion 15",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 11,
    title: "Acer Swift X",
    category: "laptops",
    price: 469990,
    images: [
      "/images/Acer_Swift_X_1.png",
      "/images/Acer_Swift_X_2.png",
      "/images/Acer_Swift_X_3.png",
    ],
    description: "Мощный ноутбук Acer для работы и игр.",
    specs: {
      brand: "Acer",
      model: "Swift X",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 12,
    title: "MSI Modern 14",
    category: "laptops",
    price: 379990,
    images: [
      "/images/MSI_Modern_14_1.png",
      "/images/MSI_Modern_14_2.png",
      "/images/MSI_Modern_14_3.png",
    ],
    description: "Компактный ноутбук MSI с хорошей производительностью.",
    specs: {
      brand: "MSI",
      model: "Modern 14",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },


  {
    id: 13,
    title: "Игровой ПК Storm X",
    category: "computers",
    price: 899990,
    images: [
      "/images/Storm_X_1.png",
      "/images/Storm_X_2.png",
      "/images/Storm_X_3.png",
    ],
    description: "Мощный игровой компьютер для современных игр.",
    specs: {
      brand: "Storm",
      model: "Storm X",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },
  {
    id: 14,
    title: "HYPERPC LUMEN 5",
    category: "computers",
    price: 1649990,
    images: [
      "/images/HYPERPC_LUMEN_5_1.png",
      "/images/HYPERPC_LUMEN_5_2.png",
      "/images/HYPERPC_LUMEN_5_3.png",
    ],
    description: "Премиальный игровой ПК с высокой производительностью.",
    specs: {
      brand: "HYPERPC",
      model: "LUMEN 5",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },
  {
    id: 15,
    title: "Компьютер для офиса Start",
    category: "computers",
    price: 289990,
    images: [
      "/images/Start_Pro_1.png",
      "/images/Start_Pro_2.png",
      "/images/Start_Pro_3.png",
    ],
    description: "Компьютер для офисной работы и базовых задач.",
    specs: {
      brand: "Start",
      model: "Start Pro",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },
  {
    id: 16,
    title: "Игровой ПК Neon RTX",
    category: "computers",
    price: 1049990,
    images: [
      "/images/Neon_RTX_1.png",
      "/images/Neon_RTX_2.png",
      "/images/Neon_RTX_3.png",
    ],
    description:
      "Игровой компьютер с видеокартой RTX для максимальной графики.",
    specs: {
      brand: "Neon",
      model: "RTX",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },
  {
    id: 17,
    title: "Системный блок Ryzen 7",
    category: "computers",
    price: 579990,
    images: [
      "/images/Ryzen_7_1.png",
      "/images/Ryzen_7_2.png",
      "/images/Ryzen_7_3.png",
    ],
    description: "Производительный системный блок на базе Ryzen 7.",
    specs: {
      brand: "AMD",
      model: "Ryzen 7",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },
  {
    id: 18,
    title: "Компьютер SilverByte Home",
    category: "computers",
    price: 319990,
    images: [
      "/images/computer.png",
      "/images/computer.png",
      "/images/computer.png",
    ],
    description: "Домашний компьютер для повседневного использования.",
    specs: {
      brand: "SilverByte",
      model: "Home",
      category: "ПК",
      warranty: "12 месяцев",
    },
  },


  {
    id: 19,
    title: "Беспроводные наушники AirSound",
    category: "periphery",
    price: 69990,
    images: [
      "/images/AirSound_1.png",
      "/images/AirSound_2.png",
      "/images/AirSound_3.png",
    ],
    description: "Удобные беспроводные наушники с качественным звуком.",
    specs: {
      brand: "AirSound",
      model: "AirSound",
      category: "Аксессуар",
      warranty: "12 месяцев",
    },
  },
  {
    id: 20,
    title: "клавиатура hyperx alloy fps pro",
    category: "periphery",
    price: 49990,
    images: [
      "/images/hyperx_alloy_fps_pro_1.png",
      "/images/hyperx_alloy_fps_pro_2.png",
      "/images/hyperx_alloy_fps_pro_3.png",
    ],
    description: "Игровая механическая клавиатура HyperX.",
    specs: {
      brand: "HyperX",
      model: "Alloy FPS Pro",
      category: "Клавиатура",
      warranty: "12 месяцев",
    },
  },
  {
    id: 21,
    title: "игровая мышь hyperx pulsefire surge",
    category: "periphery",
    price: 24990,
    images: [
      "/images/hyperx_pulsefire_surge_1.png",
      "/images/hyperx_pulsefire_surge_2.png",
      "/images/hyperx_pulsefire_surge_3.png",
    ],
    description: "Игровая мышь с подсветкой и высокой точностью.",
    specs: {
      brand: "HyperX",
      model: "Pulsefire Surge",
      category: "Мышь",
      warranty: "12 месяцев",
    },
  },
  {
    id: 22,
    title: "Монитор UltraView 27",
    category: "periphery",
    price: 159990,
    images: [
      "/images/UltraView_27_1.png",
      "/images/UltraView_27_2.png",
      "/images/UltraView_27_3.png",
    ],
    description: "Монитор с высоким разрешением и качественной цветопередачей.",
    specs: {
      brand: "UltraView",
      model: "27",
      category: "Монитор",
      warranty: "12 месяцев",
    },
  },
  {
    id: 23,
    title: "Xiaomi Смарт-часы Watch S4 M2425W1",
    category: "periphery",
    price: 89990,
    images: [
      "/images/Watch_S4_M2425W1_1.png",
      "/images/Watch_S4_M2425W1_2.png",
      "/images/Watch_S4_M2425W1_3.png",
    ],
    description: "Смарт-часы Xiaomi с множеством функций.",
    specs: {
      brand: "Xiaomi",
      model: "Watch S4",
      category: "Смарт-часы",
      warranty: "12 месяцев",
    },
  },
  {
    id: 24,
    title: "колонка hopestar 26 pro",
    category: "periphery",
    price: 39990,
    images: [
      "/images/hopestar_26_pro_1.png",
      "/images/hopestar_26_pro_2.png",
      "/images/hopestar_26_pro_3.png",
    ],
    description: "Портативная колонка с мощным звуком.",
    specs: {
      brand: "Hopestar",
      model: "26 Pro",
      category: "Колонка",
      warranty: "12 месяцев",
    },
  },


  {
    id: 25,
    title: "Samsung Galaxy A55",
    category: "smartphones",
    price: 219990,
    images: [
      "/images/Samsung_Galaxy_A55_1.png",
      "/images/Samsung_Galaxy_A55_2.png",
      "/images/Samsung_Galaxy_A55_3.png",
    ],
    description: "Доступный смартфон Samsung с хорошими характеристиками.",
    specs: {
      brand: "Samsung",
      model: "Galaxy A55",
      category: "Смартфон",
      warranty: "12 месяцев",
    },
  },
  {
    id: 26,
    title: "Huawei MateBook D16",
    category: "laptops",
    price: 489990,
    images: [
      "/images/Huawei_MateBook_D16_1.png",
      "/images/Huawei_MateBook_D16_2.png",
      "/images/Huawei_MateBook_D16_3.png",
    ],
    description: "Большой ноутбук Huawei для работы и учебы.",
    specs: {
      brand: "Huawei",
      model: "MateBook D16",
      category: "Ноутбук",
      warranty: "12 месяцев",
    },
  },
  {
    id: 27,
    title: "комплект hiper fever hpk-g101",
    category: "periphery",
    price: 99990,
    images: [
      "/images/hiper_fever_hpk-g101_1.png",
      "/images/hiper_fever_hpk-g101_2.png",
      "/images/hiper_fever_hpk-g101_3.png",
    ],
    description: "Игровой комплект клавиатура + мышь.",
    specs: {
      brand: "Hiper",
      model: "Fever G101",
      category: "Комплект",
      warranty: "12 месяцев",
    },
  },
];
