import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing Supabase environment variables`)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const tables = [
  'given_answers',
  'answers',
  'questions',
  'test_results',
  'tests',
  'profiles',
]

async function resetDB() {
  try {
    for (const table of tables) {
      const { error } = await supabase.rpc('execute_sql', {
        sql: `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`
      })
      if (error) {
        console.error(`Помилка очищення таблиці ${table}:`, error)
      } else {
        console.log(`Таблиця ${table} очищена`)
      }
    }
    console.log('Усі таблиці успішно очищені!')
  } catch (err) {
    console.error('Помилка при очищенні БД:', err)
  }
}

async function deleteAllUsers() {
  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error('Помилка при отриманні користувачів:', error)
    return
  }

  for (const user of users.users) {
    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
    if (delErr) console.error('Помилка при видаленні користувача:', delErr)
    else console.log('Користувач видалений:', user.id)
  }

  console.log('Всі користувачі auth.users видалені!')
}

resetDB()
deleteAllUsers()