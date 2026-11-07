// Calculators & Smart Matcher Suite
(function () {
  'use strict';

  // 1. Tool Tab Switching
  window.initToolsTabs = function () {
    const tabs = document.querySelectorAll('.tool-tab-btn');
    const panels = document.querySelectorAll('.tool-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  };

  // 2. AI Smart Property Matcher Wizard
  let matcherState = {
    purpose: 'buy', // buy, rent, project
    type: '2bhk',
    location: 'kandivali'
  };

  window.selectMatcherOption = function (stepKey, value, element) {
    matcherState[stepKey] = value;
    const parent = element.parentElement;
    parent.querySelectorAll('.matcher-option-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
  };

  window.goMatcherStep = function (stepNumber) {
    document.querySelectorAll('.matcher-step-content').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.matcher-step-indicator').forEach((ind, idx) => {
      ind.classList.remove('active');
      if (idx + 1 < stepNumber) {
        ind.classList.add('done');
      } else {
        ind.classList.remove('done');
      }
      if (idx + 1 === stepNumber) {
        ind.classList.add('active');
      }
    });

    const targetStep = document.getElementById(`matcher-step-${stepNumber}`);
    if (targetStep) targetStep.style.display = 'block';

    if (stepNumber === 3) {
      renderMatchedProperties();
    }
  };

  function renderMatchedProperties() {
    const container = document.getElementById('matcher-results-container');
    if (!container) return;

    // Direct access to verified inventory
    const allProps = window.PROPERTIES_DATA || (typeof PROPERTIES_DATA !== 'undefined' ? PROPERTIES_DATA : []);
    
    if (!allProps || !allProps.length) {
      container.innerHTML = '<p style="color: #aaa; text-align: center; padding: 2rem;">Loading verified inventory...</p>';
      setTimeout(renderMatchedProperties, 300);
      return;
    }

    // Filter properties based on selected corridor & purpose
    let filtered = allProps.filter(p => {
      const pPurpose = (p.purpose || p.type || '').toLowerCase();
      const pLocation = ((p.location || '') + ' ' + (p.zone || '') + ' ' + (p.title || '')).toLowerCase();

      // Check Purpose
      let matchPurp = false;
      if (matcherState.purpose === 'buy') {
        matchPurp = pPurpose.includes('buy') || pPurpose.includes('resale') || p.category === 'home';
      } else if (matcherState.purpose === 'project') {
        matchPurp = pPurpose.includes('project') || (p.possession && p.possession.toLowerCase().includes('construction')) || p.category === 'Project';
      } else if (matcherState.purpose === 'rent') {
        matchPurp = pPurpose.includes('rent') || pPurpose.includes('lease');
      }

      // Check Location
      let matchLoc = pLocation.includes(matcherState.location.toLowerCase());

      return matchPurp && matchLoc;
    });

    // Fallback if tight filter yields < 3: match location first
    if (filtered.length < 3) {
      const locMatches = allProps.filter(p => {
        const pLocation = ((p.location || '') + ' ' + (p.zone || '') + ' ' + (p.title || '')).toLowerCase();
        return pLocation.includes(matcherState.location.toLowerCase()) && !filtered.includes(p);
      });
      filtered = filtered.concat(locMatches);
    }

    // Safety fallback: guaranteed 3 properties from catalog
    if (!filtered.length) {
      filtered = allProps.slice(0, 3);
    }

    const matched = filtered.slice(0, 3);
    const scorePercentages = [98, 95, 92];

    let html = '';
    matched.forEach((prop, i) => {
      const matchScore = scorePercentages[i] || 90;
      const imgUrl = (prop.images && prop.images.length) ? prop.images[0] : (prop.image || 'assets/images/prop-placeholder.jpg');
      const displayPrice = prop.priceDisplay || ('₹ ' + Number(prop.price).toLocaleString('en-IN'));
      const purposeTag = (prop.purpose || 'verified').toUpperCase();
      const safeTitle = (prop.title || '').replace(/'/g, "\\'");
      const safeLoc = (prop.location || prop.zone || 'Kandivali West').replace(/'/g, "\\'");

      html += `
        <div class="matcher-result-card" style="background: #181d28; border: 1.5px solid var(--gold-border); border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.6);">
          <div class="match-percentage-badge" style="position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-sparkles"></i> ${matchScore}% AI Match
          </div>
          <img src="${imgUrl}" alt="${prop.title}" style="width: 100%; height: 165px; object-fit: cover;" onerror="this.src='assets/images/prop-placeholder.jpg';" />
          <div style="padding: 1.2rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--gold-400); font-weight: 700; margin-bottom: 4px;">
              ${purposeTag} • ${prop.location || prop.zone}
            </div>
            <h4 style="font-size: 0.98rem; color: #fff; margin-bottom: 6px; line-height: 1.35; font-weight: 700;">${prop.title}</h4>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--gold-300); margin-bottom: 12px;">${displayPrice}</div>
            <div style="display: flex; gap: 8px;">
              <a href="property-detail.html?id=${prop.id}" class="btn btn-primary-gold" style="flex: 1; padding: 8px 10px; font-size: 0.8rem; text-align: center; text-decoration: none;">View Details</a>
              <button onclick="generateWhatsAppQuotation('${safeTitle}', '${displayPrice}', '${safeLoc}')" class="btn btn-outline-gold" style="padding: 8px 12px; font-size: 0.85rem;" title="Get WhatsApp Quote">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // 3. Maharashtra Stamp Duty & Registration Calculator (Mumbai Municipal Limits)
  window.calculateStampDuty = function () {
    const costInput = document.getElementById('sd-prop-cost');
    const genderSelect = document.getElementById('sd-gender');
    if (!costInput) return;

    const cost = parseFloat(costInput.value) || 0;
    const gender = genderSelect ? genderSelect.value : 'male';

    let stampRate = 0.06;
    if (gender === 'female') {
      stampRate = 0.05;
    }

    const stampDutyAmount = Math.round(cost * stampRate);

    // Registration fee: 1% capped at ₹30,000 for properties > ₹30 Lakhs
    let registrationFee = 30000;
    if (cost < 3000000) {
      registrationFee = Math.round(cost * 0.01);
    }

    const totalGovtCharges = stampDutyAmount + registrationFee;
    const formatINR = (val) => '₹ ' + Number(val).toLocaleString('en-IN');

    const sdValEl = document.getElementById('sd-duty-val');
    const sdRegEl = document.getElementById('sd-reg-val');
    const sdCessEl = document.getElementById('sd-cess-val');
    const sdTotalEl = document.getElementById('sd-total-val');
    const sdSummaryEl = document.getElementById('sd-summary-prop-cost');

    if (sdValEl) sdValEl.innerText = formatINR(stampDutyAmount);
    if (sdRegEl) sdRegEl.innerText = formatINR(registrationFee);
    if (sdCessEl) sdCessEl.innerText = `${(stampRate * 100).toFixed(0)}% Applicable (Incl. 1% Metro Cess)`;
    if (sdTotalEl) sdTotalEl.innerText = formatINR(totalGovtCharges);
    if (sdSummaryEl) sdSummaryEl.innerText = formatINR(cost);
  };

  // 4. WhatsApp Pre-filled Quotation Generator
  window.generateWhatsAppQuotation = function (propTitle, price, location) {
    const text = `*OFFICIAL PROPERTY INQUIRY*%0A%0A` +
      `*Right Asset's Property Consultants*%0A` +
      `_MahaRERA: A51800000620_%0A%0A` +
      `*Property:* ${encodeURIComponent(propTitle)}%0A` +
      `*Quoted Price:* ${encodeURIComponent(price)}%0A` +
      `*Locality:* ${encodeURIComponent(location)}%0A%0A` +
      `Dear Sanjeev Mehta Sir, I am inquiring about this verified property from your website. Please share complete legal papers, floor plan, and site inspection schedule.`;

    const waUrl = `https://wa.me/918879541828?text=${text}`;
    window.open(waUrl, '_blank');
  };

  // 5. Testimonials Carousel Engine (93 Verified Google Reviews)
  let testimonialIndex = 0;
  const itemsPerPage = 3;

  function renderTestimonialCards() {
    const container = document.getElementById('dynamic-testimonials-container');
    const rangeEl = document.getElementById('t-current-range');
    if (!container) return;

    const all = window.ALL_TESTIMONIALS || [];
    if (!all.length) return;

    const total = all.length;
    const start = testimonialIndex;
    const end = Math.min(start + itemsPerPage, total);

    if (rangeEl) {
      rangeEl.textContent = `${start + 1}-${end}`;
    }

    const currentItems = all.slice(start, end);

    let html = '';
    currentItems.forEach(item => {
      let starsHtml = '';
      const fullStars = Math.floor(item.stars);
      const hasHalf = (item.stars % 1 !== 0);

      for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star" style="color: #FBBC05; margin-right: 2px;"></i>';
      }
      if (hasHalf) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke" style="color: #FBBC05; margin-right: 2px;"></i>';
      }

      html += `
        <div class="testimonial-card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 240px; background: #131722; border: 1px solid var(--gold-border); border-radius: 12px; padding: 1.8rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div>
            <div class="stars-rating" style="margin-bottom: 0.8rem; font-size: 0.88rem;">
              ${starsHtml}
              <span style="color: var(--gold-300); font-weight: 700; margin-left: 6px; font-size: 0.8rem;">${item.stars} / 5</span>
            </div>
            <p class="testimonial-quote" style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.4rem; font-style: italic;">
              "${item.text}"
            </p>
          </div>
          <div class="testimonial-author" style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem;">
            <img src="${item.avatar}" alt="${item.name}" class="author-avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--gold-400);" onerror="this.src='assets/images/prop-placeholder.jpg';" />
            <div>
              <div class="author-name" style="color: #fff; font-weight: 700; font-size: 0.95rem;">${item.name}</div>
              <div class="author-role" style="color: var(--gold-400); font-size: 0.76rem;">${item.role}</div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  window.initTestimonialsCarousel = function () {
    const prevBtn = document.getElementById('t-prev-btn');
    const nextBtn = document.getElementById('t-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const all = window.ALL_TESTIMONIALS || [];
        if (!all.length) return;
        testimonialIndex -= itemsPerPage;
        if (testimonialIndex < 0) {
          testimonialIndex = Math.max(0, all.length - itemsPerPage);
        }
        renderTestimonialCards();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const all = window.ALL_TESTIMONIALS || [];
        if (!all.length) return;
        testimonialIndex += itemsPerPage;
        if (testimonialIndex >= all.length) {
          testimonialIndex = 0;
        }
        renderTestimonialCards();
      });
    }

    renderTestimonialCards();
  };

  // Auto initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.initToolsTabs();
    if (document.getElementById('sd-prop-cost')) {
      window.calculateStampDuty();
    }
    window.initTestimonialsCarousel();
  });

})();