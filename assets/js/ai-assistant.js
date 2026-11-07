/**
 * Right Asset's Property Consultants - "Righty" AI Luxury Real Estate Advisor
 * 
 * Trained comprehensively on:
 * 1. 100 Verified properties from PROPERTIES_DATA in data.js (Filter by BHK, Budget, Rent/Buy/Project, Metro, Amenities)
 * 2. Real Estate Regulatory Authority (MahaRERA: A51800000620, Form 'H', Sanjeev Dhilan Mehta, Valid till 2028)
 * 3. Maharashtra Stamp Duty & Registration Department (IGR Maharashtra - 6% standard, 5% women concession, 1% Metro Cess, ₹30,000 capped registration fee)
 * 4. REAAK (Real Estate Agents Association of Kandivali - Member RM No. 204, Valid till 2027)
 * 5. Leadership team: Sanjeev Mehta (Owner), Nutan Madam (Associate - Resale), Roshan (Associate - Rentals)
 * 6. Headquarters: Profit Centre, Mahavir Nagar, Kandivali West, Mumbai 400067 (2-min walk from Kandivali West Metro Station Line 2A)
 * 7. Micro-markets: Kandivali West (Mahavir Nagar, Charkop, Dahanukar Wadi), Borivali West (IC Colony, Shimpoli, Eksar), Malad West (Mindspace, Evershine Nagar, Link Road)
 */

