/**
 * Right Asset's Property - Core Main Script
 * Handles navigation, mobile menu, wishlist state, global toast notifications,
 * interactive EMI calculator, and lead capture.
 */

// Global Wishlist Controller (LocalStorage)
const WishlistService = {
  KEY: "right_assets_favorites",

  getFavorites() {
    try {
      const items = localStorage.getItem(this.KEY);
      return items ? JSON.parse(items) : [];
    } catch (e) {
      return [];
    }
  },

  isFavorite(propId) {
    const list = this.getFavorites();
    return list.includes(propId);
  },

  toggleFavorite(propId) {
    let list = this.getFavorites();
    const index = list.indexOf(propId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(propId);
      added = true;
    }
    localStorage.setItem(this.KEY, JSON.stringify(list));
    this.updateBadges();
    return added;
  },

  updateBadges() {
    const count = this.getFavorites().length;
    document.querySelectorAll(".wishlist-badge").forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }
};

// Global Toast System
function showToast(message, type = "success") {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className = "toast-alert";
    document.body.appendChild(toast);
  }

  const icon = type === "success" 
    ? '<i class="fa-solid fa-circle-check" style="color: #10B981; font-size: 1.2rem;"></i>' 
    : '<i class="fa-solid fa-circle-info" style="color: #F3CD65; font-size: 1.2rem;"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
}

