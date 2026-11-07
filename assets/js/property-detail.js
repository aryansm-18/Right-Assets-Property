/**
 * Right Asset's Property - Property Detail Page Script
 * Dynamically loads property from data.js, controls gallery interactions,
 * captures lead enquiries, and offers direct agent WhatsApp/Phone connection.
 */

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const propId = urlParams.get("id") || "PROP-101";

  if (typeof PROPERTIES_DATA === "undefined") {
    console.error("PROPERTIES_DATA is not loaded");
    return;
  }

  const property = PROPERTIES_DATA.find(p => p.id === propId || p.slug === propId) || PROPERTIES_DATA[0];

  renderPropertyDetails(property);
  renderRelatedProperties(property);
  setupEnquiryForm(property);
});

function renderPropertyDetails(p) {
  // Update Document Title
  document.title = `${p.title} | Right Asset's Property`;

  // Breadcrumbs
  const breadcrumbCategory = document.getElementById("breadcrumb-category");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");
  if (breadcrumbCategory) breadcrumbCategory.textContent = p.category.toUpperCase();
  if (breadcrumbTitle) breadcrumbTitle.textContent = p.title;

  // Header
  const titleEl = document.getElementById("detail-title");
  const locationEl = document.getElementById("detail-location");
  const priceEl = document.getElementById("detail-price");
  const reraEl = document.getElementById("detail-rera");
  const purposeBadgeEl = document.getElementById("detail-purpose-badge");

  if (titleEl) titleEl.textContent = p.title;
  if (locationEl) locationEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${p.location}`;
  if (priceEl) priceEl.textContent = p.priceDisplay;
  if (reraEl) reraEl.textContent = `MahaRERA: ${p.reraId}`;
  
  if (purposeBadgeEl) {
    purposeBadgeEl.textContent = p.purpose.toUpperCase();
    purposeBadgeEl.className = `badge-tag ${p.purpose}`;
  }

  // Gallery
  const mainImg = document.getElementById("gallery-main-display");
  const thumbsContainer = document.getElementById("gallery-thumbs-container");

  if (mainImg && p.images.length > 0) {
    mainImg.src = p.images[0];
    mainImg.alt = p.title;
    mainImg.onerror = function() {
      this.onerror = null;
      this.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    };
  }

  if (thumbsContainer && p.images.length > 1) {
    thumbsContainer.innerHTML = p.images.slice(1, 4).map((imgUrl, idx) => `
      <div class="gallery-thumb-item" onclick="swapGalleryImage('${imgUrl}')">
        <img src="${imgUrl}" alt="${p.title} - View ${idx + 2}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';" />
      </div>
    `).join("");
  }

  // Specifications Grid
  const specArea = document.getElementById("spec-area");
  const specBeds = document.getElementById("spec-beds");
  const specBaths = document.getElementById("spec-baths");
  const specParking = document.getElementById("spec-parking");
  const specFurnish = document.getElementById("spec-furnish");
  const specFloor = document.getElementById("spec-floor");
  const specPossession = document.getElementById("spec-possession");
  const specCategory = document.getElementById("spec-category");

  if (specArea) specArea.textContent = `${p.area} sq.ft`;
  const bedLabel = p.title.includes("1 RK") ? "1 RK" : `${p.bedrooms} BHK`;
  if (specBeds) specBeds.textContent = p.bedrooms > 0 ? bedLabel : "Commercial";
  if (specBaths) specBaths.textContent = `${p.bathrooms} Washrooms`;
  if (specParking) specParking.textContent = `${p.parking} Covered`;
  if (specFurnish) specFurnish.textContent = p.furnishing;
  if (specFloor) specFloor.textContent = p.floor;
  if (specPossession) specPossession.textContent = p.possession;
  if (specCategory) specCategory.textContent = p.category.toUpperCase();

  // Description
  const descEl = document.getElementById("detail-description");
  const taglineEl = document.getElementById("detail-tagline");
  if (descEl) descEl.textContent = p.description;
  if (taglineEl) taglineEl.textContent = `"${p.tagline}"`;

  // Features
  const featuresContainer = document.getElementById("detail-features-grid");
  if (featuresContainer && p.features) {
    featuresContainer.innerHTML = p.features.map(f => `
      <div class="feature-chip-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${f}</span>
      </div>
    `).join("");
  }

  // Landmarks
  const landmarksContainer = document.getElementById("detail-landmarks-list");
  if (landmarksContainer && p.landmarks) {
    landmarksContainer.innerHTML = p.landmarks.map(l => `
      <div class="landmark-item">
        <span style="font-weight: 600; color: #fff;"><i class="fa-solid fa-location-arrow" style="color: var(--gold-400); margin-right: 8px;"></i>${l.name}</span>
        <span style="color: var(--gold-300); font-weight: 700;">${l.distance}</span>
      </div>
    `).join("");
  }

  // Assigned Agent Card
  const agentNameEl = document.getElementById("detail-agent-name");
  const agentRoleEl = document.getElementById("detail-agent-role");
  const agentCallBtn = document.getElementById("detail-agent-call-btn");
  const agentWaBtn = document.getElementById("detail-agent-wa-btn");

  if (agentNameEl) agentNameEl.textContent = p.agent.name;
  if (agentRoleEl) agentRoleEl.textContent = p.agent.role;
  if (agentCallBtn) agentCallBtn.href = `tel:${p.agent.phone}`;
  if (agentWaBtn) {
    agentWaBtn.onclick = () => {
      openWhatsAppMessage(p.agent.whatsapp, `Hello ${p.agent.name}, I am interested in viewing ${p.title} (Ref: ${p.id}). Please connect with me.`);
    };
  }
}

// Image swap on thumbnail click
function swapGalleryImage(newUrl) {
  const mainImg = document.getElementById("gallery-main-display");
  if (mainImg) {
    mainImg.style.opacity = "0.4";
    setTimeout(() => {
      mainImg.src = newUrl;
      mainImg.style.opacity = "1";
    }, 180);
  }
}

// Setup Lead Enquiry Form
function setupEnquiryForm(p) {
  const form = document.getElementById("property-enquiry-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("enq-name").value.trim();
    const phone = document.getElementById("enq-phone").value.trim();
    const email = document.getElementById("enq-email").value.trim();
    const date = document.getElementById("enq-date").value;
    const message = document.getElementById("enq-message").value.trim();

    if (!name || !phone) {
      showToast("Please provide your Name and Phone Number.", "info");
      return;
    }

    // Save lead locally
    const lead = {
      propertyId: p.id,
      propertyTitle: p.title,
      clientName: name,
      phone: phone,
      email: email,
      visitDate: date || "Immediate",
      message: message,
      assignedTo: p.agent.name
    };

    LeadService.saveLead(lead);

    showToast("Enquiry submitted successfully! Our advisor will contact you shortly.", "success");
    form.reset();

    // Trigger WhatsApp notification prompt
    setTimeout(() => {
      if (confirm(`Would you like to send this enquiry directly to ${p.agent.name} via WhatsApp for fastest VIP response?`)) {
        const waText = `Hello ${p.agent.name},\nMy name is ${name}.\nI am interested in ${p.title} (${p.id}).\nPreferred Visit: ${date || 'Soon'}\nPhone: ${phone}\nNote: ${message || 'Please send brochure.'}`;
        openWhatsAppMessage(p.agent.whatsapp, waText);
      }
    }, 600);
  });
}

// Render Related Properties
function renderRelatedProperties(currentProp) {
  const container = document.getElementById("related-properties-container");
  if (!container || typeof PROPERTIES_DATA === "undefined") return;

  const related = PROPERTIES_DATA.filter(p => p.id !== currentProp.id && p.category === currentProp.category).slice(0, 3);
  if (related.length === 0) {
    // Fallback to any other 3 properties
    const others = PROPERTIES_DATA.filter(p => p.id !== currentProp.id).slice(0, 3);
    container.innerHTML = others.map(p => createPropertyCardHTML(p)).join("");
  } else {
    container.innerHTML = related.map(p => createPropertyCardHTML(p)).join("");
  }

  attachFavoriteButtonListeners();
}
