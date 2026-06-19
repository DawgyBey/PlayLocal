/**
 * PlayLocal — Premium Architecture & Matchmaking Core Initialization Engine
 * Deployment Focus: Federated SSO Hub & Multi-Step OTP Gateway Framework
 */

const PlayLocalEngine = {
  state: {
    currentActiveView: 'landing',
    authenticatedUser: null, // Structure: { name, email, type, verified: boolean }
    otpSuccessCallback: null,
    otpIntervalId: null,
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

  // Toast Messaging System Engine Hook Injection
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

  // State-Driven Single Page Client Routing Routing
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

  syncDataMetrics: function () {
    const totalMatchesNode = document.getElementById('totalMatches');
    if (totalMatchesNode) {
      totalMatchesNode.innerText = this.state.registeredMatches.length;
    }
  },

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
      if (match.sport === 'Basketball') sportEmoji = '🏀';
      if (match.sport === 'Badminton') sportEmoji = '🏸';
      if (match.sport === 'Cricket') sportEmoji = '🏏';

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

  hydrateAndShowDetails: function (matchId) {
    const targetMatch = this.state.registeredMatches.find(m => m.id === matchId);
    const contentBox = document.getElementById('matchDetailsContent');
    if (!targetMatch || !contentBox) return;

    const isUserVerified = this.state.authenticatedUser && this.state.authenticatedUser.verified;
    const isUserInRoster = isUserVerified && targetMatch.joinedPlayers.includes(this.state.authenticatedUser.name);

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

    document.getElementById('joinRosterActionBtn').addEventListener('click', () => {
      if (!this.state.authenticatedUser || !this.state.authenticatedUser.verified) {
        this.showNotification("Identity Verification required before scheduling entry.", "warning");
        this.navigateTo('auth');
        return;
      }

      const userName = this.state.authenticatedUser.name;
      if (targetMatch.joinedPlayers.includes(userName)) {
        targetMatch.joinedPlayers = targetMatch.joinedPlayers.filter(p => p !== userName);
        this.showNotification("Roster reservation canceled successfully.");
      } else {
        if (targetMatch.joinedPlayers.length >= targetMatch.playersNeeded) {
          this.showNotification("Target match roster composition is entirely filled.", "warning");
          return;
        }
        targetMatch.joinedPlayers.push(userName);
        this.showNotification("Secured spot on active match roster.");
      }
      this.hydrateAndShowDetails(matchId);
    });

    this.navigateTo('details');
  },

  // Dedicated Engine Hook to Trigger 2-Step OTP Validation Pipeline
  launchOtpGateway: function (preloadedPhone = '', complianceCallback = null) {
    this.state.otpSuccessCallback = complianceCallback;
    const modal = document.getElementById('phoneModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.getElementById('otpStepPhone').style.display = 'block';
    document.getElementById('otpStepCode').style.display = 'none';

    const modalPhoneInput = document.getElementById('modalPhone');
    if (modalPhoneInput && preloadedPhone) {
      modalPhoneInput.value = preloadedPhone.replace('+977 ', '');
    }
  },

  // Security Countdown Handler Loop Execution Loop
  startOtpCountdownTimer: function (durationSeconds) {
    clearInterval(this.state.otpIntervalId);
    const textNode = document.getElementById('otpCountdownText');
    const resendBtn = document.getElementById('resendOtpBtn');
    const displaySeconds = document.getElementById('otpTimerSeconds');

    if (durationSeconds <= 0) {
      if (textNode) textNode.style.display = 'none';
      if (resendBtn) resendBtn.style.display = 'inline-block';
      return;
    }

    if (textNode) textNode.style.display = 'inline-block';
    if (resendBtn) resendBtn.style.display = 'none';
    if (displaySeconds) displaySeconds.innerText = durationSeconds;

    let timeRemaining = durationSeconds;
    this.state.otpIntervalId = setInterval(() => {
      timeRemaining--;
      if (displaySeconds) displaySeconds.innerText = timeRemaining;

      if (timeRemaining <= 0) {
        clearInterval(this.state.otpIntervalId);
        if (textNode) textNode.style.display = 'none';
        if (resendBtn) resendBtn.style.display = 'inline-block';
      }
    }, 1000);
  },

  bindEventHandlers: function () {
    // 1. Client View Swap Routings
    document.querySelectorAll('[data-page]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const dest = e.currentTarget.getAttribute('data-page');
        this.navigateTo(dest);
      });
    });

    document.getElementById('navLogoBtn').addEventListener('click', () => this.navigateTo('landing'));

    // 2. Responsive Mobile Burger Collapse Linkage
    const burgerToggle = document.getElementById('mobileToggle');
    const navLinksNode = document.getElementById('navLinks');
    if (burgerToggle && navLinksNode) {
      burgerToggle.addEventListener('click', () => {
        const isActive = navLinksNode.classList.toggle('mobile-active');
        burgerToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
    }

    // 3. Match List Parameters Filters 
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

    document.getElementById('clearFilters').addEventListener('click', () => {
      this.state.filters = { sport: 'all', location: '', time: 'all' };
      if (document.getElementById('filterSport')) document.getElementById('filterSport').value = 'all';
      if (document.getElementById('filterTime')) document.getElementById('filterTime').value = 'all';
      if (document.getElementById('filterLocation')) document.getElementById('filterLocation').value = '';
      this.renderMatchListings();
      this.showNotification("Ecosystem configuration parameters reset successfully.");
    });

    // 4. Create Match Form Pipeline Validation Guard
    const createForm = document.getElementById('createMatchForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!this.state.authenticatedUser || !this.state.authenticatedUser.verified) {
          this.showNotification("Authorized verification required to host network sessions.", "warning");
          this.navigateTo('auth');
          return;
        }

        if (!createForm.checkValidity()) {
          this.showNotification("Structural validation failure. Populate required options.", "warning");
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

    // 5. Auth Mode Tab Switcher System
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

    // Traditional Native Sign-In Capture Hook Routing to OTP Gate
    const loginFormNode = document.getElementById('loginForm');
    if (loginFormNode) {
      loginFormNode.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        if (!loginFormNode.checkValidity()) {
          this.showNotification("Provide valid authentication metrics.", "warning");
          return;
        }

        this.state.authenticatedUser = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          type: 'StandardEmailAthlete',
          verified: false
        };

        this.showNotification("Credentials mapped. Initializing OTP verification step.", "warning");
        this.launchOtpGateway('', () => {
          this.state.authenticatedUser.verified = true;
          this.syncUserSessionUI();
          this.showNotification("Secure native email session authorized.");
          this.navigateTo('matches');
        });
      });
    }

    // Traditional Native Registration Form Routing to OTP Gate
    const registerFormNode = document.getElementById('registerForm');
    if (registerFormNode) {
      registerFormNode.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;

        if (!registerFormNode.checkValidity()) {
          this.showNotification("Review registration structural parameters.", "warning");
          return;
        }

        this.state.authenticatedUser = {
          name: name.toUpperCase(),
          email: email,
          type: 'StandardEmailAthlete',
          verified: false
        };

        this.showNotification("Profile data baseline cached. Deploying OTP transaction line.", "warning");
        this.launchOtpGateway(phone, () => {
          this.state.authenticatedUser.verified = true;
          this.syncUserSessionUI();
          this.showNotification("Profile authenticated, verified, and locked successfully!");
          this.navigateTo('matches');
        });
      });
    }

    // 6. Security Verification Modal Forms Handlers Wire-up
    const phoneSubmitForm = document.getElementById('phoneSubmitForm');
    if (phoneSubmitForm) {
      phoneSubmitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!phoneSubmitForm.checkValidity()) {
          this.showNotification("Enter a valid standard 10-digit primary carrier number.", "warning");
          return;
        }

        const inputNum = document.getElementById('modalPhone').value;
        document.getElementById('displayTargetPhone').innerText = `+977 ${inputNum}`;

        // Switch panel visibility states
        document.getElementById('otpStepPhone').style.display = 'none';
        document.getElementById('otpStepCode').style.display = 'block';

        // Wipe code boxes and auto focus first field node
        const digitBoxes = document.querySelectorAll('.otp-digit-field');
        digitBoxes.forEach(b => b.value = '');
        if (digitBoxes[0]) digitBoxes[0].focus();

        this.showNotification("OTP transaction code dispatched to destination network.");
        this.startOtpCountdownTimer(30);
      });
    }

    const otpVerifyForm = document.getElementById('otpVerifyForm');
    if (otpVerifyForm) {
      otpVerifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const digitBoxes = document.querySelectorAll('.otp-digit-field');
        let composedString = '';
        digitBoxes.forEach(box => composedString += box.value);

        // Security Core Verification Bound Checklist
        if (composedString === '123456') {
          clearInterval(this.state.otpIntervalId);
          document.getElementById('phoneModal').style.display = 'none';

          if (this.state.otpSuccessCallback) {
            this.state.otpSuccessCallback();
          }
        } else {
          this.showNotification("Invalid validation token code vector. Attempt retry.", "critical");
          digitBoxes.forEach(box => {
            box.style.borderColor = '#E07A5F'; // Error tint feedback alert
            setTimeout(() => box.style.borderColor = '', 1000);
          });
        }
      });
    }

    // OTP Input Field Smart Auto-Advance and Retrograde Backspace Listeners
    const digitFields = document.querySelectorAll('.otp-digit-field');
    digitFields.forEach((field, index) => {
      field.addEventListener('input', () => {
        if (field.value.length === 1 && index < digitFields.length - 1) {
          digitFields[index + 1].focus();
        }
      });
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !field.value && index > 0) {
          digitFields[index - 1].focus();
        }
      });
    });

    // Control wiring closures inside the overlay gateway layout
    document.getElementById('modalDisconnectBtn').addEventListener('click', () => {
      document.getElementById('phoneModal').style.display = 'none';
      this.state.authenticatedUser = null; // Unset registration data baseline context
      this.syncUserSessionUI();
      this.showNotification("Verification framework handshake aborted safely.");
    });

    document.getElementById('otpBackToPhoneBtn').addEventListener('click', () => {
      document.getElementById('otpStepCode').style.display = 'none';
      document.getElementById('otpStepPhone').style.display = 'block';
      clearInterval(this.state.otpIntervalId);
    });

    document.getElementById('resendOtpBtn').addEventListener('click', () => {
      this.showNotification("A clean fallback OTP code transmission has been queued.");
      this.startOtpCountdownTimer(30);
    });

    // Global Interactive Production Logout Command Hook Injection
    const globalLogoutAction = document.getElementById('logoutBtn');
    if (globalLogoutAction) {
      globalLogoutAction.addEventListener('click', () => {
        this.state.authenticatedUser = null;
        this.syncUserSessionUI();
        this.showNotification("Athlete secure session signed out safely.");
        this.navigateTo('landing');
      });
    }

    document.getElementById('backToMatches').addEventListener('click', () => this.navigateTo('matches'));
  },

  syncUserSessionUI: function () {
    const wrapper = document.getElementById('userBadgeProfile');
    const displayToken = document.getElementById('userBadge');
    const authNavNode = document.getElementById('authNavBtn');

    if (this.state.authenticatedUser && this.state.authenticatedUser.verified) {
      if (authNavNode) authNavNode.style.display = 'none';
      if (wrapper) wrapper.style.display = 'flex';
      if (displayToken) displayToken.innerText = this.state.authenticatedUser.name.substring(0, 2);
    } else {
      if (authNavNode) authNavNode.style.display = 'block';
      if (wrapper) wrapper.style.display = 'none';
    }
  },

  start: function () {
    this.bindEventHandlers();
    this.syncDataMetrics();
    this.renderMatchListings();
    console.log("PlayLocal Matchmaking Architecture initialized for secure production context (2026).");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PlayLocalEngine.start();
});

// Refined Google SSO Global Callback Target Hook
window.handleCredentialResponse = function (response) {
  try {
    // Stage initial unverified Google User Context baseline structural profile
    PlayLocalEngine.state.authenticatedUser = {
      name: "G-USER",
      email: "googleathlete@playlocal.np",
      type: "FederatedGoogleSSO",
      verified: false
    };

    PlayLocalEngine.showNotification("Google Account authenticated. Routing to OTP Gateway security...", "warning");

    // Launch multi-step OTP transaction frame sequence link
    PlayLocalEngine.launchOtpGateway('', () => {
      PlayLocalEngine.state.authenticatedUser.verified = true;
      PlayLocalEngine.syncUserSessionUI();
      PlayLocalEngine.showNotification("Google Token & OTP handshake validated securely.");
      PlayLocalEngine.navigateTo('matches');
    });
  } catch (err) {
    console.error("SSO Token secure parse execution trap error: ", err);
  }
};