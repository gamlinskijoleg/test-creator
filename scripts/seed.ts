import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	throw new Error(`Missing Supabase environment variables`)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Dummy users data with names
const dummyUsers = [
	{ email: "alice@example.com", password: "password123", name: "Alice", surname: "Johnson" },
	{ email: "bob@example.com", password: "password123", name: "Bob", surname: "Smith" },
	{ email: "charlie@example.com", password: "password123", name: "Charlie", surname: "Brown" },
	{ email: "diana@example.com", password: "password123", name: "Diana", surname: "Williams" },
	{ email: "eve@example.com", password: "password123", name: "Eve", surname: "Davis" },
]

// Test templates with questions and answers scoped to specific owners (belongsTo)
const testTemplates = [
  {
		belongsTo: "alice@example.com",
    title: "Як добре ти знаєш свого друга?",
    description: "Перевір, наскільки уважно ти слідкуєш за друзями",
    questions: [
      {
        question_text: "Яку страву ваш друг, ймовірно, вибере на вечерю?",
        order_index: 0,
        answers: [
          { answer_text: "Щось традиційне", is_correct: true },
          { answer_text: "Екзотичне", is_correct: false },
          { answer_text: "Фастфуд", is_correct: false },
          { answer_text: "Салат", is_correct: false },
        ],
      },
      {
        question_text: "Який тип музики найчастіше слухає ваш друг?",
        order_index: 1,
        answers: [
          { answer_text: "Поп", is_correct: true },
          { answer_text: "Класика", is_correct: false },
          { answer_text: "Рок", is_correct: false },
          { answer_text: "Хіп-хоп", is_correct: false },
        ],
      },
      {
        question_text: "Як ваш друг зазвичай проводить вихідні?",
        order_index: 2,
        answers: [
          { answer_text: "Вдома, відпочиваючи", is_correct: true },
          { answer_text: "Подорожі та активності", is_correct: false },
          { answer_text: "Заняття спортом", is_correct: false },
          { answer_text: "Вечірки", is_correct: false },
        ],
      },
      {
        question_text: "Що ваш друг зазвичай обирає на сніданок?",
        order_index: 3,
        answers: [
          { answer_text: "Щось просте і швидке", is_correct: true },
          { answer_text: "Щось складне і здорове", is_correct: false },
          { answer_text: "Солодке", is_correct: false },
          { answer_text: "Випічку", is_correct: false },
        ],
      },
      {
        question_text: "Як ваш друг зазвичай реагує на стрес?",
        order_index: 4,
        answers: [
          { answer_text: "Заспокоюється і аналізує", is_correct: true },
          { answer_text: "Виходить із себе", is_correct: false },
          { answer_text: "Ігнорує проблему", is_correct: false },
          { answer_text: "Шукає підтримку друзів", is_correct: false },
        ],
      },
    ],
  },
  {
		belongsTo: "alice@example.com",
    title: "Особистісні звички",
    description: "Перевірте, наскільки добре ви знаєте себе та інших",
    questions: [
      {
        question_text: "Як людина зазвичай приймає рішення?",
        order_index: 0,
        answers: [
          { answer_text: "Раціонально, зважуючи всі за і проти", is_correct: true },
          { answer_text: "Імпульсивно", is_correct: false },
          { answer_text: "Порадившись із друзями", is_correct: false },
          { answer_text: "Випадково", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай відпочиває після важкого дня?",
        order_index: 1,
        answers: [
          { answer_text: "Читає або слухає музику", is_correct: true },
          { answer_text: "Дивиться серіали чи фільми", is_correct: false },
          { answer_text: "Займається спортом", is_correct: false },
          { answer_text: "Соціалізується з друзями", is_correct: false },
        ],
      },
      {
        question_text: "Що мотивує людину діяти?",
        order_index: 2,
        answers: [
          { answer_text: "Особисті цілі і амбіції", is_correct: true },
          { answer_text: "Тиск оточення", is_correct: false },
          { answer_text: "Нагорода", is_correct: false },
          { answer_text: "Імпульсивне бажання", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай реагує на критику?",
        order_index: 3,
        answers: [
          { answer_text: "Слухає, аналізує і робить висновки", is_correct: true },
          { answer_text: "Ображається і сердиться", is_correct: false },
          { answer_text: "Ігнорує", is_correct: false },
          { answer_text: "Відповідає агресивно", is_correct: false },
        ],
      },
      {
        question_text: "Що людина зазвичай цінує у друзях?",
        order_index: 4,
        answers: [
          { answer_text: "Щирість та надійність", is_correct: true },
          { answer_text: "Популярність та статус", is_correct: false },
          { answer_text: "Веселощі і розваги", is_correct: false },
          { answer_text: "Матеріальні блага", is_correct: false },
        ],
      },
    ],
  },
  {
		belongsTo: "bob@example.com",
    title: "Тест на дружбу",
    description: "Як добре ти знаєш свого друга?",
    questions: [
      {
        question_text: "Яку пораду твій друг зазвичай дає у складних ситуаціях?",
        order_index: 0,
        answers: [
          { answer_text: "Порадити зважити всі варіанти", is_correct: true },
          { answer_text: "Зробити все на швидку руку", is_correct: false },
          { answer_text: "Ігнорувати проблему", is_correct: false },
          { answer_text: "Викликати стрес", is_correct: false },
        ],
      },
      {
        question_text: "Який улюблений спосіб провести вихідні?",
        order_index: 1,
        answers: [
          { answer_text: "Вдома з сім’єю чи друзями", is_correct: true },
          { answer_text: "Подорожі та активності", is_correct: false },
          { answer_text: "Спорт або хобі", is_correct: false },
          { answer_text: "Вечірки", is_correct: false },
        ],
      },
      {
        question_text: "Як твій друг зазвичай реагує на несподівані зміни?",
        order_index: 2,
        answers: [
          { answer_text: "Адаптується швидко", is_correct: true },
          { answer_text: "Роздратовується", is_correct: false },
          { answer_text: "Ігнорує зміни", is_correct: false },
          { answer_text: "Впадає в паніку", is_correct: false },
        ],
      },
      {
        question_text: "Що твій друг цінує найбільше?",
        order_index: 3,
        answers: [
          { answer_text: "Щирість і надійність", is_correct: true },
          { answer_text: "Популярність", is_correct: false },
          { answer_text: "Багато друзів", is_correct: false },
          { answer_text: "Матеріальні речі", is_correct: false },
        ],
      },
      {
        question_text: "Як твій друг зазвичай відпочиває після важкого дня?",
        order_index: 4,
        answers: [
          { answer_text: "Читає, слухає музику або грає в ігри", is_correct: true },
          { answer_text: "Йде на вечірку", is_correct: false },
          { answer_text: "Спить весь день", is_correct: false },
          { answer_text: "Займається спортом", is_correct: false },
        ],
      },
    ],
  },
	{
		belongsTo: "charlie@example.com",
    title: "Що ти знаєш про свого друга?",
    description: "Тест для перевірки уважності до дрібниць у поведінці друзів",
    questions: [
      {
        question_text: "Який стиль одягу найчастіше обирає твій друг?",
        order_index: 0,
        answers: [
          { answer_text: "Кежуал/повсякденний", is_correct: true },
          { answer_text: "Класичний", is_correct: false },
          { answer_text: "Спортивний", is_correct: false },
          { answer_text: "Екстравагантний", is_correct: false },
        ],
      },
      {
        question_text: "Який улюблений спосіб провести вихідні?",
        order_index: 1,
        answers: [
          { answer_text: "Вдома відпочиваючи", is_correct: true },
          { answer_text: "Подорожі", is_correct: false },
          { answer_text: "Спорт", is_correct: false },
          { answer_text: "Вечірки", is_correct: false },
        ],
      },
      {
        question_text: "Як твій друг зазвичай реагує на стрес?",
        order_index: 2,
        answers: [
          { answer_text: "Заспокоюється та аналізує ситуацію", is_correct: true },
          { answer_text: "Ображається і сердиться", is_correct: false },
          { answer_text: "Ігнорує проблему", is_correct: false },
          { answer_text: "В паніці шукає допомоги", is_correct: false },
        ],
      },
      {
        question_text: "Що зазвичай мотивує твого друга діяти?",
        order_index: 3,
        answers: [
          { answer_text: "Особисті цілі та бажання", is_correct: true },
          { answer_text: "Тиск оточення", is_correct: false },
          { answer_text: "Нагорода", is_correct: false },
          { answer_text: "Імпульсивне бажання", is_correct: false },
        ],
      },
      {
        question_text: "Що твій друг зазвичай цінує у дружбі?",
        order_index: 4,
        answers: [
          { answer_text: "Щирість та надійність", is_correct: true },
          { answer_text: "Популярність та статус", is_correct: false },
          { answer_text: "Веселощі та розваги", is_correct: false },
          { answer_text: "Матеріальні блага", is_correct: false },
        ],
      },
    ],
  },
  {
		belongsTo: "diana@example.com",
    title: "Особистісні вподобання",
    description: "Перевірте, наскільки добре ви розумієте людей загалом",
    questions: [
      {
        question_text: "Який тип книг людина зазвичай читає?",
        order_index: 0,
        answers: [
          { answer_text: "Фантастика та пригоди", is_correct: true },
          { answer_text: "Наукові праці", is_correct: false },
          { answer_text: "Саморозвиток", is_correct: false },
          { answer_text: "Романи про кохання", is_correct: false },
        ],
      },
      {
        question_text: "Який напій зазвичай обирає людина вранці?",
        order_index: 1,
        answers: [
          { answer_text: "Кава", is_correct: true },
          { answer_text: "Чай", is_correct: false },
          { answer_text: "Сік", is_correct: false },
          { answer_text: "Вода", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай відпочиває після робочого дня?",
        order_index: 2,
        answers: [
          { answer_text: "Слухає музику або дивиться серіали", is_correct: true },
          { answer_text: "Йде на прогулянку", is_correct: false },
          { answer_text: "Займається спортом", is_correct: false },
          { answer_text: "Готує або прибирає", is_correct: false },
        ],
      },
      {
        question_text: "Що зазвичай дратує людину?",
        order_index: 3,
        answers: [
          { answer_text: "Несправедливість", is_correct: true },
          { answer_text: "Тиша", is_correct: false },
          { answer_text: "Ранній підйом", is_correct: false },
          { answer_text: "Смачні страви", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай приймає рішення?",
        order_index: 4,
        answers: [
          { answer_text: "Раціонально, зважуючи всі за і проти", is_correct: true },
          { answer_text: "Імпульсивно", is_correct: false },
          { answer_text: "За порадою друзів", is_correct: false },
          { answer_text: "Випадково", is_correct: false },
        ],
      },
    ],
  },
  {
		belongsTo: "eve@example.com",
    title: "Міні-тест на соціальні звички",
    description: "Дізнайся, наскільки ти уважний до друзів та знайомих",
    questions: [
      {
        question_text: "Як людина зазвичай поводиться на вечірках?",
        order_index: 0,
        answers: [
          { answer_text: "Спостерігає і спілкується помірковано", is_correct: true },
          { answer_text: "Завжди активна та гучна", is_correct: false },
          { answer_text: "Уникає всіх", is_correct: false },
          { answer_text: "Танцює весь вечір", is_correct: false },
        ],
      },
      {
        question_text: "Як людина реагує на критику?",
        order_index: 1,
        answers: [
          { answer_text: "Слухає, аналізує і робить висновки", is_correct: true },
          { answer_text: "Ображається і сердиться", is_correct: false },
          { answer_text: "Ігнорує", is_correct: false },
          { answer_text: "Відповідає агресивно", is_correct: false },
        ],
      },
      {
        question_text: "Що людина цінує найбільше у дружбі?",
        order_index: 2,
        answers: [
          { answer_text: "Щирість і надійність", is_correct: true },
          { answer_text: "Популярність", is_correct: false },
          { answer_text: "Веселі пригоди", is_correct: false },
          { answer_text: "Матеріальні речі", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай проводить свій вільний час?",
        order_index: 3,
        answers: [
          { answer_text: "Заняття хобі або відпочинок", is_correct: true },
          { answer_text: "Просто нічого не робить", is_correct: false },
          { answer_text: "Вечірки та гуляння", is_correct: false },
          { answer_text: "Онлайн-ігри весь день", is_correct: false },
        ],
      },
      {
        question_text: "Як людина зазвичай планує свій день?",
        order_index: 4,
        answers: [
          { answer_text: "Планує заздалегідь і структуровано", is_correct: true },
          { answer_text: "Живе спонтанно", is_correct: false },
          { answer_text: "Робить все на швидку руку", is_correct: false },
          { answer_text: "Нічого не планує", is_correct: false },
        ],
      },
    ],
  },
	{
		belongsTo: "alice@example.com",
		title: "Що ти знаєш про свого друга? 2",
		description: "Перевір, наскільки уважно ти слідкуєш за друзями",
		questions: [
			{
				question_text: "Який колір одягу обирає твій друг найчастіше?",
				order_index: 0,
				answers: [
					{ answer_text: "Темні", is_correct: true },
					{ answer_text: "Яскраві", is_correct: false },
					{ answer_text: "Пастельні", is_correct: false },
					{ answer_text: "Неон", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг зазвичай їсть на обід?",
				order_index: 1,
				answers: [
					{ answer_text: "Щось швидке", is_correct: true },
					{ answer_text: "Салат", is_correct: false },
					{ answer_text: "Фастфуд", is_correct: false },
					{ answer_text: "Супи", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай проводить вечір після роботи?",
				order_index: 2,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Іде на вечірку", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Відразу лягає спати", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує в людях найбільше?",
				order_index: 3,
				answers: [
					{ answer_text: "Щирість", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Багато друзів", is_correct: false },
					{ answer_text: "Багато грошей", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай реагує на зміни?",
				order_index: 4,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Завжди протестує", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "bob@example.com",
		title: "Особистісні звички 2",
		description: "Перевірте, наскільки добре ви знаєте себе та інших",
		questions: [
			{
				question_text: "Як людина зазвичай організовує свій день?",
				order_index: 0,
				answers: [
					{ answer_text: "Планує заздалегідь", is_correct: true },
					{ answer_text: "Живе спонтанно", is_correct: false },
					{ answer_text: "Все робить на швидку руку", is_correct: false },
					{ answer_text: "Не планує нічого", is_correct: false },
				],
			},
			{
				question_text: "Що зазвичай мотивує людину?",
				order_index: 1,
				answers: [
					{ answer_text: "Особисті цілі", is_correct: true },
					{ answer_text: "Тиск оточення", is_correct: false },
					{ answer_text: "Випадкові бажання", is_correct: false },
					{ answer_text: "Гроші", is_correct: false },
				],
			},
			{
				question_text: "Як людина зазвичай реагує на стрес?",
				order_index: 2,
				answers: [
					{ answer_text: "Аналізує ситуацію", is_correct: true },
					{ answer_text: "Істерить", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Вдається до агресії", is_correct: false },
				],
			},
			{
				question_text: "Що людина зазвичай робить на вихідних?",
				order_index: 3,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Подорожує", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Вечірки", is_correct: false },
				],
			},
			{
				question_text: "Що людина цінує у друзях найбільше?",
				order_index: 4,
				answers: [
					{ answer_text: "Надійність та щирість", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "charlie@example.com",
		title: "Соціальні вподобання",
		description: "Тест на дружбу та уважність",
		questions: [
			{
				question_text: "Як людина зазвичай поводиться на вечірках?",
				order_index: 0,
				answers: [
					{ answer_text: "Спокійно, спостерігає", is_correct: true },
					{ answer_text: "Активно та гучно", is_correct: false },
					{ answer_text: "Уникає всіх", is_correct: false },
					{ answer_text: "Танцює весь вечір", is_correct: false },
				],
			},
			{
				question_text: "Як людина зазвичай реагує на критику?",
				order_index: 1,
				answers: [
					{ answer_text: "Слухає та аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Агресивно відповідає", is_correct: false },
				],
			},
			{
				question_text: "Що людина цінує у дружбі?",
				order_index: 2,
				answers: [
					{ answer_text: "Щирість і надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселі пригоди", is_correct: false },
					{ answer_text: "Матеріальні речі", is_correct: false },
				],
			},
			{
				question_text: "Як людина проводить вільний час?",
				order_index: 3,
				answers: [
					{ answer_text: "Хобі та відпочинок", is_correct: true },
					{ answer_text: "Онлайн-ігри весь день", is_correct: false },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Нічого не робить", is_correct: false },
				],
			},
			{
				question_text: "Як людина планує день?",
				order_index: 4,
				answers: [
					{ answer_text: "Планує заздалегідь", is_correct: true },
					{ answer_text: "Живе спонтанно", is_correct: false },
					{ answer_text: "Робить все на швидку руку", is_correct: false },
					{ answer_text: "Не планує нічого", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "diana@example.com",
		title: "Щоденні вподобання",
		description: "Універсальні питання про звички та рутину",
		questions: [
			{
				question_text: "Що людина зазвичай їсть на сніданок?",
				order_index: 0,
				answers: [
					{ answer_text: "Щось просте", is_correct: true },
					{ answer_text: "Складне і здорове", is_correct: false },
					{ answer_text: "Солодке", is_correct: false },
					{ answer_text: "Випічку", is_correct: false },
				],
			},
			{
				question_text: "Який напій обирає людина вранці?",
				order_index: 1,
				answers: [
					{ answer_text: "Кава", is_correct: true },
					{ answer_text: "Чай", is_correct: false },
					{ answer_text: "Сік", is_correct: false },
					{ answer_text: "Вода", is_correct: false },
				],
			},
			{
				question_text: "Що людина зазвичай робить після роботи?",
				order_index: 2,
				answers: [
					{ answer_text: "Відпочиває вдома", is_correct: true },
					{ answer_text: "Йде на прогулянку", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Готує або прибирає", is_correct: false },
				],
			},
			{
				question_text: "Що людина цінує у друзях?",
				order_index: 3,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
			{
				question_text: "Як людина зазвичай реагує на несподіванки?",
				order_index: 4,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "eve@example.com",
		title: "Реакції на стрес",
		description: "Тест на спостережливість та психологічну стійкість",
		questions: [
			{
				question_text: "Як людина реагує на критику?",
				order_index: 0,
				answers: [
					{ answer_text: "Слухає та аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Агресивно відповідає", is_correct: false },
				],
			},
			{
				question_text: "Як людина зазвичай реагує на стрес?",
				order_index: 1,
				answers: [
					{ answer_text: "Заспокоюється та аналізує", is_correct: true },
					{ answer_text: "Виходить із себе", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Шукає підтримку друзів", is_correct: false },
				],
			},
			{
				question_text: "Що допомагає людині відновитися після стресу?",
				order_index: 2,
				answers: [
					{ answer_text: "Відпочинок та хобі", is_correct: true },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Ігри онлайн", is_correct: false },
					{ answer_text: "Робота без зупинки", is_correct: false },
				],
			},
			{
				question_text: "Як людина зазвичай реагує на несподівані зміни?",
				order_index: 3,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
			{
				question_text: "Що людина цінує у дружбі найбільше?",
				order_index: 4,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "alice@example.com",
		title: "Увага до дрібниць",
		description: "Перевір, наскільки добре ти помічаєш деталі про друзів",
		questions: [
			{
				question_text: "Який улюблений колір твого друга?",
				order_index: 0,
				answers: [
					{ answer_text: "Синій", is_correct: true },
					{ answer_text: "Червоний", is_correct: false },
					{ answer_text: "Зелений", is_correct: false },
					{ answer_text: "Жовтий", is_correct: false },
				],
			},
			{
				question_text: "Який напій зазвичай обирає твій друг?",
				order_index: 1,
				answers: [
					{ answer_text: "Кава", is_correct: true },
					{ answer_text: "Чай", is_correct: false },
					{ answer_text: "Сік", is_correct: false },
					{ answer_text: "Вода", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг зазвичай робить у вільний час?",
				order_index: 2,
				answers: [
					{ answer_text: "Хобі та відпочинок", is_correct: true },
					{ answer_text: "Онлайн-ігри", is_correct: false },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на несподівані зміни?",
				order_index: 3,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує найбільше у дружбі?",
				order_index: 4,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні речі", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "bob@example.com",
		title: "Міні-тест на соціальні вподобання",
		description: "Дізнайся, наскільки добре ти знаєш соціальні звички друзів",
		questions: [
			{
				question_text: "Як твій друг поводиться на вечірках?",
				order_index: 0,
				answers: [
					{ answer_text: "Спостерігає та спілкується помірковано", is_correct: true },
					{ answer_text: "Танцює весь вечір", is_correct: false },
					{ answer_text: "Уникає всіх", is_correct: false },
					{ answer_text: "Завжди активний і гучний", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на критику?",
				order_index: 1,
				answers: [
					{ answer_text: "Слухає і аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Відповідає агресивно", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 2,
				answers: [
					{ answer_text: "Надійність і щирість", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселі пригоди", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг проводить вільний час?",
				order_index: 3,
				answers: [
					{ answer_text: "Хобі або відпочинок", is_correct: true },
					{ answer_text: "Онлайн-ігри весь день", is_correct: false },
					{ answer_text: "Вечірки та гуляння", is_correct: false },
					{ answer_text: "Нічого не робить", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг планує день?",
				order_index: 4,
				answers: [
					{ answer_text: "Планує заздалегідь", is_correct: true },
					{ answer_text: "Живе спонтанно", is_correct: false },
					{ answer_text: "Робить все на швидку руку", is_correct: false },
					{ answer_text: "Не планує нічого", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "charlie@example.com",
		title: "Тест на дружбу 2",
		description: "Дізнайся, наскільки ти уважний до друзів",
		questions: [
			{
				question_text: "Який улюблений спосіб провести вихідні твого друга?",
				order_index: 0,
				answers: [
					{ answer_text: "Вдома відпочиваючи", is_correct: true },
					{ answer_text: "Подорожі та активності", is_correct: false },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
				],
			},
			{
				question_text: "Що мотивує твого друга?",
				order_index: 1,
				answers: [
					{ answer_text: "Особисті цілі та бажання", is_correct: true },
					{ answer_text: "Тиск оточення", is_correct: false },
					{ answer_text: "Матеріальні речі", is_correct: false },
					{ answer_text: "Імпульсивні бажання", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай реагує на стрес?",
				order_index: 2,
				answers: [
					{ answer_text: "Заспокоюється та аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує проблему", is_correct: false },
					{ answer_text: "В паніці шукає допомогу", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг зазвичай цінує у дружбі?",
				order_index: 3,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі та розваги", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай відпочиває після робочого дня?",
				order_index: 4,
				answers: [
					{ answer_text: "Читає, слухає музику або грає в ігри", is_correct: true },
					{ answer_text: "Йде на вечірку", is_correct: false },
					{ answer_text: "Спить весь день", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "diana@example.com",
		title: "Що твій друг цінує?",
		description: "Універсальний тест на спостережливість",
		questions: [
			{
				question_text: "Що твій друг цінує у людях?",
				order_index: 0,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
			{
				question_text: "Яку пораду твій друг дає у складних ситуаціях?",
				order_index: 1,
				answers: [
					{ answer_text: "Зважити всі варіанти", is_correct: true },
					{ answer_text: "Діяти імпульсивно", is_correct: false },
					{ answer_text: "Ігнорувати проблему", is_correct: false },
					{ answer_text: "Робити все на швидку руку", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай відпочиває?",
				order_index: 2,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Йде на вечірку", is_correct: false },
					{ answer_text: "Спить весь день", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай реагує на стрес?",
				order_index: 3,
				answers: [
					{ answer_text: "Аналізує ситуацію", is_correct: true },
					{ answer_text: "Виходить із себе", is_correct: false },
					{ answer_text: "Ігнорує проблему", is_correct: false },
					{ answer_text: "Панікує", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг планує свій день?",
				order_index: 4,
				answers: [
					{ answer_text: "Планує заздалегідь", is_correct: true },
					{ answer_text: "Живе спонтанно", is_correct: false },
					{ answer_text: "Робить все на швидку руку", is_correct: false },
					{ answer_text: "Не планує нічого", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "eve@example.com",
		title: "Рутинні звички друзів",
		description: "Перевір, наскільки добре ти знаєш повсякденні звички друзів",
		questions: [
			{
				question_text: "Що твій друг зазвичай їсть на сніданок?",
				order_index: 0,
				answers: [
					{ answer_text: "Щось просте", is_correct: true },
					{ answer_text: "Складне і здорове", is_correct: false },
					{ answer_text: "Солодке", is_correct: false },
					{ answer_text: "Випічку", is_correct: false },
				],
			},
			{
				question_text: "Який напій обирає твій друг вранці?",
				order_index: 1,
				answers: [
					{ answer_text: "Кава", is_correct: true },
					{ answer_text: "Чай", is_correct: false },
					{ answer_text: "Сік", is_correct: false },
					{ answer_text: "Вода", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг зазвичай робить після роботи?",
				order_index: 2,
				answers: [
					{ answer_text: "Відпочиває вдома", is_correct: true },
					{ answer_text: "Йде на прогулянку", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Готує або прибирає", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на несподівані зміни?",
				order_index: 3,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 4,
				answers: [
					{ answer_text: "Щирість і надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "alice@example.com",
		title: "Соціальні взаємодії",
		description: "Перевір уважність до соціальних звичок друзів",
		questions: [
			{
				question_text: "Як твій друг зазвичай веде себе в компанії?",
				order_index: 0,
				answers: [
					{ answer_text: "Спокійно, але соціально", is_correct: true },
					{ answer_text: "Домінує і гучний", is_correct: false },
					{ answer_text: "Уникає всіх", is_correct: false },
					{ answer_text: "Веселий та активний весь час", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на компліменти?",
				order_index: 1,
				answers: [
					{ answer_text: "Скромно і вдячно", is_correct: true },
					{ answer_text: "Гордиться і хвалиться", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Сміється і міняє тему", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай відпочиває?",
				order_index: 2,
				answers: [
					{ answer_text: "Читає, слухає музику", is_correct: true },
					{ answer_text: "Йде на вечірку", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
				],
			},
			{
				question_text: "Що мотивує твого друга діяти?",
				order_index: 3,
				answers: [
					{ answer_text: "Особисті цілі", is_correct: true },
					{ answer_text: "Тиск оточення", is_correct: false },
					{ answer_text: "Матеріальна винагорода", is_correct: false },
					{ answer_text: "Імпульсивні бажання", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на критику?",
				order_index: 4,
				answers: [
					{ answer_text: "Слухає і аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Агресивно відповідає", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "bob@example.com",
		title: "Щоденні ритуали",
		description: "Перевір, наскільки добре ти знаєш звички друзів",
		questions: [
			{
				question_text: "Що твій друг зазвичай робить вранці?",
				order_index: 0,
				answers: [
					{ answer_text: "П'ється кава або чай", is_correct: true },
					{ answer_text: "Відразу їде на роботу", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Лягає спати далі", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг проводить обідню перерву?",
				order_index: 1,
				answers: [
					{ answer_text: "Їсть і відпочиває", is_correct: true },
					{ answer_text: "Працює без перерви", is_correct: false },
					{ answer_text: "Йде на прогулянку", is_correct: false },
					{ answer_text: "Спілкується з друзями", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг відпочиває після роботи?",
				order_index: 2,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Йде на вечірку", is_correct: false },
					{ answer_text: "Займається спортом", is_correct: false },
					{ answer_text: "Готує або прибирає", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на стрес?",
				order_index: 3,
				answers: [
					{ answer_text: "Заспокоюється і аналізує", is_correct: true },
					{ answer_text: "Виходить із себе", is_correct: false },
					{ answer_text: "Ігнорує проблему", is_correct: false },
					{ answer_text: "Шукає підтримку друзів", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 4,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі та розваги", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "charlie@example.com",
		title: "Особистісні риси",
		description: "Дізнайся, наскільки добре ти знаєш друзів",
		questions: [
			{
				question_text: "Як твій друг зазвичай приймає рішення?",
				order_index: 0,
				answers: [
					{ answer_text: "Раціонально", is_correct: true },
					{ answer_text: "Імпульсивно", is_correct: false },
					{ answer_text: "Під тиском", is_correct: false },
					{ answer_text: "Випадково", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг поводиться під час стресу?",
				order_index: 1,
				answers: [
					{ answer_text: "Заспокоюється і аналізує", is_correct: true },
					{ answer_text: "Виходить із себе", is_correct: false },
					{ answer_text: "Ігнорує проблему", is_correct: false },
					{ answer_text: "Шукає допомогу", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 2,
				answers: [
					{ answer_text: "Щирість і надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні речі", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг проводить вільний час?",
				order_index: 3,
				answers: [
					{ answer_text: "Хобі, читання, музика", is_correct: true },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на несподіванки?",
				order_index: 4,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "diana@example.com",
		title: "Вечірні звички",
		description: "Перевір, наскільки добре ти знаєш вечірні звички друзів",
		questions: [
			{
				question_text: "Як твій друг проводить вечір?",
				order_index: 0,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Вечірка з друзями", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
				],
			},
			{
				question_text: "Які напої обирає твій друг ввечері?",
				order_index: 1,
				answers: [
					{ answer_text: "Чай або вода", is_correct: true },
					{ answer_text: "Алкоголь", is_correct: false },
					{ answer_text: "Сік", is_correct: false },
					{ answer_text: "Кава", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг зазвичай розслабляється?",
				order_index: 2,
				answers: [
					{ answer_text: "Читання, музика, фільми", is_correct: true },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 3,
				answers: [
					{ answer_text: "Щирість і надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі", is_correct: false },
					{ answer_text: "Матеріальні речі", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на несподівані зміни?",
				order_index: 4,
				answers: [
					{ answer_text: "Адаптується швидко", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Протестує", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "eve@example.com",
		title: "Реакції на повсякденні ситуації",
		description: "Дізнайся, як добре ти знаєш реакції друзів",
		questions: [
			{
				question_text: "Як твій друг реагує на критику?",
				order_index: 0,
				answers: [
					{ answer_text: "Слухає і аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Відповідає агресивно", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг робить під час стресу?",
				order_index: 1,
				answers: [
					{ answer_text: "Аналізує ситуацію", is_correct: true },
					{ answer_text: "Панікує", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Шукає допомогу друзів", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг проводить вільний час?",
				order_index: 2,
				answers: [
					{ answer_text: "Хобі, відпочинок, музика", is_correct: true },
					{ answer_text: "Вечірки", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг планує день?",
				order_index: 3,
				answers: [
					{ answer_text: "Планує заздалегідь", is_correct: true },
					{ answer_text: "Живе спонтанно", is_correct: false },
					{ answer_text: "Робить все на швидку руку", is_correct: false },
					{ answer_text: "Не планує нічого", is_correct: false },
				],
			},
			{
				question_text: "Що твій друг цінує у дружбі?",
				order_index: 4,
				answers: [
					{ answer_text: "Щирість та надійність", is_correct: true },
					{ answer_text: "Популярність", is_correct: false },
					{ answer_text: "Веселощі та розваги", is_correct: false },
					{ answer_text: "Матеріальні блага", is_correct: false },
				],
			},
		],
	},
	{
		belongsTo: "alice@example.com",
		title: "Поведінка у групі",
		description: "Перевір, наскільки добре ти знаєш поведінку друзів у компанії",
		questions: [
			{
				question_text: "Як твій друг поводиться в новій компанії?",
				order_index: 0,
				answers: [
					{ answer_text: "Спокійно і уважно", is_correct: true },
					{ answer_text: "Домінує і гучний", is_correct: false },
					{ answer_text: "Уникає всіх", is_correct: false },
					{ answer_text: "Завжди веселий та активний", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на компліменти?",
				order_index: 1,
				answers: [
					{ answer_text: "Скромно і вдячно", is_correct: true },
					{ answer_text: "Хвалиться", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Сміється і міняє тему", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг реагує на критику?",
				order_index: 2,
				answers: [
					{ answer_text: "Слухає і аналізує", is_correct: true },
					{ answer_text: "Ображається", is_correct: false },
					{ answer_text: "Ігнорує", is_correct: false },
					{ answer_text: "Агресивно відповідає", is_correct: false },
				],
			},
			{
				question_text: "Що мотивує твого друга?",
				order_index: 3,
				answers: [
					{ answer_text: "Особисті цілі", is_correct: true },
					{ answer_text: "Тиск оточення", is_correct: false },
					{ answer_text: "Матеріальна винагорода", is_correct: false },
					{ answer_text: "Імпульсивні бажання", is_correct: false },
				],
			},
			{
				question_text: "Як твій друг проводить вечір?",
				order_index: 4,
				answers: [
					{ answer_text: "Вдома відпочиває", is_correct: true },
					{ answer_text: "Йде на вечірку", is_correct: false },
					{ answer_text: "Спорт", is_correct: false },
					{ answer_text: "Онлайн-ігри", is_correct: false },
				],
			},
		],
	},
]

async function createUser(email: string, password: string, name?: string, surname?: string) {
	const { data, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	})

	if (error) {
		console.error(`Error creating user ${email}:`, error)
		return null
	}

	console.log(`User created: ${email} (${data.user.id})`)

	// Create profile with name
	if (name || surname) {
		const { error: profileError } = await supabase.from("profiles").insert({
			user_id: data.user.id,
			name: name || null,
			surname: surname || null,
		})

		if (profileError) {
			console.error(`Error creating profile for ${email}:`, profileError)
		} else {
			console.log(`Profile created for ${email} with name: ${name || ""} ${surname || ""}`)
		}
	}

	return data.user
}

async function createTest(userId: string, template: typeof testTemplates[0], titleOverride?: string) {
	const { data: test, error: testError } = await supabase
		.from("tests")
		.insert({
			title: titleOverride || template.title,
			description: template.description,
			author_id: userId,
		})
		.select()
		.single()

	if (testError) {
		console.error(`Error creating test ${template.title}:`, testError)
		return null
	}

	const questionsToCreate = template.questions

	// Prepare all questions for batch insert
	const questionsData = questionsToCreate.map((q, i) => ({
		question_text: q.question_text,
		order_index: i,
		test_id: test.id,
	}))

	// Batch insert all questions
	const { data: questions, error: questionsError } = await supabase
		.from("questions")
		.insert(questionsData)
		.select()

	if (questionsError) {
		console.error(`Error creating questions for test ${template.title}:`, questionsError)
		return test
	}

	if (!questions || questions.length === 0) {
		return test
	}

	// Prepare all answers for batch insert
	const answersData: Array<{ answer_text: string; is_correct: boolean; question_id: string }> = []
	for (let i = 0; i < questionsToCreate.length; i++) {
		const questionTemplate = questionsToCreate[i]
		const question = questions[i]
		if (question) {
			for (const answerTemplate of questionTemplate.answers) {
				answersData.push({
					answer_text: answerTemplate.answer_text,
					is_correct: answerTemplate.is_correct,
					question_id: question.id,
				})
			}
		}
	}

	// Batch insert all answers
	if (answersData.length > 0) {
		const { error: answersError } = await supabase.from("answers").insert(answersData)

		if (answersError) {
			console.error(`Error creating answers for test ${template.title}:`, answersError)
		}
	}

	return test
}

async function seedDatabase() {
	console.log("Starting database seeding...\n")

	// Create users in parallel
	const userPromises = dummyUsers.map(userData =>
		createUser(userData.email, userData.password, userData.name, userData.surname)
	)
	const userResults = await Promise.all(userPromises)
	const users = userResults.filter((user): user is NonNullable<typeof user> => user !== null)

	if (users.length === 0) {
		console.error("No users were created. Aborting seeding.")
		return
	}

	console.log(`\nCreated ${users.length} users\n`)

	// Map templates to owners to avoid duplicates across users
	const templatesByOwner = testTemplates.reduce<Record<string, typeof testTemplates>>((acc, template) => {
		if (!template.belongsTo) {
			return acc
		}
		const key = template.belongsTo.toLowerCase()
		acc[key] = acc[key] ? [...acc[key], template] : [template]
		return acc
	}, {})

	// Create tests only for templates that belong to each user
	let totalTests = 0
	for (const user of users) {
		const userEmail = user.email?.toLowerCase()
		if (!userEmail) {
			console.warn("User without email encountered, skipping test creation.")
			continue
		}
		const userKey = userEmail
		const userTemplates = templatesByOwner[userKey] || []

		if (userTemplates.length === 0) {
			console.log(`No templates assigned to ${user.email}, skipping.`)
			continue
		}

		const results = await Promise.all(userTemplates.map(template => createTest(user.id, template, template.title)))
		const createdCount = results.filter(test => test !== null).length
		totalTests += createdCount

		console.log(`Created ${createdCount} tests for user ${user.email}`)
	}

	console.log(`\n✅ Seeding completed!`)
	console.log(`   - Users created: ${users.length}`)
	console.log(`   - Tests created: ${totalTests}`)
}

seedDatabase()
	.then(() => {
		console.log("\nSeeding script finished.")
		process.exit(0)
	})
	.catch(error => {
		console.error("Error during seeding:", error)
		process.exit(1)
	})

