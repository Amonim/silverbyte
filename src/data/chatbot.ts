export interface ChatBotItem {
    id: string;
    title: string;
    answer?: string;
    children?: ChatBotItem[];
}

export const chatbotData: ChatBotItem[] = [
    {
        id: "delivery",
        title: "Доставка",
        children: [
            {
                id: "delivery-time",
                title: "Сколько длится доставка?",
                answer: "Доставка занимает от 1 до 5 рабочих дней в зависимости от города."
            },
            {
                id: "delivery-price",
                title: "Сколько стоит доставка?",
                answer: "Доставка бесплатная при заказе от 50 000 ₸."
            },
            {
                id: "delivery-change",
                title: "Можно изменить адрес?",
                answer: "Да, вы можете изменить адрес до отправки заказа."
            }
        ]
    },
    {
        id: "orders",
        title: "Заказы",
        children: [
            {
                id: "orders-where",
                title: "Где посмотреть мои заказы?",
                answer: "Вы можете посмотреть все заказы в личном кабинете."
            },
            {
                id: "orders-status",
                title: "Что значит статус заказа?",
                answer: "Статус 'в обработке' означает, что заказ готовится к отправке."
            },
            {
                id: "orders-cancel",
                title: "Можно отменить заказ?",
                answer: "Да, пока заказ не отправлен, его можно отменить."
            }
        ]
    },
    {
        id: "account",
        title: "Аккаунт",
        children: [
            {
                id: "account-register",
                title: "Как зарегистрироваться?",
                answer: "Нажмите кнопку 'Регистрация' в правом верхнем углу."
            },
            {
                id: "account-login",
                title: "Как войти?",
                answer: "Используйте свою почту и пароль для входа."
            },
            {
                id: "account-profile",
                title: "Что есть в профиле?",
                answer: "В профиле отображаются ваши заказы, баллы и достижения."
            }
        ]
    },
    {
        id: "payment",
        title: "Оплата",
        children: [
            {
                id: "payment-method",
                title: "Какие способы оплаты?",
                answer: "Сейчас доступна оплата при получении."
            }
        ]
    },
    {
        id: "support",
        title: "Поддержка",
        children: [
            {
                id: "support-contact",
                title: "Как связаться с поддержкой?",
                answer: "Вы можете написать нам на почту support@silverbyte.kz"
            }
        ]
    }
];