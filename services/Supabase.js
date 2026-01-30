import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config( { path: '.env' } );

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);