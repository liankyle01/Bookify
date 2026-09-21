let selectedRole = '';

function showLoginForm() {
  document.getElementById('loginButtons').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('signUpForm').classList.add('hidden');
}

function showSignUpForm() {
  document.getElementById('loginButtons').classList.add('hidden');
  document.getElementById('signUpForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
}

function backToLoginButtons() {
  document.getElementById('loginButtons').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signUpForm').classList.add('hidden');
  selectedRole = '';
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
}

function selectRole(btn, role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedRole = role;
}

function signup() {
  const name = document.getElementById('signupName').value.trim();
  const username = document.getElementById('signupUsername').value.trim().toLowerCase();
  const id = document.getElementById('signupId').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pw = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();

  if (!name || !username || !id || !email || !pw || !confirm) {
    alert('Please fill in all fields.');
    return;
  }

  if (pw !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  if (!selectedRole) {
    alert('Please select your role (Student, Faculty, or Librarian).');
    return;
  }

  let users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');

  if (users[username]) {
    alert('Username already taken. Please choose another.');
    return;
  }

  users[username] = {
    name: name,
    id: id,
    email: email,
    password: pw,
    role: selectedRole
  };

  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  alert('Account created successfully! You can now log in as "' + username + '".');
  backToLoginButtons();
}

function login() {
  const username = document.getElementById('loginUsername').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value.trim();

  if (!username || !password) {
    alert('Please enter username and password.');
    return;
  }

  let users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const user = users[username];

  if (!user) {
    alert('Username not found. Please sign up first.');
    return;
  }

  if (user.password !== password) {
    alert('Incorrect password. Please try again.');
    return;
  }

  localStorage.setItem('loggedInUser', username);

  if (user.role === 'librarian') {
    window.location.href = 'librarian.html';
  } else if (user.role === 'faculty') {
    window.location.href = 'faculty.html';
  } else {
    window.location.href = 'student.html';
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  }
}

function toggleNotif() {
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

document.addEventListener('click', function(e) {
  const notif = document.getElementById('notifDropdown');
  if (notif && !notif.classList.contains('hidden') && !e.target.closest('.top-bar-icons')) {
    notif.classList.add('hidden');
  }
});

function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function loadNotifications() {
  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const user = users[loggedIn];
  const role = user ? user.role : 'student';

  let notifications = [];

  if (role === 'student') {
    notifications = [
      { icon: '📚', title: 'Due date reminder', body: '"Clean Architecture" is 4 days overdue.', time: 'Today, 9:00 AM' },
      { icon: '💰', title: 'Fine notice', body: 'You have an outstanding fine of ₱20.00.', time: 'Yesterday, 4:30 PM' },
      { icon: '📋', title: 'Reservation update', body: '"Data Structures" — you\'re #2 in queue.', time: 'Yesterday, 10:15 AM' }
    ];
  } else if (role === 'faculty') {
    notifications = [
      { icon: '📚', title: 'Due date reminder', body: '"AI: A Modern Approach" is due in 21 days.', time: 'Today, 9:00 AM' },
      { icon: '📋', title: 'Reservation confirmed', body: '"Deep Learning" — you\'re #1 in queue.', time: 'Yesterday, 3:15 PM' }
    ];
  } else if (role === 'librarian') {
    notifications = [
      { icon: '⚠️', title: 'Overdue alert', body: '"Clean Architecture" — Yumi Nakamura (4 days overdue).', time: 'Today, 8:30 AM' },
      { icon: '📋', title: 'Return confirmation', body: '"Design Patterns" returned by Yumi Nakamura.', time: 'Today, 9:30 AM' },
      { icon: '📋', title: 'Return confirmation', body: '"Clean Architecture" returned by Allyssa Salazar.', time: 'Today, 9:15 AM' }
    ];
  }

  const content = document.getElementById('notifContent');
  const badge = document.getElementById('notifBadge');

  if (content) {
    content.innerHTML = notifications.map(n => `
      <div class="notif-item">
        <strong>${n.icon} ${n.title}</strong>
        ${n.body}
        <span>${n.time}</span>
      </div>
    `).join('');
  }

  if (badge) badge.textContent = notifications.length;
}

function loadProfileIcon() {
  const btn = document.getElementById('profileBtn');
  if (!btn) return;

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const user = users[loggedIn];

  if (!user) return;

  if (user.avatarImage) {
    btn.innerHTML = `<img src="${user.avatarImage}" alt="Profile">`;
  } else if (user.avatar) {
    btn.textContent = user.avatar;
  }
}

function openProfile() {
  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const user = users[loggedIn];

  if (!user) {
    openModal('👤 Profile', '<p style="text-align:center;">Not logged in.</p>');
    return;
  }

  let avatarHTML;
  if (user.avatarImage) {
    avatarHTML = `<img src="${user.avatarImage}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--peach); margin:0 auto 14px; display:block;">`;
  } else if (user.avatar) {
    avatarHTML = `<div style="width:100px; height:100px; border-radius:50%; background:var(--peach); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:40px;">${user.avatar}</div>`;
  } else {
    avatarHTML = `<div style="width:100px; height:100px; border-radius:50%; background:var(--peach); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:40px;">👤</div>`;
  }

  openModal('👤 Profile', `
    <div style="text-align:center; margin-bottom:20px;">
      ${avatarHTML}
      <h3 style="color:var(--maroon); margin-bottom:6px;">${user.name}</h3>
      <p style="color:#8B6B5C; font-size:13px;">@${loggedIn}</p>
      <p style="color:#8B6B5C; font-size:13px;">${user.email}</p>
      <p style="color:#8B6B5C; font-size:13px; font-style:italic;">Role: ${user.role}</p>
    </div>
  `);
}

function openChangePicture() {
  openModal('🖼️ Change Profile Picture', `
    <div class="modal-field">
      <label>Upload an image</label>
      <input type="file" id="avatarUpload" accept="image/*" onchange="previewAvatar(event)">
      <div id="avatarPreview" style="margin-top:12px; text-align:center;"></div>
    </div>
    <div class="modal-field">
      <label>Or pick an emoji</label>
      <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px; margin-top:8px;">
        <button class="modal-btn-small" onclick="setAvatar('👤')">👤</button>
        <button class="modal-btn-small" onclick="setAvatar('🎓')">🎓</button>
        <button class="modal-btn-small" onclick="setAvatar('📚')">📚</button>
        <button class="modal-btn-small" onclick="setAvatar('👨‍🏫')">👨‍🏫</button>
        <button class="modal-btn-small" onclick="setAvatar('🦉')">🦉</button>
        <button class="modal-btn-small" onclick="setAvatar('🐱')">🐱</button>
        <button class="modal-btn-small" onclick="setAvatar('🐼')">🐼</button>
        <button class="modal-btn-small" onclick="setAvatar('🦊')">🦊</button>
        <button class="modal-btn-small" onclick="setAvatar('🌟')">🌟</button>
        <button class="modal-btn-small" onclick="setAvatar('🍕')">🍕</button>
        <button class="modal-btn-small" onclick="setAvatar('⚡')">⚡</button>
        <button class="modal-btn-small" onclick="setAvatar('🎨')">🎨</button>
      </div>
    </div>
  `);
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataURL = canvas.toDataURL('image/jpeg', 0.85);

      const preview = document.getElementById('avatarPreview');
      preview.innerHTML = `
        <img src="${resizedDataURL}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--maroon); margin-bottom:10px;">
        <p style="font-size:11px; color:#8B6B5C; margin-bottom:8px;">Resized to ${width}×${height}px</p>
        <button class="modal-btn" onclick="saveAvatarImage()">Save as Profile Picture</button>
      `;
      preview.dataset.imageData = resizedDataURL;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveAvatarImage() {
  const preview = document.getElementById('avatarPreview');
  const dataURL = preview.dataset.imageData;

  if (!dataURL) {
    alert('No image selected.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  users[loggedIn].avatarImage = dataURL;
  users[loggedIn].avatar = '';
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  addAuditLog('Uploaded profile picture');
  loadProfileIcon();
  alert('Profile picture updated!');
  closeModal();
}

function setAvatar(emoji) {
  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  users[loggedIn].avatar = emoji;
  users[loggedIn].avatarImage = '';
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  addAuditLog('Changed profile picture');
  loadProfileIcon();
  alert('Profile picture updated to ' + emoji);
  closeModal();
}

function openChangeName() {
  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const user = users[loggedIn];

  openModal('✏️ Change Profile Name', `
    <div class="modal-field">
      <label>Full Name</label>
      <input type="text" id="newName" value="${user.name}">
    </div>
    <button class="modal-btn" onclick="saveName()">Save Name</button>
  `);
}

function saveName() {
  const newName = document.getElementById('newName').value.trim();
  if (!newName) {
    alert('Name cannot be empty.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  users[loggedIn].name = newName;
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  addAuditLog('Changed profile name to ' + newName);
  alert('Name updated successfully!');
  closeModal();
}

function openChangeUsername() {
  const loggedIn = localStorage.getItem('loggedInUser');

  openModal('🔤 Change Username', `
    <div class="modal-field">
      <label>New Username</label>
      <input type="text" id="newUsername" placeholder="Enter new username" value="${loggedIn}">
    </div>
    <button class="modal-btn" onclick="saveUsername()">Save Username</button>
  `);
}

function saveUsername() {
  const newUsername = document.getElementById('newUsername').value.trim().toLowerCase();
  const oldUsername = localStorage.getItem('loggedInUser');

  if (!newUsername) {
    alert('Username cannot be empty.');
    return;
  }

  if (newUsername === oldUsername) {
    alert('That is already your username.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');

  if (users[newUsername]) {
    alert('Username already taken.');
    return;
  }

  users[newUsername] = users[oldUsername];
  delete users[oldUsername];
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  localStorage.setItem('loggedInUser', newUsername);
  addAuditLog('Changed username to ' + newUsername);
  alert('Username updated to "' + newUsername + '"!');
  closeModal();
}

function openChangePassword() {
  openModal('🔐 Change Password', `
    <div class="modal-field">
      <label>Current Password</label>
      <input type="password" id="cpCurrent" placeholder="Enter current password">
    </div>
    <div class="modal-field">
      <label>New Password</label>
      <input type="password" id="cpNew" placeholder="Enter new password">
    </div>
    <div class="modal-field">
      <label>Confirm New Password</label>
      <input type="password" id="cpConfirm" placeholder="Confirm new password">
    </div>
    <button class="modal-btn" onclick="savePassword()">Save Password</button>
  `);
}

function savePassword() {
  const current = document.getElementById('cpCurrent').value.trim();
  const newPw = document.getElementById('cpNew').value.trim();
  const confirm = document.getElementById('cpConfirm').value.trim();

  if (!current || !newPw || !confirm) {
    alert('Please fill in all fields.');
    return;
  }

  if (newPw !== confirm) {
    alert('New passwords do not match.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');

  if (users[loggedIn].password !== current) {
    alert('Current password is incorrect.');
    return;
  }

  users[loggedIn].password = newPw;
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  addAuditLog('Changed own password');
  alert('Password updated successfully!');
  closeModal();
}

function openDashboardPanel() {
  openModal('📊 Dashboard Overview', `
    <div class="stats-row" style="margin-bottom:14px;">
      <div class="stat-card"><div class="label">TOTAL</div><div class="value">1,245</div></div>
      <div class="stat-card"><div class="label">AVAIL</div><div class="value">987</div></div>
      <div class="stat-card"><div class="label">BORROW</div><div class="value">198</div></div>
      <div class="stat-card"><div class="label">OVERD</div><div class="value">1</div></div>
    </div>
    <div class="stats-row-2">
      <div class="stat-card"><div class="label">FINES</div><div class="value">₱20</div></div>
      <div class="stat-card"><div class="label">USERS</div><div class="value">156</div></div>
      <div class="stat-card"><div class="label">HOLDS</div><div class="value">12</div></div>
    </div>
  `);
}

function openReports() {
  openModal('📈 Generate Reports', `
    <div class="modal-field">
      <label>Report Type</label>
      <select id="reportType">
        <option>Most Borrowed Books</option>
        <option>Most Active Borrowers</option>
        <option>Overdue Books</option>
        <option>Lost / Damaged Books</option>
        <option>Fine Collection</option>
        <option>Monthly / Annual Statistics</option>
        <option>Inventory Report</option>
      </select>
    </div>
    <div class="modal-field">
      <label>Date Range</label>
      <div class="modal-row">
        <input type="date" id="reportFrom">
        <input type="date" id="reportTo">
      </div>
    </div>
    <div class="modal-field">
      <label>Format</label>
      <select id="reportFormat">
        <option>PDF</option>
        <option>CSV</option>
      </select>
    </div>
    <button class="modal-btn" onclick="generateReport()">Generate Report</button>
  `);
}

function generateReport() {
  const type = document.getElementById('reportType').value;
  const format = document.getElementById('reportFormat').value;
  const from = document.getElementById('reportFrom').value || 'N/A';
  const to = document.getElementById('reportTo').value || 'N/A';

  addAuditLog('Generated report: ' + type + ' (' + format + ')');
  alert('Report Generated!\n\nType: ' + type + '\nRange: ' + from + ' to ' + to + '\nFormat: ' + format);
  closeModal();
}

function openManageUsers() {
  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  let rows = '';

  if (Object.keys(users).length === 0) {
    rows = '<p style="text-align:center;color:#8B6B5C;">No users registered yet.</p>';
  } else {
    for (const username in users) {
      const u = users[username];
      rows += `
        <div class="modal-list-item">
          <div>
            <strong>${u.name}</strong><br>
            <span class="modal-meta">@${username} · ${u.role} · ${u.email}</span>
          </div>
          <button class="modal-btn-small" onclick="removeUser('${username}')">Remove</button>
        </div>
      `;
    }
  }

  openModal('👥 Manage Users', rows);
}

function removeUser(username) {
  if (!confirm('Remove user "' + username + '"?')) return;

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  delete users[username];
  localStorage.setItem('bookifyUsers', JSON.stringify(users));
  addAuditLog('Removed user: ' + username);
  openManageUsers();
}

function openPolicies() {
  const prefs = JSON.parse(localStorage.getItem('bookifyPreferences') || '{}');

  openModal('⚙️ Configure Policies', `
    <div class="modal-field">
      <label>Fine Rate per Day (₱)</label>
      <input type="number" id="policyFineRate" value="${prefs.fineRate || 5}">
    </div>
    <div class="modal-field">
      <label>Lost Item Threshold (days)</label>
      <input type="number" id="policyLostThreshold" value="${prefs.lostThreshold || 3}">
    </div>
    <div class="modal-field">
      <label>Student Borrow Limit (books)</label>
      <input type="number" id="policyStudentLimit" value="${prefs.studentLimit || 3}">
    </div>
    <div class="modal-field">
      <label>Faculty Borrow Limit (books)</label>
      <input type="number" id="policyFacultyLimit" value="${prefs.facultyLimit || 5}">
    </div>
    <div class="modal-field">
      <label>Hold Expiration (hours)</label>
      <input type="number" id="policyHoldExpiration" value="${prefs.holdExpiration || 24}">
    </div>
    <button class="modal-btn" onclick="savePolicies()">Save Policies</button>
  `);
}

function savePolicies() {
  const prefs = {
    fineRate: document.getElementById('policyFineRate').value,
    lostThreshold: document.getElementById('policyLostThreshold').value,
    studentLimit: document.getElementById('policyStudentLimit').value,
    facultyLimit: document.getElementById('policyFacultyLimit').value,
    holdExpiration: document.getElementById('policyHoldExpiration').value
  };

  localStorage.setItem('bookifyPreferences', JSON.stringify(prefs));
  addAuditLog('Updated library policies');

  if (typeof loadPreferences === 'function') loadPreferences();
  alert('Policies saved successfully!');
  closeModal();
}

function openAuditTrail() {
  const logs = JSON.parse(localStorage.getItem('bookifyAuditLog') || '[]');

  let rows = '';
  if (logs.length === 0) {
    rows = '<p style="text-align:center;color:#8B6B5C;">No activity logged yet.</p>';
  } else {
    logs.slice().reverse().forEach(log => {
      rows += `
        <div class="modal-list-item">
          <div>
            <strong>${log.action}</strong><br>
            <span class="modal-meta">${log.user} · ${log.timestamp}</span>
          </div>
        </div>
      `;
    });
  }

  openModal('📋 Audit Trail', rows);
}

function addAuditLog(action) {
  const logs = JSON.parse(localStorage.getItem('bookifyAuditLog') || '[]');
  const username = localStorage.getItem('loggedInUser') || 'unknown';
  const now = new Date().toLocaleString();
  logs.push({ user: username, action: action, timestamp: now });
  localStorage.setItem('bookifyAuditLog', JSON.stringify(logs));
}

function buildCalendar(gridId, monthId) {
  const grid = document.getElementById(gridId);
  const monthLabel = monthId ? document.getElementById(monthId) : null;
  if (!grid) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (monthLabel) monthLabel.textContent = monthNames[month] + ' ' + year;

  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  grid.innerHTML = '';

  dayNames.forEach(d => {
    const el = document.createElement('div');
    el.className = 'calendar-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'calendar-day';
    el.style.opacity = '0';
    grid.appendChild(el);
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const currentUser = users[loggedIn];
  const role = currentUser ? currentUser.role : 'student';

  let dueDates = [];
  let overdueDates = [];
  let returnedDates = [];

  if (role === 'student') {
    dueDates = [];
    overdueDates = [17];
    returnedDates = [12];
  } else if (role === 'faculty') {
    dueDates = [];
    overdueDates = [];
    returnedDates = [15];
  } else if (role === 'librarian') {
    dueDates = [];
    overdueDates = [17];
    returnedDates = [12, 15];
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'calendar-day';
    el.textContent = d;

    if (d === todayDate) el.classList.add('today');
    if (returnedDates.includes(d)) el.classList.add('returned');
    else if (overdueDates.includes(d) && d < todayDate) el.classList.add('overdue');
    else if (dueDates.includes(d)) el.classList.add('due');

    el.onclick = () => showDayDetails(d, monthNames[month], year);
    grid.appendChild(el);
  }
}

function showDayDetails(day, month, year) {
  const dateKey = `${month} ${day}, ${year}`;

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const currentUser = users[loggedIn];
  const role = currentUser ? currentUser.role : 'student';

  let booksByDate = {};

  if (role === 'student') {
    booksByDate = {
      'September 17, 2026': [
        { title: 'Clean Architecture', overdue: true }
      ],
      'September 12, 2026': [
        { title: 'Design Patterns', returned: true }
      ]
    };
  } else if (role === 'faculty') {
    booksByDate = {
      'September 15, 2026': [
        { title: 'Clean Architecture', returned: true }
      ]
    };
  } else if (role === 'librarian') {
    booksByDate = {
      'September 12, 2026': [
        { title: 'Design Patterns', borrower: 'Yumi Nakamura', returned: true }
      ],
      'September 15, 2026': [
        { title: 'Clean Architecture', borrower: 'Allyssa Salazar', returned: true }
      ],
      'September 17, 2026': [
        { title: 'Clean Architecture', borrower: 'Yumi Nakamura', overdue: true }
      ]
    };
  }

  const books = booksByDate[dateKey];
  const isLibrarian = role === 'librarian';

  let bodyHTML = '';

  if (!books || books.length === 0) {
    bodyHTML = `
      <p style="text-align:center; color:#8B6B5C; font-style:italic; padding:20px;">
        No books on this date.
      </p>
    `;
  } else {
    bodyHTML = books.map(book => `
      <div class="modal-list-item">
        <div>
          <strong>${book.title}</strong>
          ${book.overdue ? '<span style="color:var(--red); font-size:11px; font-weight:700;"> ⚠️ OVERDUE</span>' : ''}
          ${book.returned ? '<span style="color:var(--green); font-size:11px; font-weight:700;"> ✓ RETURNED</span>' : ''}
          ${isLibrarian && book.borrower ? `<br><span class="modal-meta">Borrowed by: ${book.borrower}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  openModal('📅 ' + dateKey, bodyHTML);
}

function handleBookSearch(query) {
  const results = document.getElementById('searchResults');
  if (!results) return;

  query = query.trim().toLowerCase();

  if (query.length === 0) {
    results.innerHTML = '';
    return;
  }

  const users = JSON.parse(localStorage.getItem('bookifyUsers') || '{}');
  const loggedIn = localStorage.getItem('loggedInUser');
  const currentUser = users[loggedIn];
  const role = currentUser ? currentUser.role : 'student';

  const bookCatalog = [
    { title: 'Intro to Algorithms', author: 'Cormen', isbn: '978-0262033848', category: 'Computer Science', year: 2009, available: false },
    { title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', category: 'Programming', year: 2008, available: false },
    { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: 'Programming', year: 1994, available: true },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', category: 'Programming', year: 1999, available: true },
    { title: 'Clean Architecture', author: 'Robert Martin', isbn: '978-0134494166', category: 'Programming', year: 2017, available: false },
    { title: 'Data Structures', author: 'Mark Allen Weiss', isbn: '978-0132576277', category: 'Computer Science', year: 2013, available: false },
    { title: 'Deep Learning', author: 'Ian Goodfellow', isbn: '978-0262035613', category: 'AI', year: 2016, available: true },
    { title: 'Python for Data Analysis', author: 'Wes McKinney', isbn: '978-1491957660', category: 'Data Science', year: 2017, available: true },
    { title: 'Computer Networks', author: 'Andrew Tanenbaum', isbn: '978-0132126953', category: 'Networking', year: 2010, available: true },
    { title: 'AI: A Modern Approach', author: 'Stuart Russell', isbn: '978-0136042594', category: 'AI', year: 2009, available: true }
  ];

  const peopleCatalog = [
    { name: 'Yumi Nakamura', username: 'yumi', role: 'student', email: 'yumi@bookify.edu', id: '2024-001' },
    { name: 'Allyssa Salazar', username: 'allyssa', role: 'faculty', email: 'allyssa@bookify.edu', id: 'FAC-001' }
  ];

  const transactionsCatalog = [
    { action: 'Yumi Nakamura returned "Design Patterns"', date: '09/12/2026', time: '3:40 PM' },
    { action: 'Allyssa Salazar returned "Clean Architecture"', date: '09/15/2026', time: '11:20 AM' },
    { action: 'Yumi Nakamura borrowed "Clean Architecture"', date: '09/10/2026', time: '2:15 PM' },
    { action: 'Allyssa Salazar borrowed "Clean Architecture"', date: '09/01/2026', time: '9:30 AM' }
  ];

  const bookMatches = bookCatalog.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.isbn.toLowerCase().includes(query) ||
    book.category.toLowerCase().includes(query) ||
    String(book.year).includes(query)
  );

  const peopleMatches = peopleCatalog.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.username.toLowerCase().includes(query) ||
    p.role.toLowerCase().includes(query) ||
    p.email.toLowerCase().includes(query) ||
    p.id.toLowerCase().includes(query)
  );

  const txnMatches = transactionsCatalog.filter(t =>
    t.action.toLowerCase().includes(query) ||
    t.date.includes(query)
  );

  let html = '';

  if (role === 'librarian') {
    if (bookMatches.length > 0) {
      html += '<div class="search-group-label">📚 Books</div>';
      html += bookMatches.slice(0, 4).map(book => `
        <div class="search-result-item" onclick="showBookDetails('${book.title.replace(/'/g, "\\'")}')">
          <strong>${book.title}</strong>
          <span>${book.author} · ${book.category} · ${book.year}</span>
          <span style="color:${book.available ? 'var(--green)' : 'var(--red)'}; font-weight:700; font-size:11px; margin-left:6px;">
            ${book.available ? '● Available' : '● Unavailable'}
          </span>
        </div>
      `).join('');
    }

    if (peopleMatches.length > 0) {
      html += '<div class="search-group-label">👤 People</div>';
      html += peopleMatches.slice(0, 4).map(p => `
        <div class="search-result-item" onclick="showPersonDetails('${p.username}')">
          <strong>${p.name}</strong>
          <span>@${p.username} · ${p.role} · ${p.email}</span>
        </div>
      `).join('');
    }

    if (txnMatches.length > 0) {
      html += '<div class="search-group-label">🔄 Transactions</div>';
      html += txnMatches.slice(0, 4).map(t => `
        <div class="search-result-item">
          <strong>${t.action}</strong>
          <span>${t.date} · ${t.time}</span>
        </div>
      `).join('');
    }

    if (!html) {
      html = '<p class="search-empty">No results found.</p>';
    }
  } else {
    if (bookMatches.length === 0) {
      results.innerHTML = '<p class="search-empty">No books found.</p>';
      return;
    }
    html = bookMatches.slice(0, 5).map(book => `
      <div class="search-result-item" onclick="showBookDetails('${book.title.replace(/'/g, "\\'")}')">
        <strong>${book.title}</strong>
        <span>${book.author} · ${book.category} · ${book.year}</span>
        <span style="color:${book.available ? 'var(--green)' : 'var(--red)'}; font-weight:700; font-size:11px; margin-left:6px;">
          ${book.available ? '● Available' : '● Unavailable'}
        </span>
      </div>
    `).join('');
  }

  results.innerHTML = html;
}

function showPersonDetails(username) {
  const peopleCatalog = [
    { name: 'Yumi Nakamura', username: 'yumi', role: 'student', email: 'yumi@bookify.edu', id: '2024-001' },
    { name: 'Allyssa Salazar', username: 'allyssa', role: 'faculty', email: 'allyssa@bookify.edu', id: 'FAC-001' }
  ];

  const person = peopleCatalog.find(p => p.username === username);
  if (!person) return;

  openModal('👤 ' + person.name, `
    <div style="text-align:center; margin-bottom:20px;">
      <div style="width:80px; height:80px; border-radius:50%; background:var(--peach); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:36px;">👤</div>
      <h3 style="color:var(--maroon); margin-bottom:6px;">${person.name}</h3>
      <p style="color:#8B6B5C; font-size:13px; margin-bottom:4px;">@${person.username}</p>
      <p style="color:#8B6B5C; font-size:13px; margin-bottom:4px;">${person.email}</p>
      <p style="color:#8B6B5C; font-size:13px; margin-bottom:4px;">ID: ${person.id}</p>
      <p style="color:#8B6B5C; font-size:13px; font-style:italic;">Role: ${person.role}</p>
    </div>
  `);
}

function showBookDetails(title) {
  const bookCatalog = [
    { title: 'Intro to Algorithms', author: 'Cormen', isbn: '978-0262033848', category: 'Computer Science', year: 2009, available: false },
    { title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', category: 'Programming', year: 2008, available: false },
    { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: 'Programming', year: 1994, available: true },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', category: 'Programming', year: 1999, available: true },
    { title: 'Clean Architecture', author: 'Robert Martin', isbn: '978-0134494166', category: 'Programming', year: 2017, available: false },
    { title: 'Data Structures', author: 'Mark Allen Weiss', isbn: '978-0132576277', category: 'Computer Science', year: 2013, available: false },
    { title: 'Deep Learning', author: 'Ian Goodfellow', isbn: '978-0262035613', category: 'AI', year: 2016, available: true },
    { title: 'Python for Data Analysis', author: 'Wes McKinney', isbn: '978-1491957660', category: 'Data Science', year: 2017, available: true },
    { title: 'Computer Networks', author: 'Andrew Tanenbaum', isbn: '978-0132126953', category: 'Networking', year: 2010, available: true },
    { title: 'AI: A Modern Approach', author: 'Stuart Russell', isbn: '978-0136042594', category: 'AI', year: 2009, available: true }
  ];

  const book = bookCatalog.find(b => b.title === title);
  if (!book) return;

  const actionBtn = book.available
    ? `<button class="modal-btn" onclick="alert('Borrow request sent!'); closeModal();">Borrow This Book</button>`
    : `<button class="modal-btn" style="background:var(--peach);" onclick="alert('Reservation placed! You will be notified when available.'); closeModal();">Reserve This Book</button>`;

  openModal('📖 ' + book.title, `
    <div style="text-align:center; margin-bottom:20px;">
      <h3 style="color:var(--maroon); margin-bottom:8px;">${book.title}</h3>
      <p style="color:#8B6B5C; font-size:13px; margin-bottom:4px;">by ${book.author}</p>
      <p style="color:#8B6B5C; font-size:12px; font-style:italic;">${book.category} · ${book.year}</p>
      <p style="color:#8B6B5C; font-size:12px;">ISBN: ${book.isbn}</p>
      <p style="color:${book.available ? 'var(--green)' : 'var(--red)'}; font-size:12px; font-weight:700; margin-top:8px;">
        ${book.available ? '● Available' : '● Currently Unavailable'}
      </p>
    </div>
    ${actionBtn}
  `);
}