/**
 * ============================================================================
 * THEME-TOGGLE.JS - Jardín Digital
 * Sistema de cambio de tema claro/oscuro
 * ============================================================================
 */

(function() {
  'use strict';
  
  // -------------------------------------------------------------------------
  // Constantes
  // -------------------------------------------------------------------------
  const STORAGE_KEY = 'theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  
  // -------------------------------------------------------------------------
  // Obtener tema inicial
  // -------------------------------------------------------------------------
  function getInitialTheme() {
    // Primero verificar localStorage
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    
    // Si no hay preferencia guardada, usar preferencia del sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    
    return THEME_LIGHT;
  }
  
  // -------------------------------------------------------------------------
  // Aplicar tema
  // -------------------------------------------------------------------------
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEME_DARK ? '#0f0f23' : '#4361ee');
    }
    
    // Actualizar Mermaid si está presente
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({
        theme: theme === THEME_DARK ? 'dark' : 'default'
      });
    }
  }
  
  // -------------------------------------------------------------------------
  // Toggle tema
  // -------------------------------------------------------------------------
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(newTheme);
  }
  
  // -------------------------------------------------------------------------
  // Inicialización
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    // Configurar botón de toggle
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Solo cambiar automáticamente si el usuario no ha elegido manualmente
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  });
  
  // -------------------------------------------------------------------------
  // Aplicar tema inmediatamente (antes del DOM)
  // -------------------------------------------------------------------------
  setTheme(getInitialTheme());
  
})();
