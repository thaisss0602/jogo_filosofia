// ===================== CONFIGURAÇÃO DO SUPABASE =====================
// Substitua os valores abaixo pelos dados do SEU projeto Supabase.
// Você encontra esses valores em: Project Settings > API
//
// SUPABASE_URL  -> "Project URL"
// SUPABASE_KEY  -> "anon public" key (NUNCA use a "service_role" key aqui,
//                   pois este código fica visível no navegador)

const SUPABASE_URL = "https://dtnvrwtsmbqmohkfusog.supabase.co";
const SUPABASE_KEY = "sb_publishable_dK710vh0wU8XjzNGrXFtVQ_xdlLUs5x";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
