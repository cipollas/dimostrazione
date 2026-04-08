-- Add app_id column to all relevant tables for multi-app separation
-- This allows separating data between: app_pionieri, chat_pionieri, marketplace, chat_bot_develop

-- Define app IDs:
-- 'app_pionieri' - This app (App Pionieri)
-- 'chat_pionieri' - Chat Pionieri app
-- 'marketplace' - Marketplace app
-- 'chat_bot_develop' - Chat Bot Develop app

-- Add app_id to pi_users
ALTER TABLE public.pi_users ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Add app_id to access_logs  
ALTER TABLE public.access_logs ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Add app_id to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Add app_id to banned_users
ALTER TABLE public.banned_users ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Add app_id to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Add app_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS app_id TEXT DEFAULT 'app_pionieri';

-- Create indexes for faster queries by app_id
CREATE INDEX IF NOT EXISTS idx_pi_users_app_id ON public.pi_users(app_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_app_id ON public.access_logs(app_id);
CREATE INDEX IF NOT EXISTS idx_messages_app_id ON public.messages(app_id);
CREATE INDEX IF NOT EXISTS idx_banned_users_app_id ON public.banned_users(app_id);
CREATE INDEX IF NOT EXISTS idx_donations_app_id ON public.donations(app_id);
CREATE INDEX IF NOT EXISTS idx_profiles_app_id ON public.profiles(app_id);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_access_logs_app_date ON public.access_logs(app_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_app_created ON public.messages(app_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_donations_app_status ON public.donations(app_id, status);
