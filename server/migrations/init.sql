
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    is_blocked BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    images JSONB NOT NULL,
    description TEXT NOT NULL,
    specs JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal INTEGER NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    customer_info JSONB NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_prefix VARCHAR(100),
    user_email VARCHAR(255),
    xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(255) NOT NULL,
    UNIQUE(user_id, achievement_key)
);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (1, 'iPhone 15 Pro', 'smartphones', 649990, '["/images/iphone_15_pro_1.png","/images/iphone_15_pro_2.png","/images/iphone_15_pro_3.png"]', 'Флагманский смартфон Apple с мощным процессором, премиальным корпусом и продвинутой камерой.', '{"brand":"Apple","model":"iPhone 15 Pro","category":"smartphones","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (2, 'Samsung Galaxy S24', 'smartphones', 529990, '["/images/Samsung_Galaxy_S24_1.png","/images/Samsung_Galaxy_S24_2.png","/images/Samsung_Galaxy_S24_3.png"]', 'Современный смартфон Samsung с ярким дисплеем, высокой производительностью и стильным дизайном.', '{"brand":"Samsung","model":"Galaxy S24","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (3, 'Xiaomi 14', 'smartphones', 389990, '["/images/Xiaomi_14_1.png","/images/Xiaomi_14_2.png","/images/Xiaomi_14_3.png"]', 'Флагман Xiaomi с высокой производительностью, стильным дизайном и отличной камерой.', '{"brand":"Xiaomi","model":"Xiaomi 14","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (4, 'Google Pixel 8', 'smartphones', 419990, '["/images/Google_Pixel_8_1.png","/images/Google_Pixel_8_2.png","/images/Google_Pixel_8_3.png"]', 'Смартфон Google с чистым Android и отличной камерой для фото и видео.', '{"brand":"Google","model":"Pixel 8","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (5, 'Honor Magic 6', 'smartphones', 359990, '["/images/Honor_Magic_6_1.png","/images/Honor_Magic_6_2.png","/images/Honor_Magic_6_3.png"]', 'Современный смартфон Honor с мощным процессором и ярким дисплеем.', '{"brand":"Honor","model":"Magic 6","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (6, 'OnePlus 12', 'smartphones', 449990, '["/images/OnePlus_12_1.png","/images/OnePlus_12_2.png","/images/OnePlus_12_3.png"]', 'Быстрый и плавный смартфон OnePlus с высокой производительностью.', '{"brand":"OnePlus","model":"OnePlus 12","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (7, 'MacBook Air M3', 'laptops', 729990, '["/images/MacBook Air_M3_1.png","/images/MacBook Air_M3_2.png","/images/MacBook Air_M3_3.png"]', 'Лёгкий и мощный ноутбук Apple с процессором M3.', '{"brand":"Apple","model":"MacBook Air M3","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (8, 'ASUS Zenbook 14', 'laptops', 559990, '["/images/ASUS Zenbook_14_1.png","/images/ASUS Zenbook_14_2.png","/images/ASUS Zenbook_14_3.png"]', 'Тонкий и стильный ноутбук ASUS для работы и учебы.', '{"brand":"ASUS","model":"Zenbook 14","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (9, 'Lenovo IdeaPad 5', 'laptops', 399990, '["/images/Lenovo_IdeaPad_5_1.png","/images/Lenovo_IdeaPad_5_2.png","/images/Lenovo_IdeaPad_5_3.png"]', 'Надежный ноутбук Lenovo для повседневных задач.', '{"brand":"Lenovo","model":"IdeaPad 5","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (10, 'HP Pavilion 15', 'laptops', 429990, '["/images/HP_Pavilion_15_1.png","/images/HP_Pavilion_15_2.png","/images/HP_Pavilion_15_3.png"]', 'Универсальный ноутбук HP для работы и развлечений.', '{"brand":"HP","model":"Pavilion 15","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (11, 'Acer Swift X', 'laptops', 469990, '["/images/Acer_Swift_X_1.png","/images/Acer_Swift_X_2.png","/images/Acer_Swift_X_3.png"]', 'Мощный ноутбук Acer для работы и игр.', '{"brand":"Acer","model":"Swift X","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (12, 'MSI Modern 14', 'laptops', 379990, '["/images/MSI_Modern_14_1.png","/images/MSI_Modern_14_2.png","/images/MSI_Modern_14_3.png"]', 'Компактный ноутбук MSI с хорошей производительностью.', '{"brand":"MSI","model":"Modern 14","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (13, 'Игровой ПК Storm X', 'computers', 899990, '["/images/Storm_X_1.png","/images/Storm_X_2.png","/images/Storm_X_3.png"]', 'Мощный игровой компьютер для современных игр.', '{"brand":"Storm","model":"Storm X","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (14, 'HYPERPC LUMEN 5', 'computers', 1649990, '["/images/HYPERPC_LUMEN_5_1.png","/images/HYPERPC_LUMEN_5_2.png","/images/HYPERPC_LUMEN_5_3.png"]', 'Премиальный игровой ПК с высокой производительностью.', '{"brand":"HYPERPC","model":"LUMEN 5","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (15, 'Компьютер для офиса Start', 'computers', 289990, '["/images/Start_Pro_1.png","/images/Start_Pro_2.png","/images/Start_Pro_3.png"]', 'Компьютер для офисной работы и базовых задач.', '{"brand":"Start","model":"Start Pro","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (16, 'Игровой ПК Neon RTX', 'computers', 1049990, '["/images/Neon_RTX_1.png","/images/Neon_RTX_2.png","/images/Neon_RTX_3.png"]', 'Игровой компьютер с видеокартой RTX для максимальной графики.', '{"brand":"Neon","model":"RTX","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (17, 'Системный блок Ryzen 7', 'computers', 579990, '["/images/Ryzen_7_1.png","/images/Ryzen_7_2.png","/images/Ryzen_7_3.png"]', 'Производительный системный блок на базе Ryzen 7.', '{"brand":"AMD","model":"Ryzen 7","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (18, 'Компьютер SilverByte Home', 'computers', 319990, '["/images/computer.png","/images/computer.png","/images/computer.png"]', 'Домашний компьютер для повседневного использования.', '{"brand":"SilverByte","model":"Home","category":"ПК","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (19, 'Беспроводные наушники AirSound', 'periphery', 69990, '["/images/AirSound_1.png","/images/AirSound_2.png","/images/AirSound_3.png"]', 'Удобные беспроводные наушники с качественным звуком.', '{"brand":"AirSound","model":"AirSound","category":"Аксессуар","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (20, 'клавиатура hyperx alloy fps pro', 'periphery', 49990, '["/images/hyperx_alloy_fps_pro_1.png","/images/hyperx_alloy_fps_pro_2.png","/images/hyperx_alloy_fps_pro_3.png"]', 'Игровая механическая клавиатура HyperX.', '{"brand":"HyperX","model":"Alloy FPS Pro","category":"Клавиатура","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (21, 'игровая мышь hyperx pulsefire surge', 'periphery', 24990, '["/images/hyperx_pulsefire_surge_1.png","/images/hyperx_pulsefire_surge_2.png","/images/hyperx_pulsefire_surge_3.png"]', 'Игровая мышь с подсветкой и высокой точностью.', '{"brand":"HyperX","model":"Pulsefire Surge","category":"Мышь","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (22, 'Монитор UltraView 27', 'periphery', 159990, '["/images/UltraView_27_1.png","/images/UltraView_27_2.png","/images/UltraView_27_3.png"]', 'Монитор с высоким разрешением и качественной цветопередачей.', '{"brand":"UltraView","model":"27","category":"Монитор","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (23, 'Xiaomi Смарт-часы Watch S4 M2425W1', 'periphery', 89990, '["/images/Watch_S4_M2425W1_1.png","/images/Watch_S4_M2425W1_2.png","/images/Watch_S4_M2425W1_3.png"]', 'Смарт-часы Xiaomi с множеством функций.', '{"brand":"Xiaomi","model":"Watch S4","category":"Смарт-часы","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (24, 'колонка hopestar 26 pro', 'periphery', 39990, '["/images/hopestar_26_pro_1.png","/images/hopestar_26_pro_2.png","/images/hopestar_26_pro_3.png"]', 'Портативная колонка с мощным звуком.', '{"brand":"Hopestar","model":"26 Pro","category":"Колонка","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (25, 'Samsung Galaxy A55', 'smartphones', 219990, '["/images/Samsung_Galaxy_A55_1.png","/images/Samsung_Galaxy_A55_2.png","/images/Samsung_Galaxy_A55_3.png"]', 'Доступный смартфон Samsung с хорошими характеристиками.', '{"brand":"Samsung","model":"Galaxy A55","category":"Смартфон","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (26, 'Huawei MateBook D16', 'laptops', 489990, '["/images/Huawei_MateBook_D16_1.png","/images/Huawei_MateBook_D16_2.png","/images/Huawei_MateBook_D16_3.png"]', 'Большой ноутбук Huawei для работы и учебы.', '{"brand":"Huawei","model":"MateBook D16","category":"Ноутбук","warranty":"12 месяцев"}');
        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (27, 'комплект hiper fever hpk-g101', 'periphery', 99990, '["/images/hiper_fever_hpk-g101_1.png","/images/hiper_fever_hpk-g101_2.png","/images/hiper_fever_hpk-g101_3.png"]', 'Игровой комплект клавиатура + мышь.', '{"brand":"Hiper","model":"Fever G101","category":"Комплект","warranty":"12 месяцев"}');

        PERFORM setval('products_id_seq', (SELECT MAX(id) FROM products));
    END IF;
END $$;
