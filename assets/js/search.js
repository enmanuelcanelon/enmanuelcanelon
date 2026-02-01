/**
 * ============================================================================
 * SEARCH.JS - Jardín Digital
 * Sistema de búsqueda con Lunr.js
 * ============================================================================
 */

(function() {
  'use strict';
  
  // -------------------------------------------------------------------------
  // Variables globales
  // -------------------------------------------------------------------------
  let searchIndex = null;
  let searchData = [];
  let currentFocus = -1;
  
  // -------------------------------------------------------------------------
  // Elementos del DOM
  // -------------------------------------------------------------------------
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  // -------------------------------------------------------------------------
  // Cargar índice de búsqueda
  // -------------------------------------------------------------------------
  async function loadSearchIndex() {
    if (searchIndex) return;
    
    try {
      const response = await fetch('/search.json');
      searchData = await response.json();
      
      // Crear índice de Lunr
      searchIndex = lunr(function() {
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('category', { boost: 5 });
        this.field('tags', { boost: 5 });
        this.field('collection', { boost: 3 });
        
        // Soporte para español
        this.pipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.stopWordFilter);
        
        searchData.forEach(doc => {
          this.add({
            url: doc.url,
            title: doc.title,
            content: doc.content,
            category: doc.category || '',
            tags: doc.tags ? doc.tags.join(' ') : '',
            collection: doc.collection
          });
        });
      });
      
    } catch (error) {
      console.error('Error cargando índice de búsqueda:', error);
    }
  }
  
  // -------------------------------------------------------------------------
  // Abrir/Cerrar modal
  // -------------------------------------------------------------------------
  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
    loadSearchIndex();
  }
  
  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = getPlaceholderHTML();
    document.body.style.overflow = '';
    currentFocus = -1;
  }
  
  // -------------------------------------------------------------------------
  // Realizar búsqueda
  // -------------------------------------------------------------------------
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = getPlaceholderHTML();
      return;
    }
    
    if (!searchIndex) {
      searchResults.innerHTML = '<div class="search-no-results">Cargando índice...</div>';
      return;
    }
    
    try {
      // Búsqueda con wildcards para resultados parciales
      const results = searchIndex.search(query + '*');
      
      if (results.length === 0) {
        searchResults.innerHTML = `
          <div class="search-no-results">
            <p>No se encontraron resultados para "<strong>${escapeHtml(query)}</strong>"</p>
            <p>Intenta con otros términos</p>
          </div>
        `;
        return;
      }
      
      // Renderizar resultados
      const html = results.slice(0, 10).map(result => {
        const doc = searchData.find(d => d.url === result.ref);
        if (!doc) return '';
        
        // Resaltar coincidencias en el excerpt
        let excerpt = doc.content || '';
        const queryLower = query.toLowerCase();
        const index = excerpt.toLowerCase().indexOf(queryLower);
        
        if (index > -1) {
          const start = Math.max(0, index - 40);
          const end = Math.min(excerpt.length, index + query.length + 60);
          excerpt = (start > 0 ? '...' : '') + 
                    excerpt.slice(start, end) + 
                    (end < excerpt.length ? '...' : '');
          
          // Resaltar término
          excerpt = excerpt.replace(
            new RegExp(`(${escapeRegExp(query)})`, 'gi'),
            '<mark>$1</mark>'
          );
        } else {
          excerpt = excerpt.slice(0, 100) + '...';
        }
        
        return `
          <a href="${doc.url}" class="search-result-item">
            <div class="search-result-title">${escapeHtml(doc.title)}</div>
            <div class="search-result-meta">
              <span class="search-result-collection">${doc.collection}</span>
              ${doc.category ? `<span>${doc.category}</span>` : ''}
            </div>
            <div class="search-result-excerpt">${excerpt}</div>
          </a>
        `;
      }).join('');
      
      searchResults.innerHTML = html || getPlaceholderHTML();
      currentFocus = -1;
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      searchResults.innerHTML = '<div class="search-no-results">Error al buscar</div>';
    }
  }
  
  // -------------------------------------------------------------------------
  // Navegación con teclado
  // -------------------------------------------------------------------------
  function handleKeyboardNavigation(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentFocus++;
      if (currentFocus >= items.length) currentFocus = 0;
      setFocus(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentFocus--;
      if (currentFocus < 0) currentFocus = items.length - 1;
      setFocus(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click();
      }
    }
  }
  
  function setFocus(items) {
    items.forEach((item, index) => {
      if (index === currentFocus) {
        item.classList.add('focused');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('focused');
      }
    });
  }
  
  // -------------------------------------------------------------------------
  // HTML del placeholder
  // -------------------------------------------------------------------------
  function getPlaceholderHTML() {
    return `
      <div class="search-placeholder">
        <p>Escribe para buscar notas, artículos y reseñas...</p>
        <div class="search-tips">
          <span class="tip">💡 Puedes buscar por título, contenido o tags</span>
        </div>
      </div>
    `;
  }
  
  // -------------------------------------------------------------------------
  // Utilidades
  // -------------------------------------------------------------------------
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // -------------------------------------------------------------------------
  // Event Listeners
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    if (!searchToggle || !searchModal) return;
    
    // Abrir con botón
    searchToggle.addEventListener('click', openSearch);
    
    // Cerrar con overlay
    if (searchOverlay) {
      searchOverlay.addEventListener('click', closeSearch);
    }
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });
    
    // Abrir con Ctrl+K
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchModal.classList.contains('active')) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    });
    
    // Búsqueda con debounce
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function() {
        performSearch(this.value.trim());
      }, 200));
      
      // Navegación con teclado
      searchInput.addEventListener('keydown', handleKeyboardNavigation);
    }
  });
  
})();
