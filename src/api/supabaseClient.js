import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://twpkquobvmiolaibaxtj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cGtxdW9idm1pb2xhaWJheHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODI4OTIsImV4cCI6MjEwMDY1ODg5Mn0.Goa91X92c_qny5MpHac1nIRtEsfWOeAaPj708hvJdtM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;
