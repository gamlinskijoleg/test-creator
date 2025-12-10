# Database Migrations

## Creating the profiles table

To add the user profiles table to your Supabase database, run the SQL migration file:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `create_profiles_table.sql`
4. Execute the SQL

Alternatively, you can use the Supabase CLI:

```bash
supabase db push
```

## What this migration creates:

- **profiles table** with fields:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to auth.users)
  - `name` (TEXT, nullable)
  - `surname` (TEXT, nullable)
  - `birthdate` (DATE, nullable)
  - `pronouns` (TEXT, nullable)
  - `city` (TEXT, nullable)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

- **Row Level Security (RLS)** policies:
  - Users can only view, insert, update, and delete their own profile

- **Automatic timestamp updates** via trigger function

## After running the migration:

1. Regenerate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
   ```

2. Or manually add the profiles table to your `src/types/supabase.ts` file

