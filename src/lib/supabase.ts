import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Certificate = {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  verification_url: string;
  image_url: string;
  category: string;
  tags: string[];
};