import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	throw new Error(`Missing Supabase environment variables: URL: ${supabaseUrl}, KEY: ${supabaseKey}`)
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

// Test templates with questions and answers
const testTemplates = [
  {
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
];

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

async function createTest(userId: string, template: typeof testTemplates[0], maxQuestions: number = 2) {
	const { data: test, error: testError } = await supabase
		.from("tests")
		.insert({
			title: template.title,
			description: template.description,
			author_id: userId,
		})
		.select()
		.single()

	if (testError) {
		console.error(`Error creating test ${template.title}:`, testError)
		return null
	}

	// Limit questions to maxQuestions (default 2)
	const questionsToCreate = template.questions.slice(0, maxQuestions)

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

	// Create tests for each user with parallelization
	// Create many tests with at most 2 questions each
	let totalTests = 0
	const BATCH_SIZE = 10 // Process tests in batches to avoid overwhelming the database

	for (let i = 0; i < users.length; i++) {
		const user = users[i]
		// Each user gets 8-12 tests (much more than before)
		const testsPerUser = Math.floor(Math.random() * 5) + 8
		const shuffledTemplates = [...testTemplates].sort(() => Math.random() - 0.5)

		// Prepare all test creation promises
		const testPromises = []
		for (let j = 0; j < testsPerUser; j++) {
			const templateIndex = j % shuffledTemplates.length
			const template = shuffledTemplates[templateIndex]
			testPromises.push(createTest(user.id, template, 2))
		}

		// Process tests in batches for better performance
		for (let batchStart = 0; batchStart < testPromises.length; batchStart += BATCH_SIZE) {
			const batch = testPromises.slice(batchStart, batchStart + BATCH_SIZE)
			const results = await Promise.all(batch)
			totalTests += results.filter(test => test !== null).length
		}

		console.log(`Created ${testsPerUser} tests for user ${user.email}`)
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