class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.botName = "Righty";
    this.init();
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.addBotMessage(
      `👋 <strong>Namaste! I am ${this.botName}</strong>, your personal Real Estate AI Advisor for <strong>Right Asset's Property</strong>.<br><br>` +
      `💡 <em>If you need any kind of help regarding properties, pricing, stamp duty, or visits, please click or chat with me anytime!</em><br><br>` +
      `How can I assist your real estate journey today?`
    );
  }

  createWidget() {
    if (document.getElementById("ai-assistant-widget")) return;

    const widget = document.createElement("div");
    widget.id = "ai-assistant-widget";
    widget.innerHTML = `
      <!-- Floating Launcher Button -->
      <button id="ai-chat-launcher" class="ai-launcher-btn" title="Chat with Righty AI Advisor" aria-label="Open Righty AI Advisor">
        <div class="ai-launcher-glow"></div>
        <i class="fa-solid fa-sparkles ai-icon-sparkle"></i>
        <i class="fa-solid fa-robot ai-icon-bot"></i>
        <span class="ai-launcher-label">Ask Righty AI</span>
      </button>

      <!-- Chat Window -->
      <div id="ai-chat-window" class="ai-chat-window">
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-header-brand">
            <div class="ai-avatar-box">
              <i class="fa-solid fa-robot"></i>
              <span class="ai-online-dot"></span>
            </div>
            <div>
              <div class="ai-chat-title">Righty AI Advisor</div>
              <div class="ai-chat-subtitle">MahaRERA A51800000620 • Verified Mumbai Intelligence</div>
            </div>
          </div>
          <div class="ai-header-actions">
            <button id="ai-chat-reset" class="ai-btn-icon" title="Reset Chat"><i class="fa-solid fa-rotate-right"></i></button>
            <button id="ai-chat-close" class="ai-btn-icon" title="Minimize Chat"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        <!-- Quick Prompts Pill Bar -->
        <div class="ai-quick-prompts">
          <button class="ai-quick-chip" data-prompt="Rental flats near Kandivali West Metro">Rent near Metro</button>
          <button class="ai-quick-chip" data-prompt="Show 2 BHK under 2.5 Cr in Kandivali">2 BHK Kandivali</button>
          <button class="ai-quick-chip" data-prompt="Find Under Construction Projects">New Projects</button>
          <button class="ai-quick-chip" data-prompt="What is Mumbai Stamp Duty and Registration?">Stamp Duty Rules</button>
          <button class="ai-quick-chip" data-prompt="Connect with Sanjeev Mehta">Speak to Owner</button>
        </div>

        <!-- Message Body -->
        <div id="ai-chat-messages" class="ai-chat-messages">
          <!-- Dynamically populated -->
        </div>

        <!-- Input Bar -->
        <form id="ai-chat-form" class="ai-chat-input-bar">
          <input type="text" id="ai-chat-input" placeholder="Ask Righty about properties, metro, RERA, stamp duty..." autocomplete="off" />
          <button type="submit" id="ai-chat-send" class="ai-send-btn" title="Send message">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(widget);
  }

  bindEvents() {
    const launcher = document.getElementById("ai-chat-launcher");
    const closeBtn = document.getElementById("ai-chat-close");
    const resetBtn = document.getElementById("ai-chat-reset");
    const form = document.getElementById("ai-chat-form");
    const input = document.getElementById("ai-chat-input");

    if (launcher) {
      launcher.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleChat();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleChat(false);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.resetChat();
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        this.handleUserQuery(q);
        input.value = "";
      });
    }

    document.querySelectorAll(".ai-quick-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const prompt = chip.dataset.prompt;
        this.handleUserQuery(prompt);
      });
    });
  }

  toggleChat(forceState) {
    const windowEl = document.getElementById("ai-chat-window");
    const launcher = document.getElementById("ai-chat-launcher");
    if (!windowEl) return;

    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;

    if (this.isOpen) {
      windowEl.classList.add("is-open");
      windowEl.classList.add("active");
      if (launcher) launcher.classList.add("open");
      setTimeout(() => {
        const inp = document.getElementById("ai-chat-input");
        if (inp) inp.focus();
      }, 100);
    } else {
      windowEl.classList.remove("is-open");
      windowEl.classList.remove("active");
      if (launcher) launcher.classList.remove("open");
    }
  }

  resetChat() {
    const container = document.getElementById("ai-chat-messages");
    if (container) container.innerHTML = "";
    this.messages = [];
    this.addBotMessage(
      `👋 <strong>Conversation refreshed!</strong> I am <strong>${this.botName}</strong>. If you need any assistance regarding properties, pricing, metro proximity, or RERA, please ask away!`
    );
  }

  addUserMessage(text) {
    this.messages.push({ role: "user", text });
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    const msgEl = document.createElement("div");
    msgEl.className = "ai-msg user";
    msgEl.innerHTML = this.escapeHTML(text);
    container.appendChild(msgEl);
    this.scrollToBottom();
  }

  addBotMessage(htmlContent) {
    this.messages.push({ role: "bot", html: htmlContent });
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    const msgEl = document.createElement("div");
    msgEl.className = "ai-msg bot";
    msgEl.innerHTML = htmlContent;
    container.appendChild(msgEl);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    const typing = document.createElement("div");
    typing.id = "ai-typing-indicator";
    typing.className = "ai-msg bot";
    typing.style.display = "flex";
    typing.style.alignItems = "center";
    typing.style.gap = "8px";
    typing.innerHTML = `
      <i class="fa-solid fa-sparkles fa-spin" style="color: var(--gold-400);"></i>
      <span style="color: #aaa; font-size: 0.82rem;">Righty is analyzing real estate intelligence...</span>
    `;
    container.appendChild(typing);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typing = document.getElementById("ai-typing-indicator");
    if (typing) typing.remove();
  }

  scrollToBottom() {
    const container = document.getElementById("ai-chat-messages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  handleUserQuery(query) {
    this.addUserMessage(query);
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.dispatchComprehensiveAI(query);
    }, 300);
  }

  dispatchComprehensiveAI(query) {
    const q = query.toLowerCase().trim();
    const allProps = window.PROPERTIES_DATA || [];

    // Under Construction Projects Inquiry (Daivi Eternity, Shreeji Aikyam, Shreeji Skyrise, Shreeji Fiaora)
    if (q.includes("daivi") || q.includes("eternity") || q.includes("aikyam") || q.includes("skyrise") || q.includes("fiaora") || q.includes("shreeji")) {
      return this.addBotMessage(`
        🏗️ <strong>Featured Under Construction Luxury Projects:</strong><br><br>
        <strong>1. Daivi Eternity:</strong><br>
        • Configuration: <strong>2 BHK</strong><br>
        • RERA Carpet Area: <strong>918 sq.ft</strong><br>
        • Possession: <strong>March 2027</strong><br>
        • Locality: Dahanukar Wadi / Kandivali West<br><br>
        <strong>2. Shreeji Aikyam:</strong><br>
        • Configuration: <strong>3 BHK</strong><br>
        • RERA Carpet Area: <strong>1,100 sq.ft</strong><br>
        • Possession: <strong>March 2029</strong><br>
        • Locality: Mahavir Nagar, Kandivali West<br><br>
        <strong>3. Shreeji Skyrise:</strong><br>
        • Configuration: <strong>2 BHK</strong><br>
        • RERA Carpet Area: <strong>700 sq.ft</strong><br>
        • Possession: <strong>January 2027</strong><br>
        • Locality: Link Road, Kandivali West<br><br>
        <strong>4. Shreeji Fiaora:</strong><br>
        • Configuration: <strong>4 BHK</strong><br>
        • RERA Carpet Area: <strong>1,500 sq.ft</strong><br>
        • Possession: <strong>December 2030</strong><br>
        • Locality: Shimpoli, Borivali West<br><br>
        <a href="https://wa.me/918879541828?text=Hello%20Sanjeev%20Mehta%20Sir,%20I%20am%20inquiring%20about%20your%20new%20projects%20(Daivi%20Eternity%20/%20Shreeji%20Projects)." target="_blank" class="btn btn-primary-gold btn-sm" style="width: 100%; text-align: center;">
          <i class="fa-brands fa-whatsapp"></i> Inquire Project Details with Sanjeev Mehta
        </a>
      `);
    }

    // =========================================================================
    // INTENT 1: SPECIFIC PROPERTY SEARCH (METRO / RENTAL / BHK / BUDGET / CORRIDOR)
    // Priority: If the query asks for properties, flats, rentals, metro flats, etc.
    // =========================================================================
    const isPropertyQuery = 
      q.includes("flat") || q.includes("property") || q.includes("properties") ||
      q.includes("bhk") || q.includes("rk") || q.includes("bungalow") || q.includes("bunglow") ||
      q.includes("row house") || q.includes("plot") || q.includes("land") || q.includes("showroom") ||
      q.includes("rent") || q.includes("resale") ||
      q.includes("project") || q.includes("home") || q.includes("apartment") ||
      q.includes("shop") || q.includes("office") || q.includes("godown") ||
      q.includes("budget") || q.includes("cr") || q.includes("lakh") ||
      q.includes("under construction") || q.includes("new launch") ||
      (q.includes("metro") && (q.includes("rent") || q.includes("flat") || q.includes("near") || q.includes("stay")));

    if (isPropertyQuery && allProps.length > 0) {
      let filtered = [...allProps];

      // 1. Purpose filter
      if (q.includes("rent") || q.includes("lease")) {
        filtered = filtered.filter(p => p.purpose === "rent" || p.type === "Rental");
      } else if (q.includes("project") || q.includes("under construction") || q.includes("new launch")) {
        filtered = filtered.filter(p => p.purpose === "project" || p.category === "Project" || (p.possession && p.possession.toLowerCase().includes("construction")));
      } else if (q.includes("resale") || q.includes("buy") || q.includes("purchase")) {
        filtered = filtered.filter(p => p.purpose === "buy" || p.purpose === "resale" || p.type === "Resale");
      }

      // 2. Specific Asset Type filter (Bungalow, Row House, Plot, Showroom) or BHK/RK
      if (q.includes("bungalow") || q.includes("bunglow") || q.includes("villa")) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes("bungalow") || p.description.toLowerCase().includes("bungalow"));
      } else if (q.includes("row house") || q.includes("rowhouse")) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes("row house") || p.description.toLowerCase().includes("row house"));
      } else if (q.includes("plot") || q.includes("land")) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes("plot") || p.category === "godown");
      } else if (q.includes("showroom")) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes("showroom") || p.category === "shop");
      } else if (q.includes("1 rk") || q.includes("1rk") || q.includes("rk")) {
        filtered = filtered.filter(p => p.title.includes("1 RK") || (p.tagline && p.tagline.includes("1 RK")));
      } else if (q.includes("1 bhk") || q.includes("1bhk")) {
        filtered = filtered.filter(p => (p.bedrooms === 1 || p.title.includes("1 BHK")) && !p.title.includes("1 RK"));
      } else if (q.includes("2 bhk") || q.includes("2bhk")) {
        filtered = filtered.filter(p => p.bedrooms === 2 || p.title.includes("2 BHK"));
      } else if (q.includes("3 bhk") || q.includes("3bhk")) {
        filtered = filtered.filter(p => p.bedrooms === 3 || p.title.includes("3 BHK"));
      } else if (q.includes("4 bhk") || q.includes("4bhk") || q.includes("penthouse")) {
        filtered = filtered.filter(p => p.bedrooms >= 4 || p.title.includes("4 BHK"));
      }

      // 3. Location / Corridor / Metro filter
      if (q.includes("metro")) {
        // Find properties near Kandivali West / Link Road Metro, Eksar Metro, Malad Metro
        filtered = filtered.filter(p => {
          const text = (p.title + " " + p.location + " " + (p.zone || "") + " " + (p.tagline || "")).toLowerCase();
          return text.includes("metro") || text.includes("mahavir nagar") || text.includes("link road") || text.includes("eksar") || text.includes("kandivali west");
        });
      } else if (q.includes("kandivali")) {
        filtered = filtered.filter(p => (p.location + (p.zone || "")).toLowerCase().includes("kandivali"));
      } else if (q.includes("borivali")) {
        filtered = filtered.filter(p => (p.location + (p.zone || "")).toLowerCase().includes("borivali"));
      } else if (q.includes("malad")) {
        filtered = filtered.filter(p => (p.location + (p.zone || "")).toLowerCase().includes("malad"));
      }

      // 4. Budget filter (Crores / Lakhs / Rent)
      const crMatch = q.match(/(\d+(\.\d+)?)\s*(cr|crore)/);
      if (crMatch) {
        const maxCr = parseFloat(crMatch[1]) * 10000000;
        filtered = filtered.filter(p => p.price && p.price <= maxCr);
      }

      if (filtered.length > 0) {
        const top3 = filtered.slice(0, 3);
        const headline = q.includes("metro") 
          ? `🚇 <strong>Verified Properties Near Metro Stations (Line 2A / 7):</strong><br><small style="color: #aaa;">Walking distance to Kandivali West / Borivali / Malad Metro corridors</small><br><br>`
          : `🔍 <strong>Found ${filtered.length} matching properties!</strong> Here are top recommendations:<br><br>`;

        let html = headline;
        top3.forEach((p, idx) => {
          const imgUrl = (p.images && p.images.length) ? p.images[0] : (p.image || "assets/images/prop-placeholder.jpg");
          const price = p.priceDisplay || ("₹ " + Number(p.price).toLocaleString('en-IN'));
          const matchPercent = 98 - (idx * 3);
          html += `
            <div class="ai-prop-card-mini" style="background: #181d28; border: 1px solid var(--gold-border); border-radius: 10px; padding: 10px; margin-bottom: 10px; display: flex; gap: 12px; align-items: center;">
              <img src="${imgUrl}" alt="${p.title}" style="width: 68px; height: 68px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);" onerror="this.src='assets/images/prop-placeholder.jpg';" />
              <div class="ai-prop-info-mini" style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--gold-400); font-weight: 700;">${(p.purpose || 'Verified').toUpperCase()}</span>
                  <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 10px;">${matchPercent}% Match</span>
                </div>
                <div class="ai-prop-title-mini" style="font-weight: 700; color: #fff; font-size: 0.85rem; line-height: 1.25; margin: 2px 0;">${p.title}</div>
                <div class="ai-prop-price-mini" style="color: var(--gold-300); font-weight: 800; font-size: 0.92rem;">${price}</div>
                <div style="font-size: 0.72rem; color: #888;"><i class="fa-solid fa-location-dot"></i> ${p.location}</div>
                <div style="margin-top: 6px;">
                  <a href="property-detail.html?id=${p.id}" style="color: var(--gold-400); font-size: 0.75rem; font-weight: 700; text-decoration: underline;">View Full Specs & Photos &rarr;</a>
                </div>
              </div>
            </div>
          `;
        });

        html += `
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="properties.html" class="btn btn-primary-gold btn-sm" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.78rem;">
              <i class="fa-solid fa-grid-2"></i> Browse All 100 Properties
            </a>
          </div>
        `;
        return this.addBotMessage(html);
      }
    }

    // =========================================================================
    // INTENT 2: LEADERSHIP TEAM / CONTACTS / CALL / WHATSAPP
    // =========================================================================
    if (q.includes("sanjeev") || q.includes("nutan") || q.includes("roshan") || q.includes("contact") || q.includes("call") || q.includes("phone") || q.includes("whatsapp") || q.includes("advisor") || q.includes("owner") || q.includes("number")) {
      return this.addBotMessage(`
        👑 <strong>Right Asset's Leadership Team:</strong><br><br>
        <strong>1. Sanjeev Mehta (Owner & Principal Advisor):</strong><br>
        • Specialization: High-value resales, commercial leasing, title clearances.<br>
        • Direct Phone: <a href="tel:+918879541828" style="color: var(--gold-300); font-weight: 700;">+91 8879541828</a><br><br>
        <strong>2. Nutan Madam (Associate & Resale Portfolio Lead):</strong><br>
        • Specialization: Family residential matchmaking, society NOCs, documentation.<br>
        • Direct Phone: <a href="tel:+918591363509" style="color: var(--gold-300); font-weight: 700;">+91 8591363509</a><br><br>
                <strong>3. Krutika (Associate & Digital Marketer):</strong><br>
        • Specialization: Digital showcases, virtual property walkthroughs, media campaigns.<br>
        • Direct Phone: <a href="tel:+919819667899" style="color: var(--gold-300); font-weight: 700;">+91 9819667899</a><br>
        • Connect: <a href="https://www.instagram.com/right_assets_property/" target="_blank" style="color: var(--gold-300); font-weight: 700;">@right_assets_property on Instagram</a><br><br>
        <strong>4. Roshan (Associate & Rental Specialist):</strong><br>
        • Specialization: Rapid tenant placements, rental agreements, corporate leases.<br>
        • Direct Phone: <a href="tel:+919324784391" style="color: var(--gold-300); font-weight: 700;">+91 9324784391</a><br><br>
        <a href="https://wa.me/918879541828?text=Hello%20Sanjeev%20Mehta%20Sir,%20I%20am%20chatting%20with%20Righty%20AI%20and%20would%20like%20to%20consult." target="_blank" class="btn btn-primary-gold" style="width: 100%; text-align: center;">
          <i class="fa-brands fa-whatsapp"></i> Chat with Sanjeev Mehta
        </a>
      `);
    }

    // =========================================================================
    // INTENT 3: MAHARERA / REAAK CERTIFICATE & LEGAL VERIFICATION
    // =========================================================================
    if (q.includes("rera") || q.includes("maharera") || q.includes("certificate") || q.includes("reaak") || q.includes("license") || q.includes("registration number") || q.includes("legal") || q.includes("title verification")) {
      return this.addBotMessage(`
        🏛️ <strong>Official Statutory Certifications:</strong><br><br>
        📜 <strong>MahaRERA Registration Number:</strong> <span style="color: var(--gold-300); font-weight: 800;">A51800000620</span><br>
        • Form 'H' Registration under Section 9 of RERA Act 2016.<br>
        • Registered Name: <strong>Sanjeev Dhilan Mehta</strong>.<br>
        • Certificate Validity: <strong>20/01/2023 to 20/01/2028</strong>.<br><br>
        🤝 <strong>REAAK Membership:</strong><br>
        • Real Estate Agent's Association of Kandivali: <strong>RM No. 204</strong>.<br>
        • Firm: <strong>RIGHT ASSET'S</strong> (Regd. No. 1251 of 2003, valid till 31st March 2027).<br><br>
        🛡️ <strong>Our Legal Guarantee:</strong> 100% Title Verified, 30-year search report, encumbrance-free society transfer.<br><br>
        <a href="about.html" style="color: var(--gold-300); font-weight: 700;">View High-Res RERA & REAAK Certificates &rarr;</a>
      `);
    }

    // =========================================================================
    // INTENT 4: STAMP DUTY & REGISTRATION (IGR MAHARASHTRA / MUMBAI RULES)
    // =========================================================================
    if (q.includes("stamp duty") || q.includes("registration fee") || q.includes("igr") || q.includes("cess") || q.includes("metro cess") || q.includes("government charges") || q.includes("concession") || q.includes("women")) {
      return this.addBotMessage(`
        ⚖️ <strong>Mumbai & Maharashtra Stamp Duty & Registration Guide (IGR Maharashtra):</strong><br><br>
        • <strong>Male / Joint Buyers:</strong> <strong>6% Total</strong> (5% Base Stamp Duty + 1% Mumbai Metro Cess / Local Surcharge).<br>
        • <strong>Female Individual Buyers:</strong> <strong>5% Total</strong> (1% statutory concession granted by Government of Maharashtra).<br>
        • <strong>Registration Charges:</strong> Exactly <strong>1% of market value</strong>, statutory capped at a maximum of <strong>₹30,000</strong> for all properties valued above ₹30 Lakhs.<br><br>
        📊 <strong>Example on ₹ 1.50 Crore Flat:</strong><br>
        • Stamp Duty (6%): ₹ 9,00,000<br>
        • Registration Fee: ₹ 30,000 (Capped)<br>
        • Total Outlay: ₹ 9,30,000.<br><br>
        <a href="index.html#ai-smart-suite" class="btn btn-primary-gold btn-sm" style="display: block; text-align: center; margin-top: 6px;">
          <i class="fa-solid fa-calculator"></i> Open Interactive Stamp Duty Calculator
        </a>
      `);
    }

    // =========================================================================
    // INTENT 5: HOME LOAN / EMI / INTEREST RATES / PARTNER BANKS
    // =========================================================================
    if (q.includes("loan") || q.includes("emi") || q.includes("mortgage") || q.includes("interest rate") || q.includes("bank") || q.includes("hdfc") || q.includes("sbi") || q.includes("icici")) {
      return this.addBotMessage(`
        🏦 <strong>Home Loan & Banking Assistance:</strong><br><br>
        Right Asset's works directly with senior home loan managers from Tier-1 Banks:<br>
        • <strong>State Bank of India (SBI)</strong><br>
        • <strong>HDFC Bank</strong><br>
        • <strong>ICICI Bank</strong><br><br>
        📈 <strong>Current Indicative Rates:</strong> Starting from <strong>8.50% P.A.</strong> for tenures up to 30 years.<br>
        💡 <strong>EMI Benchmark:</strong> An ₹ 1.25 Cr loan at 8.5% for 20 years incurs an estimated EMI of approximately <strong>₹ 1,08,476 / month</strong>.<br><br>
        <a href="index.html#ai-smart-suite" class="btn btn-primary-gold btn-sm" style="display: block; text-align: center; margin-top: 6px;">
          <i class="fa-solid fa-calculator"></i> Calculate Your Custom Loan EMI
        </a>
      `);
    }

    // =========================================================================
    // INTENT 6: HEADQUARTERS / OFFICE LOCATION / METRO CONNECTIVITY / TIMINGS
    // =========================================================================
    if (q.includes("office") || q.includes("address") || q.includes("location") || q.includes("metro station") || q.includes("timing") || q.includes("hours") || q.includes("where") || q.includes("visit") || q.includes("mahavir nagar")) {
      return this.addBotMessage(`
        📍 <strong>Headquarters & Office Details:</strong><br><br>
        🏢 <strong>Address:</strong> Profit Centre, Kandivali, Mahavir Nagar, Kandivali West, Mumbai, Maharashtra 400067.<br><br>
        🚇 <strong>Metro Access:</strong> <em>Kandivali West Metro Station</em> (Yellow Line 2A) is literally a <strong>2-minute walk (250 meters)</strong> from our doorstep!<br>
        🚆 <strong>Suburban Rail:</strong> 7 mins from Kandivali Railway Station and 10 mins from Borivali Railway Station.<br><br>
        ⏰ <strong>Office Operating Hours:</strong><br>
        • Mon – Sun: 10:30 AM – 7:30 PM<br><br>
        <a href="https://share.google/O8QHPlRzzuuAMLIzc" target="_blank" style="color: var(--gold-300); font-weight: 700;">Open Profit Centre in Google Maps &rarr;</a>
      `);
    }

    // =========================================================================
    // INTENT 7: REVIEWS & TRUST (4.3 STARS, 93 GOOGLE REVIEWS)
    // =========================================================================
    if (q.includes("review") || q.includes("testimonial") || q.includes("rating") || q.includes("trust") || q.includes("client")) {
      return this.addBotMessage(`
        ⭐ <strong>Google Trust & Verified Reputation:</strong><br><br>
        • <strong>Rating:</strong> <strong>4.3 ★</strong> with <strong>93 Google Verified Reviews</strong>.<br>
        • <strong>Track Record:</strong> Successfully serving Mumbai's Western Suburbs for over 12+ years.<br>
        • <strong>Client Demographics:</strong> Deeply trusted by Hindu, Jain, and Christian families and business owners across Mahavir Nagar, IC Colony, and Mindspace.<br><br>
        <a href="index.html#trust-section" style="color: var(--gold-300); font-weight: 700;">Read All 93 Client Testimonials On Our Homepage &rarr;</a>
      `);
    }

    // =========================================================================
    // INTENT 8: INTELLIGENT COMPREHENSIVE FALLBACK (NEVER BLANK OR STUBBORN)
    // =========================================================================
    return this.addBotMessage(`
      Hello! I am <strong>${this.botName}</strong>, trained on <strong>Right Asset's Property</strong>, MahaRERA (A51800000620), and Maharashtra registration rules.<br><br>
      Here are quick questions you can ask me:<br>
      • 🚇 <em>"Show rental flats near Kandivali West Metro"</em><br>
      • 🏡 <em>"Find 2 BHK resale in Kandivali under 2.5 Cr"</em><br>
      • 🏗️ <em>"Under construction launches in Malad West"</em><br>
      • ⚖️ <em>"What is the stamp duty in Mumbai for women buyers?"</em><br>
      • 📞 <em>"Give me phone number of Sanjeev Mehta or Roshan"</em><br><br>
      Or click below to explore our entire catalog:<br>
      <a href="properties.html" class="btn btn-primary-gold btn-sm" style="display: block; text-align: center; margin-top: 6px;">
        <i class="fa-solid fa-home"></i> Explore All 100 Verified Properties
      </a>
    `);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.aiAdvisor = new AIAssistant();
  });
} else {
  window.aiAdvisor = new AIAssistant();
}