// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hacgnwgpevlerwzcoawu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY2dud2dwZXZsZXJ3emNvYXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzg0NzYsImV4cCI6MjA2MDk1NDQ3Nn0.zvwiZ1EfWLaY1CIUthrJZsRd_09kfb-lGzIkBh98T_E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);