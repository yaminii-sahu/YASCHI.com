/**
 * Yaschi E-Commerce — Supabase Configuration & Client Loader
 * Provides connection to Supabase backend with offline/localStorage fallback.
 */

const SUPABASE_CONFIG = {
    // Default or configured credentials stored in localStorage
    getUrl: () => localStorage.getItem('yaschi_supabase_url') || '',
    getKey: () => localStorage.getItem('yaschi_supabase_key') || '',
    
    // Check if credentials are set
    isConfigured: function() {
        return Boolean(this.getUrl() && this.getKey());
    },

    // Save credentials from Admin Settings
    saveCredentials: function(url, key) {
        if (url) localStorage.setItem('yaschi_supabase_url', url.trim());
        if (key) localStorage.setItem('yaschi_supabase_key', key.trim());
    },

    // Clear credentials
    clearCredentials: function() {
        localStorage.removeItem('yaschi_supabase_url');
        localStorage.removeItem('yaschi_supabase_key');
    }
};

let _supabaseClient = null;

/**
 * Initialize and get the Supabase Client if configured
 */
function getSupabaseClient() {
    if (_supabaseClient) return _supabaseClient;
    
    if (SUPABASE_CONFIG.isConfigured() && window.supabase) {
        try {
            _supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.getUrl(),
                SUPABASE_CONFIG.getKey()
            );
            return _supabaseClient;
        } catch (err) {
            console.warn('[Yaschi] Failed to initialize Supabase client:', err);
            return null;
        }
    }
    return null;
}

window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.getSupabaseClient = getSupabaseClient;