// Global Lead Capture Service (Fallback if leads-service.js not loaded)
if (typeof LeadService === "undefined") {
  window.LeadService = {
    STORAGE_KEY: "right_assets_leads",

    saveLead(leadData) {
      try {
        const existing = this.getLeads();
        const newLead = {
          id: "LEAD-" + Date.now(),
          date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          ...leadData
        };
        existing.unshift(newLead);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
        return newLead;
      } catch (e) {
        console.error("Lead storage error:", e);
        return leadData;
      }
    },

    getLeads() {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },

    clearLeads() {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  };
}

// Open WhatsApp with prefilled message
function openWhatsAppMessage(phoneNumber, message) {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanNumber}?text=${encodedMsg}`, "_blank");
}

// DOM Ready Handler
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Wishlist Badge
  WishlistService.updateBadges();

  // 2. Sticky Navbar scroll effect
  const navbar = document.querySelector(".main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  const drawerBackdrop = document.querySelector(".drawer-backdrop");
  const drawerClose = document.querySelector(".drawer-close");

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (drawerBackdrop) drawerBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  // 4. Hero Search Bar Tab Switching
  const searchTabs = document.querySelectorAll(".search-tab");
  const heroPurposeInput = document.getElementById("hero-purpose");
  if (searchTabs.length > 0) {
    searchTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        searchTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const purpose = tab.dataset.purpose;
        if (heroPurposeInput) {
          heroPurposeInput.value = purpose;
        }
      });
    });
  }

  // 5. Hero Search Form Execution
  const heroSearchForm = document.getElementById("hero-search-form");
  if (heroSearchForm) {
    heroSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const purpose = heroPurposeInput ? heroPurposeInput.value : "all";
      const category = document.getElementById("hero-category")?.value || "all";
      const location = document.getElementById("hero-location")?.value || "all";
      const maxPrice = document.getElementById("hero-price")?.value || "";

      let queryParams = new URLSearchParams();
      if (purpose && purpose !== "all") queryParams.set("purpose", purpose);
      if (category && category !== "all") queryParams.set("category", category);
      if (location && location !== "all") queryParams.set("location", location);
      if (maxPrice) queryParams.set("maxPrice", maxPrice);

      window.location.href = `properties.html?${queryParams.toString()}`;
    });
  }

  // 6. Interactive EMI Loan Calculator
  initEMICalculator();

  // 7. Render Featured Properties on Homepage if on index page
  renderFeaturedSection();
});

// EMI Calculator Implementation
function initEMICalculator() {
  const loanSlider = document.getElementById("loan-amount-slider");
  const rateSlider = document.getElementById("interest-rate-slider");
  const tenureSlider = document.getElementById("tenure-slider");

  const loanValDisplay = document.getElementById("loan-amount-display");
  const rateValDisplay = document.getElementById("interest-rate-display");
  const tenureValDisplay = document.getElementById("tenure-display");

  const emiMonthlyVal = document.getElementById("emi-monthly-val");
  const emiPrincipalVal = document.getElementById("emi-principal-val");
  const emiInterestVal = document.getElementById("emi-interest-val");
  const emiTotalVal = document.getElementById("emi-total-val");

  if (!loanSlider || !rateSlider || !tenureSlider) return;

  function formatIndianCurrency(num) {
    if (num >= 10000000) {
      return "₹ " + (num / 10000000).toFixed(2) + " Cr";
    } else if (num >= 100000) {
      return "₹ " + (num / 100000).toFixed(2) + " Lakh";
    }
    return "₹ " + Math.round(num).toLocaleString("en-IN");
  }

  function calculateEMI() {
    const P = parseFloat(loanSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const tenureYears = parseFloat(tenureSlider.value);

    // Monthly interest rate
    const r = (annualRate / 12) / 100;
    // Number of monthly installments
    const n = tenureYears * 12;

    // Formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Update displays
    if (loanValDisplay) loanValDisplay.textContent = formatIndianCurrency(P);
    if (rateValDisplay) rateValDisplay.textContent = annualRate.toFixed(1) + " %";
    if (tenureValDisplay) tenureValDisplay.textContent = tenureYears + " Years";

    if (emiMonthlyVal) emiMonthlyVal.textContent = "₹ " + Math.round(emi).toLocaleString("en-IN");
    if (emiPrincipalVal) emiPrincipalVal.textContent = formatIndianCurrency(P);
    if (emiInterestVal) emiInterestVal.textContent = formatIndianCurrency(totalInterest);
    if (emiTotalVal) emiTotalVal.textContent = formatIndianCurrency(totalPayment);
  }

  loanSlider.addEventListener("input", calculateEMI);
  rateSlider.addEventListener("input", calculateEMI);
  tenureSlider.addEventListener("input", calculateEMI);

  // Initial run
  calculateEMI();
}

// Render Featured Cards onto Homepage
function renderFeaturedSection() {
  const container = document.getElementById("featured-properties-container");
  if (!container || typeof PROPERTIES_DATA === "undefined") return;

  const featured = PROPERTIES_DATA.filter(p => p.featured).slice(0, 6);
  container.innerHTML = featured.map(p => createPropertyCardHTML(p)).join("");

  attachFavoriteButtonListeners();
}

// Reusable Property Card Generator
function createPropertyCardHTML(p) {
  const isFav = WishlistService.isFavorite(p.id);
  let purposeBadgeClass = "buy";
  let purposeBadgeText = "RESALE";

  if (p.purpose === "project" || p.isUnderConstruction) {
    purposeBadgeClass = "invest";
    purposeBadgeText = "UNDER CONSTRUCTION";
  } else if (p.purpose === "rent") {
    purposeBadgeClass = "rent";
    purposeBadgeText = "FOR RENT";
  }

  let spec1 = `<div class="spec-item"><i class="fa-solid fa-vector-square"></i> <span>${p.area} sq.ft</span></div>`;
  let bedLabel = p.title.includes("1 RK") ? "1 RK" : `${p.bedrooms} BHK`;
  let spec2 = p.bedrooms > 0 
    ? `<div class="spec-item"><i class="fa-solid fa-bed"></i> <span>${bedLabel}</span></div>` 
    : `<div class="spec-item"><i class="fa-solid fa-building"></i> <span>${p.furnishing.split(' ')[0]}</span></div>`;
  let spec3 = `<div class="spec-item"><i class="fa-solid fa-car"></i> <span>${p.parking} Parking</span></div>`;

  return `
    <article class="property-card" data-id="${p.id}">
      <div class="property-img-wrap">
        <img src="${p.images[0]}" alt="${p.title}" class="property-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';" />
        <div class="property-badges-overlay">
          <span class="badge-tag ${purposeBadgeClass}">${purposeBadgeText}</span>
          ${p.featured ? '<span class="badge-tag featured">EXCLUSIVE</span>' : ''}
        </div>
        <button class="property-fav-btn ${isFav ? 'active' : ''}" data-prop-id="${p.id}" title="Save to Favorites" aria-label="Favorite">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <div class="property-price-bar">
          <div class="property-price">${p.priceDisplay}</div>
          <span style="font-size: 0.75rem; color: #E2E8F0; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px;">RERA Verified</span>
        </div>
      </div>

      <div class="property-body">
        <div class="property-category-tag">${p.category.toUpperCase()} • ${p.possession}</div>
        <h3 class="property-title">
          <a href="property-detail.html?id=${p.id}">${p.title}</a>
        </h3>
        <div class="property-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${p.location}</span>
        </div>

        <div class="property-specs-grid">
          ${spec1}
          ${spec2}
          ${spec3}
        </div>

        <div class="property-footer-actions">
          <a href="property-detail.html?id=${p.id}" class="btn btn-outline-gold btn-sm">
            View Details <i class="fa-solid fa-arrow-right"></i>
          </a>
          <button class="btn btn-whatsapp btn-sm" onclick="openWhatsAppMessage('${p.agent.whatsapp}', 'Hello Right Asset\'s Property, I am interested in ${p.title} (${p.id}). Please share more details.')" title="Chat on WhatsApp">
            <i class="fa-brands fa-whatsapp"></i> Chat
          </button>
        </div>
      </div>
    </article>
  `;
}

// Attach listener to favorite hearts
function attachFavoriteButtonListeners() {
  document.querySelectorAll(".property-fav-btn").forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const propId = this.dataset.propId;
      const isNowFav = WishlistService.toggleFavorite(propId);
      
      const icon = this.querySelector("i");
      if (isNowFav) {
        this.classList.add("active");
        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }
        showToast("Added to your saved luxury shortlist!", "success");
      } else {
        this.classList.remove("active");
        if (icon) {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
        showToast("Removed from shortlist", "info");
      }
    };
  });
}
