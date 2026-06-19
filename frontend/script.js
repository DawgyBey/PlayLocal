/**
 * PlayLocal — Premium Architecture & Matchmaking Core Initialization Engine
 * Deployment Year Focus: 2026
 */

// Global App State Core Architecture
const PlayLocalEngine = {
  state: {
    currentActiveView: 'landing',
    authenticatedUser: null,
    registeredMatches: [
      {
        id: "m-1",
        sport: "Futsal",
        location: "Nagarjun Futsal Arena, Balaju",
        dateTime: "2026-06-25T18:30",
        playersNeeded: 10,
        joinedPlayers: ["Sulav A.", "Rohan S.", "Niranjan K.", "Aman T."],
        organizer: "Sulav Adhikari",
        organizerPhone: "+977 9851012345",
        teamFilings: "Need defensive balance",
        notes: "Field split cost approximate NPR 1500 total."
      },
      {
        id: "m-2",
        sport: "Basketball",
        location: "Baneshwor Recreational Center",
        dateTime: "2026-06-26T16:00",
        playersNeeded: 6,
        joinedPlayers: ["Prasanna M.", "Bibek K."],
        organizer: "Prasanna",
        organizerPhone: "+977 9841987654",
        teamFilings: "Half-court 3v3 pick-up game",
        notes: "Indoor court."
      },
      {
        id: "m-3",
        sport: "Badminton",
        location: "Lalitpur Badminton Academy",
        dateTime: "2026-06-24T07:00",
        playersNeeded: 2,
        joinedPlayers: ["Sneha S.", "Kriti P."],
        organizer: "Sneha Sharma",
        organizerPhone: "+977 9803112233",
        teamFilings: "Doubles practice",
        notes: "Yonex Mavis 350 shuttles provided."
      },
      {
        id: "m-4",
        sport: "Cricket",
        location: "St Xavier's Ground, Jawalakhel",
        dateTime: "2026-06-28T09:00",
        playersNeeded: 14,
        joinedPlayers: ["Rajesh H.", "Dipesh L.", "Suman T."],
        organizer: "Rajesh Hamal",
        organizerPhone: "+977 9818554433",
        teamFilings: "T20 friendly tape-ball match",
        notes: "Bring your own bats."
      }
    ],
    filters: {
      sport: 'all',
      location: '',
      time: 'all'
    }
  },

  // Toast Messaging Engine Injection Hook
  showNotification: function (message, variant = 'success') {
    const stack = document.getElementById('toastContainer');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast-message-card variant-${variant}`;
    toast.innerText = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  },

  // Client Routing System Implementation
  navigateTo: function (targetViewId) {
    const sections = document.querySelectorAll('.page-container');
    sections.forEach(sec => {
      if (sec.id === targetViewId) {
        sec.style.display = 'block';
        sec.setAttribute('aria-hidden', 'false');
      } else {
        sec.style.display = 'none';
        sec.setAttribute('aria-hidden', 'true');
      }
    });

    // Update Navigation UI link focuses
    document.querySelectorAll('.nav-link-item').forEach(btn => {
      if (btn.getAttribute('data-page') === targetViewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.state.currentActiveView = targetViewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Specialized Client Data Synchronization Core Engine
  syncDataMetrics: function () {
    const totalMatchesNode = document.getElementById('totalMatches');
    if (totalMatchesNode) {
      totalMatchesNode.innerText = this.state.registeredMatches.length;
    }
  },

  // Perform Rendering Overhaul for Live Listings Matrix Grid
  renderMatchListings: function () {
    const listGrid = document.getElementById('matchList');
    if (!listGrid) return;

    listGrid.innerHTML = '';

    const filteredSet = this.state.registeredMatches.filter(item => {
      const matchSport = this.state.filters.sport === 'all' || item.sport === this.state.filters.sport;
      const matchLoc = !this.state.filters.location || item.location.toLowerCase().includes(this.state.filters.location.toLowerCase());

      let matchTime = true;
      if (this.state.filters.time === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        matchTime = item.dateTime.startsWith(todayStr);
      }
      return matchSport && matchLoc && matchTime;
    });

    if (filteredSet.length === 0) {
      listGrid.innerHTML = `
        <div class="empty-state-card-wrapper" style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-surface-1); border-radius: var(--radius-md);">
          <div style="font-size: 40px; margin-bottom: 16px;">👟</div>
          <h4 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 8px;">No Matches Found</h4>
          <p style="color: var(--color-text-secondary); font-size: 14px;">Modify your parametric settings or step up to host the first game.</p>
        </div>
      `;
      return;
    }

    filteredSet.forEach(match => {
      const card = document.createElement('div');
      card.className = 'premium-match-listing-card';

      let sportEmoji = '⚽';
      let accentClass = 'color-futsal';
      if (match.sport === 'Basketball') { sportEmoji = '🏀'; accentClass = 'color-basketball'; }
      if (match.sport === 'Badminton') { sportEmoji = '🏸'; accentClass = 'color-badminton'; }
      if (match.sport === 'Cricket') { sportEmoji = '🏏'; accentClass = 'color-cricket'; }

      const totalSlots = match.playersNeeded;
      const filledSlots = match.joinedPlayers.length;
      const progressPercent = Math.min(100, (filledSlots / totalSlots) * 100);

      card.innerHTML = `
        <div class="card-dynamic-header-strip">
          <div class="sport-identity-row">
            <span class="sport-icon-badge">${sportEmoji}</span>
            <span class="sport-name-label" style="font-weight: 600; font-size: 14px;">${match.sport}</span>
          </div>
          <span class="skill-tag-capsule">Open Roster</span>
        </div>
        <h3 class="venue-display-heading" style="font-size: 18px; margin-bottom: 8px;">${match.location}</h3>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px;">
          📅 ${new Date(match.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        
        <div class="roster-allocation-indicator-block">
          <div class="roster-numeric-meta">
            <span>Roster Space</span>
            <strong>${filledSlots} / ${totalSlots} Slots Filled</strong>
          </div>
          <div class="progress-track-bar">
            <div class="progress-filled-bar" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--bg-surface-2);">
          <span style="font-size: 12px; color: var(--color-text-muted);">By: ${match.organizer}</span>
          <button class="action-btn-primary size-md" style="padding: 8px 16px; font-size: 12px;">Inspect & Join</button>
        </div>
      `;

      card.addEventListener('click', () => this.hydrateAndShowDetails(match.id));
      listGrid.appendChild(card);
    });
  },

  // Hydrate Dynamic Match Specification Detail Window Template View
  hydrateAndShowDetails: function (matchId) {
    const targetMatch = this.state.registeredMatches.find(m => m.id === matchId);
    const contentBox = document.getElementById('matchDetailsContent');
    if (!targetMatch || !contentBox) return;

    const isUserInRoster = this.state.authenticatedUser && targetMatch.joinedPlayers.includes(this.state.authenticatedUser.name);

    contentBox.innerHTML = `
      <div style="background: var(--bg-surface-1); border: 1px solid var(--bg-surface-2); border-radius: var(--radius-lg); padding: 40px; margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="background: var(--color-primary-muted); color: var(--color-primary); font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: var(--radius-full); text-transform: uppercase;">⚡ Active Match Specifications</span>
            <h2 class="kinetic-display-title" style="font-size: 36px; margin-top: 12px; margin-bottom: 8px;">${targetMatch.location}</h2>
            <p style="color: var(--color-text-secondary); font-size: 15px;">Host Manager Architect: <strong>${targetMatch.organizer}</strong></p>
          </div>
          <button id="joinRosterActionBtn" class="action-btn-primary size-lg">
            ${isUserInRoster ? 'Leave Match Roster' : 'Secure Entry Spot Now'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; background: var(--bg-surface-2); padding: 24px; border-radius: var(--radius-md);">
          <div>
            <span style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">Sport Classification</span>
            <span style="font-size: 16px; font-weight: 600;">${targetMatch.sport}</span>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">Kickoff Schedule</span>
            <span style="font-size: 16px; font-weight: 600;">${new Date(targetMatch.dateTime).toLocaleString()}</span>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">Roster Targets</span>
            <span style="font-size: 16px; font-weight: 600;">Need ${targetMatch.playersNeeded} Athletes Total</span>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">Contact Line</span>
            <span style="font-size: 16px; font-weight: 600; color: var(--color-primary);">${targetMatch.organizerPhone}</span>
          </div>
        </div>

        <div style="margin-bottom: 32px;">
          <h4 style="font-family: var(--font-display); font-size: 18px; margin-bottom: 12px;">Strategic Alignment Goals</h4>
          <p style="background: rgba(0,0,0,0.15); padding: 16px; border-radius: var(--radius-sm); font-size: 14px; line-height: 1.6; border-left: 3px solid var(--color-primary);">${targetMatch.teamFilings}</p>
        </div>

        ${targetMatch.notes ? `
        <div style="margin-bottom: 32px;">
          <h4 style="font-family: var(--font-display); font-size: 18px; margin-bottom: 12px;">Operational Directives Notes</h4>
          <p style="color: var(--color-text-secondary); font-size: 14px; line-height: 1.5;">${targetMatch.notes}</p>
        </div>
        ` : ''}

        <div>
          <h4 style="font-family: var(--font-display); font-size: 18px; margin-bottom: 16px;">Current Roster Composition (${targetMatch.joinedPlayers.length} Confirmed)</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            ${targetMatch.joinedPlayers.map(p => `
              <div style="background: var(--bg-surface-2); border: 1px solid var(--bg-surface-3); padding: 10px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; background: var(--accent-badminton); border-radius: var(--radius-full);"></span>
                ${p}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Hook Up Roster Alteration Actions Securely
    document.getElementById('joinRosterActionBtn').addEventListener('click', () => {
      if (!this.state.authenticatedUser) {
        this.showNotification("Authentication Required. Route to Account registration.", "warning");
        this.navigateTo('auth');
        return;
      }

      const userName = this.state.authenticatedUser.name;
      if (targetMatch.joinedPlayers.includes(userName)) {
        targetMatch.joinedPlayers = targetMatch.joinedPlayers.filter(p => p !== userName);
        this.showNotification("Roster reservation canceled.");
      } else {
        if (targetMatch.joinedPlayers.length >= targetMatch.playersNeeded) {
          this.showNotification("Target match roster composition is entirely filled.", "warning");
          return;
        }
        targetMatch.joinedPlayers.push(userName);
        this.showNotification("Secured spot on the active match roster.");
      }
      this.hydrateAndShowDetails(matchId);
    });

    this.navigateTo('details');
  },

  // Initialize Core Interface Event Wiring Pipeline
  bindEventHandlers: function () {
    // 1. Client Structural Dynamic View Swapping Listeners
    document.querySelectorAll('[data-page]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const dest = e.currentTarget.getAttribute('data-page');
        this.navigateTo(dest);
      });
    });

    // Logo routing redirect
    document.getElementById('navLogoBtn').addEventListener('click', () => this.navigateTo('landing'));

    // 2. Mobile Responsive Menu Toggle Trigger Linkages
    const burgerToggle = document.getElementById('mobileToggle');
    const navLinksNode = document.getElementById('navLinks');
    if (burgerToggle && navLinksNode) {
      burgerToggle.addEventListener('click', () => {
        const isActive = navLinksNode.classList.toggle('mobile-active');
        burgerToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
    }

    // 3. Match List Client Parameter Filters Linkages
    ['filterSport', 'filterTime'].forEach(id => {
      const node = document.getElementById(id);
      if (node) {
        node.addEventListener('change', (e) => {
          const prop = id === 'filterSport' ? 'sport' : 'time';
          this.state.filters[prop] = e.target.value;
          this.renderMatchListings();
        });
      }
    });

    const locFilter = document.getElementById('filterLocation');
    if (locFilter) {
      locFilter.addEventListener('input', (e) => {
        this.state.filters.location = e.target.value;
        this.renderMatchListings();
      });
    }

    const resetFiltersBtn = document.getElementById('clearFilters');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        this.state.filters = { sport: 'all', location: '', time: 'all' };
        if (document.getElementById('filterSport')) document.getElementById('filterSport').value = 'all';
        if (document.getElementById('filterTime')) document.getElementById('filterTime').value = 'all';
        if (document.getElementById('filterLocation')) document.getElementById('filterLocation').value = '';
        this.renderMatchListings();
        this.showNotification("Ecosystem search configuration parameters reset successfully.");
      });
    }

    // 4. Form Submission Engine Validation & Control Closures
    const createForm = document.getElementById('createMatchForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Native Architectural Form Field Validation Bounds Enforcement
        if (!createForm.checkValidity()) {
          this.showNotification("Structural validation failure. Populate required inputs.", "warning");
          createForm.classList.add('was-validated');
          return;
        }

        const newMatch = {
          id: `m-${Date.now()}`,
          sport: document.getElementById('sportType').value,
          location: document.getElementById('location').value,
          dateTime: document.getElementById('dateTime').value,
          playersNeeded: parseInt(document.getElementById('playersNeeded').value, 10),
          joinedPlayers: [document.getElementById('organizer').value],
          organizer: document.getElementById('organizer').value,
          organizerPhone: document.getElementById('organizerPhone').value,
          teamFilings: document.getElementById('teamFilings').value,
          notes: document.getElementById('notes').value
        };

        this.state.registeredMatches.unshift(newMatch);
        this.syncDataMetrics();
        this.renderMatchListings();
        createForm.reset();

        this.showNotification("Match hosted successfully. Broadcasted to local networks.");
        this.navigateTo('matches');
      });
    }

    // 5. Traditional Auth Identity Emulation Tab System Wire-up
    const authTabButtons = document.querySelectorAll('.auth-tab-toggle-trigger');
    authTabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        authTabButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const mode = e.currentTarget.getAttribute('data-tab');
        if (mode === 'login') {
          document.getElementById('loginForm').style.display = 'block';
          document.getElementById('registerForm').style.display = 'none';
        } else {
          document.getElementById('loginForm').style.display = 'none';
          document.getElementById('registerForm').style.display = 'block';
        }
      });
    });

    const loginFormNode = document.getElementById('loginForm');
    if (loginFormNode) {
      loginFormNode.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        // Mock validation closure
        this.state.authenticatedUser = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          type: 'StandardEmailAthlete'
        };
        this.syncUserSessionUI();
        this.showNotification("Authenticated successfully via email mapping.");
        this.navigateTo('matches');
      });
    }

    // 6. Return Actions Linkages
    document.getElementById('backToMatches').addEventListener('click', () => this.navigateTo('matches'));
  },

  // Interface Synchronization Loop reflective of active Identity Profile States
  syncUserSessionUI: function () {
    const wrapper = document.getElementById('userBadgeProfile');
    const displayToken = document.getElementById('userBadge');
    const authNavNode = document.getElementById('authNavBtn');

    if (this.state.authenticatedUser) {
      if (authNavNode) authNavNode.style.display = 'none';
      if (wrapper) wrapper.style.display = 'flex';
      if (displayToken) displayToken.innerText = this.state.authenticatedUser.name.substring(0, 2);
    } else {
      if (authNavNode) authNavNode.style.display = 'block';
      if (wrapper) wrapper.style.display = 'none';
    }
  },

  // Main Startup Hook Entry point definition
  start: function () {
    this.bindEventHandlers();
    this.syncDataMetrics();
    this.renderMatchListings();
    console.log("PlayLocal Matchmaking Architecture initialized successfully for production context (2026).");
  }
};

// Fire up core system on layout readiness validation
document.addEventListener('DOMContentLoaded', () => {
  PlayLocalEngine.start();
});

// Expose Secure SSO Redirect Reference for Global API Frames
window.handleCredentialResponse = function (response) {
  try {
    // Structural JWT Parse Emulation Vector
    PlayLocalEngine.state.authenticatedUser = {
      name: "G-USER",
      email: "googleathlete@playlocal.np",
      type: "FederatedGoogleSSO"
    };
    PlayLocalEngine.syncUserSessionUI();
    PlayLocalEngine.showNotification("Google Account authenticated successfully.");

    // Prompt Phone Verification Layer Overlay Step
    const modal = document.getElementById('phoneModal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    console.error("SSO Token parse failure runtime trap: ", err);
  }
};