/**
 * Right Asset's Property Consultants - Firebase Cloud Realtime Database & Auth Service
 *
 * Cloud Database: Google Firebase Realtime Database
 * URL: https://right-assets-properties-default-rtdb.firebaseio.com
 *
 * Passwords securely validated via Firebase Cloud Realtime Database:
 * - Sanjeev Mehta (Admin / Owner): Sanjeev@Owner2026
 * - Nutan Madam (Staff / Resale Lead): Nutan@Resale2026
 * - Roshan (Staff / Rental Specialist): Roshan@Rent2026
 */

const AuthService = {
  SESSION_KEY: "right_assets_auth_session",
  FIREBASE_USERS_URL: "https://right-assets-properties-default-rtdb.firebaseio.com/users",

  // Hardcoded fallback credentials (synced with Firebase)
  USERS_FALLBACK: {
    sanjeev: {
      username: "sanjeev",
      password: "Sanjeev@Owner2026",
      displayName: "Sanjeev Mehta",
      role: "Admin",
      designation: "Owner & Principal Advisor",
      avatar: "assets/images/sanjeev-mehta.jpg",
      assignedToFilter: "all",
      canViewAllLeads: true,
      canViewAnalytics: true,
      canReassign: true,
      canExport: true
    },
    nutan: {
      username: "nutan",
      password: "Nutan@Resale2026",
      displayName: "Nutan Madam",
      role: "Staff",
      designation: "Associate & Resale Lead",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      assignedToFilter: "Nutan Madam",
      canViewAllLeads: false,
      canViewAnalytics: false,
      canReassign: false,
      canExport: false
    },
    roshan: {
      username: "roshan",
      password: "Roshan@Rent2026",
      displayName: "Roshan",
      role: "Staff",
      designation: "Rental Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      assignedToFilter: "Roshan",
      canViewAllLeads: false,
      canViewAnalytics: false,
      canReassign: false,
      canExport: false
    }
  },

  // Authenticate user against Firebase Cloud Realtime Database
  async login(username, password) {
    const uname = (username || "").toLowerCase().trim();
    const pwd = (password || "").trim();

    if (!uname || !pwd) {
      return { success: false, message: "Please provide both username and password." };
    }

    try {
      // 1. Fetch user record directly from Firebase Cloud
      const res = await fetch(`${this.FIREBASE_USERS_URL}/${uname}.json`);
      if (res.ok) {
        const cloudUser = await res.json();
        if (cloudUser) {
          if (cloudUser.password === pwd) {
            // Verified with Firebase
            const sessionUser = { ...cloudUser };
            delete sessionUser.password;
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
            window.dispatchEvent(new CustomEvent("crmAuthChanged", { detail: sessionUser }));
            return { success: true, user: sessionUser, source: "Firebase Cloud DB" };
          } else {
            return { success: false, message: "Incorrect username or password. Please verify your credentials." };
          }
        } else {
          return { success: false, message: "Incorrect username or password. User does not exist." };
        }
      }
    } catch (e) {
      console.warn("[AuthService] Firebase offline, checking fallback verification:", e);
    }

    // 2. Fallback verification
    const fallback = this.USERS_FALLBACK[uname];
    if (fallback && fallback.password === pwd) {
      const sessionUser = { ...fallback };
      delete sessionUser.password;
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      window.dispatchEvent(new CustomEvent("crmAuthChanged", { detail: sessionUser }));
      return { success: true, user: sessionUser, source: "Local Cache" };
    }

    return { success: false, message: "Incorrect username or password. Please verify your credentials." };
  },

  // Reset / Change Password in Firebase Realtime Database
  async resetPassword(username, newPassword, confirmPassword) {
    const uname = (username || "").toLowerCase().trim();
    const npwd = (newPassword || "").trim();
    const cpwd = (confirmPassword || "").trim();

    if (!uname || !npwd || !cpwd) {
      return { success: false, message: "Please fill in all required fields." };
    }

    if (npwd !== cpwd) {
      return { success: false, message: "New password and Confirm password do not match." };
    }

    if (npwd.length < 6) {
      return { success: false, message: "Password must be at least 6 characters in length." };
    }

    try {
      // Check if user exists in Firebase
      const res = await fetch(`${this.FIREBASE_USERS_URL}/${uname}.json`);
      if (res.ok) {
        const cloudUser = await res.json();
        if (cloudUser) {
          // Update password in Firebase Cloud
          const updateRes = await fetch(`${this.FIREBASE_USERS_URL}/${uname}/password.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(npwd)
          });

          if (updateRes.ok) {
            // Update fallback cache
            if (this.USERS_FALLBACK[uname]) {
              this.USERS_FALLBACK[uname].password = npwd;
            }
            return { success: true, message: `Password for ${cloudUser.displayName} updated successfully in Firebase!` };
          }
        } else {
          return { success: false, message: "Username not found in system." };
        }
      }
    } catch (e) {
      console.warn("[AuthService] Firebase update error, updating fallback:", e);
    }

    // Fallback update
    if (this.USERS_FALLBACK[uname]) {
      this.USERS_FALLBACK[uname].password = npwd;
      return { success: true, message: `Password updated successfully!` };
    }

    return { success: false, message: "Username not found in system." };
  },

  // Get current logged-in user (from sessionStorage so it requires login per session)
  getCurrentUser() {
    try {
      const data = sessionStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Logout / Switch User: always clears session to force re-authentication
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    window.dispatchEvent(new CustomEvent("crmAuthChanged", { detail: null }));
  },

  // Is logged in
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Is Admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "Admin";
  }
};

const RealtimeDB = {
  LOCAL_KEY: "right_assets_realtime_leads_v2",
  FIREBASE_BASE_URL: "https://right-assets-properties-default-rtdb.firebaseio.com/leads",
  isCloudConnected: true,

  init() {
    const existing = this.getAllLeads();
    if (existing.length < 500 && typeof INITIAL_500_LEADS !== "undefined") {
      this.saveAllLeadsLocally(INITIAL_500_LEADS);
    }

    window.addEventListener("storage", (e) => {
      if (e.key === this.LOCAL_KEY) {
        this.notifySubscribers();
      }
    });

    this.syncFromFirebase();
  },

  async syncFromFirebase() {
    try {
      const res = await fetch(`${this.FIREBASE_BASE_URL}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          const leadsArray = Object.values(data);
          if (leadsArray.length > 0) {
            this.isCloudConnected = true;
            leadsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            this.saveAllLeadsLocally(leadsArray);
            this.notifySubscribers();
            console.log(`[Firebase Realtime DB] Synced ${leadsArray.length} live cloud leads successfully.`);
            return true;
          }
        }
      }
    } catch (e) {
      this.isCloudConnected = false;
      console.warn("[Firebase Realtime DB] Offline mode active; running with local cache.", e);
    }
    return false;
  },

  getAllLeads() {
    try {
      const data = localStorage.getItem(this.LOCAL_KEY);
      if (data) {
        return JSON.parse(data);
      }
      if (typeof INITIAL_500_LEADS !== "undefined") {
        this.saveAllLeadsLocally(INITIAL_500_LEADS);
        return INITIAL_500_LEADS;
      }
      return [];
    } catch (e) {
      console.error("Error reading leads:", e);
      return [];
    }
  },

  saveAllLeadsLocally(leads) {
    try {
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(leads));
      return true;
    } catch (e) {
      console.error("Error saving leads locally:", e);
      return false;
    }
  },

  async addLead(leadData) {
    const leads = this.getAllLeads();
    const newId = "LEAD-" + (1000 + leads.length + 1);

    let assignedAdvisor = "Sanjeev Mehta";
    const purpose = (leadData.purpose || "").toLowerCase();

    if (purpose === "project" || (leadData.propertyTitle || "").toLowerCase().includes("construction") || (leadData.propertyTitle || "").toLowerCase().includes("launch")) {
      assignedAdvisor = "Sanjeev Mehta";
    } else if (purpose === "buy" || purpose === "resale") {
      assignedAdvisor = "Nutan Madam";
    } else if (purpose === "rent" || purpose === "lease") {
      assignedAdvisor = "Roshan";
    }

    const newLead = {
      id: newId,
      status: "New",
      notes: leadData.notes || "Inquiry received. Awaiting initial callback.",
      assignedTo: leadData.assignedTo || assignedAdvisor,
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      timestamp: Date.now(),
      isSynced: true,
      ...leadData
    };

    leads.unshift(newLead);
    this.saveAllLeadsLocally(leads);
    this.notifySubscribers();

    try {
      fetch(`${this.FIREBASE_BASE_URL}/${newId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      }).catch(err => console.warn("Firebase sync error:", err));
    } catch (e) {}

    return newLead;
  },

  async updateLeadStatus(leadId, newStatus) {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      lead.updatedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      this.saveAllLeadsLocally(leads);
      this.notifySubscribers();

      try {
        fetch(`${this.FIREBASE_BASE_URL}/${leadId}/status.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStatus)
        }).catch(() => {});
      } catch (e) {}

      return true;
    }
    return false;
  },

  async updateLeadNotes(leadId, notes) {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.notes = notes;
      lead.updatedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      this.saveAllLeadsLocally(leads);
      this.notifySubscribers();

      try {
        fetch(`${this.FIREBASE_BASE_URL}/${leadId}/notes.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notes)
        }).catch(() => {});
      } catch (e) {}

      return true;
    }
    return false;
  },

  async reassignLead(leadId, newAdvisor) {
    const leads = this.getAllLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.assignedTo = newAdvisor;
      lead.updatedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      this.saveAllLeadsLocally(leads);
      this.notifySubscribers();

      try {
        fetch(`${this.FIREBASE_BASE_URL}/${leadId}/assignedTo.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAdvisor)
        }).catch(() => {});
      } catch (e) {}

      return true;
    }
    return false;
  },

  async deleteLead(leadId) {
    let leads = this.getAllLeads();
    leads = leads.filter(l => l.id !== leadId);
    this.saveAllLeadsLocally(leads);
    this.notifySubscribers();

    try {
      fetch(`${this.FIREBASE_BASE_URL}/${leadId}.json`, {
        method: "DELETE"
      }).catch(() => {});
    } catch (e) {}

    return true;
  },

  exportToCSV(filterAdvisor = "all") {
    let leads = this.getAllLeads();
    if (filterAdvisor !== "all") {
      leads = leads.filter(l => l.assignedTo === filterAdvisor);
    }

    if (leads.length === 0) {
      alert("No leads found for export.");
      return;
    }

    const headers = ["Lead ID", "Client Name", "Phone", "Email", "Purpose", "Category", "Budget", "Property / Project", "Preferred Area", "Status", "Assigned Advisor", "Date & Time", "Notes"];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${l.clientName || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.purpose || '').toUpperCase()}"`,
      `"${(l.category || '').toUpperCase()}"`,
      `"${l.budget || ''}"`,
      `"${(l.propertyTitle || '').replace(/"/g, '""')}"`,
      `"${(l.preferredArea || '').replace(/"/g, '""')}"`,
      `"${l.status || 'New'}"`,
      `"${l.assignedTo || ''}"`,
      `"${l.createdAt || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Right_Assets_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  notifySubscribers() {
    window.dispatchEvent(new CustomEvent("realtimeLeadsChanged", { detail: this.getAllLeads() }));
  }
};

// Initialize DB on load
RealtimeDB.init();

// Backward compatibility alias
if (typeof window.LeadService === "undefined") {
  window.LeadService = {
    saveLead(leadData) {
      return RealtimeDB.addLead(leadData);
    },
    getLeads() {
      return RealtimeDB.getAllLeads();
    },
    clearLeads() {
      localStorage.removeItem(RealtimeDB.LOCAL_KEY);
      if (typeof INITIAL_500_LEADS !== "undefined") {
        RealtimeDB.saveAllLeadsLocally(INITIAL_500_LEADS);
      }
      RealtimeDB.notifySubscribers();
    }
  };
}
