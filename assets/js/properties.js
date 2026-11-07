/**
 * Right Asset's Property Consultants - Properties Listing Script
 * Implements real-time filtering, Borivali/Kandivali/Malad micro-market search,
 * Resale (50) & Rent (50) controls, sorting, and pagination across 100 properties.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const container = document.getElementById("properties-listing-container");
  const resultsCounter = document.getElementById("results-counter");
  const searchInput = document.getElementById("filter-keyword");
  const locationSelect = document.getElementById("filter-location");
  const sortSelect = document.getElementById("filter-sort");
  const resetBtn = document.getElementById("btn-reset-filters");
  const gridViewBtn = document.getElementById("btn-view-grid");
  const listViewBtn = document.getElementById("btn-view-list");
  const priceSlider = document.getElementById("filter-price-slider");
  const priceSliderVal = document.getElementById("filter-price-val");
  const paginationContainer = document.getElementById("properties-pagination");

  // Read URL params initially
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category");
  const initialPurpose = urlParams.get("purpose");
  const initialLocation = urlParams.get("location");
  const initialMaxPrice = urlParams.get("maxPrice");

  // State object
  const filterState = {
    keyword: "",
    category: initialCategory || "all",
    purpose: initialPurpose || "all",
    location: initialLocation || "all",
    bedrooms: "all",
    maxPrice: initialMaxPrice ? parseFloat(initialMaxPrice) : 300000000,
    sortBy: "featured",
    viewMode: "grid",
    currentPage: 1,
    perPage: 12
  };

  // Sync inputs with URL params
  if (initialLocation && locationSelect) {
    locationSelect.value = initialLocation;
  }
  if (initialCategory) {
    const catRadio = document.querySelector(`input[name="filter-category"][value="${initialCategory}"]`);
    if (catRadio) catRadio.checked = true;
  }
  if (initialPurpose) {
    const purposeRadio = document.querySelector(`input[name="filter-purpose"][value="${initialPurpose}"]`);
    if (purposeRadio) purposeRadio.checked = true;
  }

  function formatPriceDisplay(num) {
    if (num >= 10000000) {
      return "Up to ₹ " + (num / 10000000).toFixed(1) + " Cr";
    }
    return "Up to ₹ " + (num / 100000).toFixed(0) + " Lakh";
  }

  // Filter application logic
  function applyFilters() {
    if (typeof PROPERTIES_DATA === "undefined") return;

    let filtered = PROPERTIES_DATA.filter(p => {
      // 1. Keyword search
      if (filterState.keyword) {
        const q = filterState.keyword.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesZone = (p.zone || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesZone) return false;
      }

      // 2. Category
      if (filterState.category !== "all" && p.category !== filterState.category) {
        return false;
      }

      // 3. Purpose (buy/resale or rent)
      if (filterState.purpose !== "all" && p.purpose !== filterState.purpose) {
        return false;
      }

      // 4. Location / Zone
      if (filterState.location !== "all") {
        const locLower = filterState.location.toLowerCase();
        const propLocLower = p.location.toLowerCase();
        const propZoneLower = (p.zone || "").toLowerCase();
        if (!propLocLower.includes(locLower) && !propZoneLower.includes(locLower)) {
          return false;
        }
      }

      // 5. Bedrooms
      if (filterState.bedrooms !== "all") {
        const beds = parseInt(filterState.bedrooms);
        if (beds === 4 && p.bedrooms < 4) return false;
        if (beds !== 4 && p.bedrooms !== beds) return false;
      }

      // 6. Max Price
      if (p.price > filterState.maxPrice) {
        return false;
      }

      return true;
    });

    // Sort results
    if (filterState.sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filterState.sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filterState.sortBy === "area-desc") {
      filtered.sort((a, b) => b.area - a.area);
    } else {
      // Featured first
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    renderFilteredListings(filtered);
  }

  // Render cards with pagination
  function renderFilteredListings(list) {
    if (!container) return;

    const totalResults = list.length;
    const totalPages = Math.ceil(totalResults / filterState.perPage) || 1;

    // Boundary check for current page
    if (filterState.currentPage > totalPages) {
      filterState.currentPage = 1;
    }

    const startIndex = (filterState.currentPage - 1) * filterState.perPage;
    const endIndex = startIndex + filterState.perPage;
    const paginatedList = list.slice(startIndex, endIndex);

    if (resultsCounter) {
      const showStart = totalResults === 0 ? 0 : startIndex + 1;
      const showEnd = Math.min(endIndex, totalResults);
      resultsCounter.innerHTML = `Showing <strong>${showStart}-${showEnd}</strong> of <strong>${totalResults}</strong> Properties in Borivali, Kandivali & Malad`;
    }

    if (totalResults === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--gold-border);">
          <i class="fa-solid fa-building-circle-xmark" style="font-size: 3rem; color: var(--gold-400); margin-bottom: 1rem;"></i>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-bottom: 0.5rem;">No Properties Found Matching Your Search</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem;">Try relaxing your budget or location filters. Sanjeev Mehta and Nutan Madam can also source exclusive unlisted properties across Kandivali, Borivali, and Malad.</p>
          <button class="btn btn-primary-gold" onclick="document.getElementById('btn-reset-filters').click();">Reset All Filters</button>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = "";
      return;
    }

    container.className = filterState.viewMode === "grid" 
      ? "properties-grid" 
      : "properties-grid list-layout-view";

    container.innerHTML = paginatedList.map(p => createPropertyCardHTML(p)).join("");
    attachFavoriteButtonListeners();

    // Render Pagination Controls
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let buttonsHTML = '<div class="pagination-wrapper">';

    // Previous Button
    buttonsHTML += `
      <button class="pagination-btn ${filterState.currentPage === 1 ? 'disabled' : ''}" 
              data-page="${filterState.currentPage - 1}" 
              ${filterState.currentPage === 1 ? 'disabled' : ''}>
        <i class="fa-solid fa-angle-left"></i> Prev
      </button>
    `;

    // Page Numbers
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= filterState.currentPage - 2 && p <= filterState.currentPage + 2)) {
        buttonsHTML += `
          <button class="pagination-btn ${p === filterState.currentPage ? 'active' : ''}" data-page="${p}">
            ${p}
          </button>
        `;
      } else if (p === filterState.currentPage - 3 || p === filterState.currentPage + 3) {
        buttonsHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    // Next Button
    buttonsHTML += `
      <button class="pagination-btn ${filterState.currentPage === totalPages ? 'disabled' : ''}" 
              data-page="${filterState.currentPage + 1}" 
              ${filterState.currentPage === totalPages ? 'disabled' : ''}>
        Next <i class="fa-solid fa-angle-right"></i>
      </button>
    `;

    buttonsHTML += '</div>';
    paginationContainer.innerHTML = buttonsHTML;

    // Attach click events
    paginationContainer.querySelectorAll(".pagination-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        if (page && page !== filterState.currentPage) {
          filterState.currentPage = page;
          applyFilters();
          // Smooth scroll to top of listings
          const target = document.querySelector(".listing-top-bar");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterState.keyword = e.target.value.trim();
      filterState.currentPage = 1;
      applyFilters();
    });
  }

  if (locationSelect) {
    locationSelect.addEventListener("change", (e) => {
      filterState.location = e.target.value;
      filterState.currentPage = 1;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      filterState.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Category Radios
  document.querySelectorAll('input[name="filter-category"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      filterState.category = e.target.value;
      filterState.currentPage = 1;
      applyFilters();
    });
  });

  // Purpose Radios (Resale vs Rent)
  document.querySelectorAll('input[name="filter-purpose"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      filterState.purpose = e.target.value;
      filterState.currentPage = 1;
      applyFilters();
    });
  });

  // Bedroom Radios
  document.querySelectorAll('input[name="filter-beds"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      filterState.bedrooms = e.target.value;
      filterState.currentPage = 1;
      applyFilters();
    });
  });

  // Price Slider
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      filterState.maxPrice = parseFloat(e.target.value);
      filterState.currentPage = 1;
      if (priceSliderVal) {
        priceSliderVal.textContent = formatPriceDisplay(filterState.maxPrice);
      }
      applyFilters();
    });
  }

  // View Mode Toggles
  if (gridViewBtn) {
    gridViewBtn.addEventListener("click", () => {
      filterState.viewMode = "grid";
      gridViewBtn.classList.add("active");
      if (listViewBtn) listViewBtn.classList.remove("active");
      applyFilters();
    });
  }

  if (listViewBtn) {
    listViewBtn.addEventListener("click", () => {
      filterState.viewMode = "list";
      listViewBtn.classList.add("active");
      if (gridViewBtn) gridViewBtn.classList.remove("active");
      applyFilters();
    });
  }

  // Reset Filters
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterState.keyword = "";
      filterState.category = "all";
      filterState.purpose = "all";
      filterState.location = "all";
      filterState.bedrooms = "all";
      filterState.maxPrice = 300000000;
      filterState.sortBy = "featured";
      filterState.currentPage = 1;

      if (searchInput) searchInput.value = "";
      if (locationSelect) locationSelect.value = "all";
      if (sortSelect) sortSelect.value = "featured";
      if (priceSlider) priceSlider.value = 300000000;
      if (priceSliderVal) priceSliderVal.textContent = "Up to ₹ 30.0 Cr";

      document.querySelectorAll('input[name="filter-category"][value="all"]').forEach(r => r.checked = true);
      document.querySelectorAll('input[name="filter-purpose"][value="all"]').forEach(r => r.checked = true);
      document.querySelectorAll('input[name="filter-beds"][value="all"]').forEach(r => r.checked = true);

      window.history.replaceState({}, document.title, window.location.pathname);
      applyFilters();
      showToast("All filters have been reset", "info");
    });
  }

  // Initial Filter Run
  applyFilters();
});
