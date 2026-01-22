// ضع بيانات مشروع Supabase هنا
export const SUPABASE_URL = "https://ulgmihfmxrrwxaazpake.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ21paGZteHJyd3hhYXpwYWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNDUwMDYsImV4cCI6MjA4NDYyMTAwNn0.E9RabOtf2TvY7nGP6U4YFKJynuKtlxhPDTFN8H3YfBI";

// Auth redirect for reset password
export const RESET_PASSWORD_REDIRECT = `${location.origin}/reset-password.html`;

// Edge Functions (اختياري) - ضعها إذا كنت نشرت availability/create-booking
export const FN_AVAILABILITY = `${SUPABASE_URL}/functions/v1/availability`;
export const FN_CREATE_BOOKING = `${SUPABASE_URL}/functions/v1/create-booking`;
export const FN_REGISTER_SALON = `${SUPABASE_URL}/functions/v1/register-salon`;
