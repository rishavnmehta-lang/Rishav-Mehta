// Animate individual math symbols in header background
function animateMathSymbols() {
  const header = document.querySelector('header');
  const symbols = ['∑', '∫', 'π', '÷', '×', '∞', '√', '°', '±', '+', '-', '=', '≠', '≈', '≤', '≥', 'Δ', '∇', 'θ', 'σ', 'λ', 'μ', 'Σ', 'Ω', 'β', 'γ', 'ψ', 'κ', 'φ', 'η', 'χ', 'ρ', 'ζ', 'τ', 'Λ', 'Φ', 'ω', 'ξ', 'ν'];
  
  // Create style for symbol animations
  const style = document.createElement('style');
  let animationCSS = `
    .math-symbol {
      position: absolute;
      font-size: 56px;
      font-weight: 900;
      opacity: 0.25;
      pointer-events: none;
      color: rgba(255, 255, 255, 0.9);
      transform: translate(-50%, -50%);
    }
  `;
  
  const symbolCount = 150;
  
  // Create unique animations for each symbol
  for (let i = 0; i < symbolCount; i++) {
    const duration = 5 + Math.random() * 5; // 5-10 seconds
    const delay = Math.random() * 2;
    const distance = 2 + Math.random() * 4; // Very small movement
    const vertDistance = 2 + Math.random() * 4; // Very small vertical movement
    
    animationCSS += `
      .symbol-${i} {
        animation: float-${i} ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
      }
      @keyframes float-${i} {
        0% { transform: translate(-50%, -50%) translateX(0) translateY(0); }
        25% { transform: translate(-50%, -50%) translateX(${distance}px) translateY(-${vertDistance}px); }
        50% { transform: translate(-50%, -50%) translateX(0) translateY(-${vertDistance * 0.6}px); }
        75% { transform: translate(-50%, -50%) translateX(-${distance}px) translateY(-${vertDistance}px); }
        100% { transform: translate(-50%, -50%) translateX(0) translateY(0); }
      }
    `;
  }
  
  style.innerHTML = animationCSS;
  document.head.appendChild(style);
  
  // Create math symbol elements
  for (let i = 0; i < 150; i++) {
    const symbol = document.createElement('div');
    symbol.className = `math-symbol symbol-${i}`;
    symbol.textContent = symbols[i % symbols.length];
    symbol.style.left = Math.random() * 90 + 5 + '%';
    symbol.style.top = Math.random() * 90 + 5 + '%';
    header.appendChild(symbol);
  }
}

function enablePremiumFeatures() {
  const emergencyButton = document.querySelector('.emergency-button');
  const waitlistButton = document.querySelector('.waitlist-button');
  const upgradeButton = document.querySelector('.upgrade-button');

  if (emergencyButton) {
    emergencyButton.disabled = false;
  }
  if (waitlistButton) {
    waitlistButton.disabled = false;
  }
  if (upgradeButton) {
    upgradeButton.style.display = 'none';
  }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', () => {
  animateMathSymbols();
  initializeWaitlistTimes();
  if (sessionStorage.getItem('premiumUnlocked') === 'true') {
    enablePremiumFeatures();
  }
  if (!waitlistRotateInterval) {
    waitlistRotateInterval = setInterval(rotateWaitlist, 10000);
  }
});

function updateWaitlistTimerDisplay(item) {
  const waitSpan = item.querySelector('.wait-time');
  if (!waitSpan) {
    return;
  }

  const remainingSeconds = Number(item.dataset.remaining) || 0;
  const displayMinutes = Math.max(0, Math.ceil(remainingSeconds / 60));
  waitSpan.innerText = `${displayMinutes} min`;
}

function createWaitlistItem(name, minutes) {
  const item = document.createElement('li');
  item.innerHTML = `<strong>${name}</strong> — <span class="wait-time"></span>`;
  item.dataset.remaining = String(minutes * 60);
  updateWaitlistTimerDisplay(item);
  return item;
}

function initializeWaitlistTimes() {
  const body = document.getElementById('waitlistBody');
  if (!body) {
    return;
  }

  let minutes = 2;
  const items = body.querySelectorAll('li');
  items.forEach(item => {
    item.dataset.remaining = String(minutes * 60);
    updateWaitlistTimerDisplay(item);
    minutes += 2 + Math.floor(Math.random() * 3); // increase by 2-4 minutes per position
  });
}

let waitlistRotateInterval = null;

// This file sends the user's question to Python and shows the AI response. 
async function askAI() { 
 const userInput = document.getElementById("userInput").value;  const responseBox = document.getElementById("responseBox"); 
 if (userInput.trim() === "") { 
 responseBox.innerText = "Please type a question first.";  return; 
 } 
 responseBox.innerText = "Thinking..."; 
 try { 
 const response = await fetch("http://127.0.0.1:5000/ask", { 
 method: "POST", 
 headers: { 
 "Content-Type": "application/json" 
 }, 
 body: JSON.stringify({ 
 message: userInput 
 }) 
 }); 
 const data = await response.json(); 
 responseBox.innerText = data.reply; 
 } catch (error) { 
 responseBox.innerText = "Something went wrong. Check that app.py is running."; 
 console.error(error); 
 } 
}

function emergencyHelp() {
  const responseBox = document.getElementById("responseBox");
  const telLink = 'tel:+17134593987';
  responseBox.innerText = 'Emergency help is on the way for you muma!';

  const tempLink = document.createElement('a');
  tempLink.href = telLink;
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}

const fakeWaitlistNames = ['Kayla R.', 'Jamal P.', 'Leah T.', 'Chris N.', 'Mia S.', 'Devon M.', 'Sophia L.', 'Noah B.', 'Zara K.', 'Alex W.', 'Maya H.', 'Ethan J.', 'Lina V.', 'Omar S.', 'Jenna K.'];

function getRandomWaitTime(minWait = 2) {
  const offset = 2 + Math.floor(Math.random() * 4); // add 2-5 minutes
  const nextMinutes = Math.min(minWait + offset, 59);
  return nextMinutes;
}

function pickNextFakeName(excludedNames) {
  const available = fakeWaitlistNames.filter(name => !excludedNames.includes(name));
  if (!available.length) {
    return fakeWaitlistNames[Math.floor(Math.random() * fakeWaitlistNames.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

function rotateWaitlist() {
  const body = document.getElementById('waitlistBody');
  if (!body) {
    return;
  }

  const items = Array.from(body.querySelectorAll('li'));
  if (items.length === 0) {
    return;
  }

  items.forEach(item => {
    const remaining = Number(item.dataset.remaining) || 0;
    item.dataset.remaining = String(Math.max(remaining - 10, 0));
    updateWaitlistTimerDisplay(item);
  });

  const firstItem = items[0];
  if (firstItem && Number(firstItem.dataset.remaining) === 0) {
    firstItem.remove();
    const existingNames = Array.from(body.querySelectorAll('li strong')).map(strong => strong.innerText);
    const lastItem = body.querySelector('li:last-child');
    const lastMinutes = lastItem ? Math.max(Math.ceil(Number(lastItem.dataset.remaining) / 60), 1) : 1;
    const nextName = pickNextFakeName(existingNames);
    const nextWait = getRandomWaitTime(lastMinutes);
    const newItem = createWaitlistItem(nextName, nextWait);
    body.appendChild(newItem);
  }
}

function isPremiumUnlocked() {
  return sessionStorage.getItem('premiumUnlocked') === 'true';
}

function openVenmoApp(url) {
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.location.href = url;
}

function upgradeNow() {
  const responseBox = document.getElementById("responseBox");
  responseBox.innerText = '';
  sessionStorage.setItem('premiumUnlocked', 'true');
  enablePremiumFeatures();
  const venmoAppUrl = 'venmo://paycharge?txn=pay&recipients=RishavAiforMuma&amount=22&note=Upgrade';
  openVenmoApp(venmoAppUrl);

}

function openWaitlist() {
  if (!isPremiumUnlocked()) {
    const responseBox = document.getElementById('responseBox');
    if (responseBox) {
      responseBox.innerText = 'Please upgrade your account to use this button.';
    }
    return;
  }

  const popup = document.getElementById('waitlistPopup');
  if (popup) {
    popup.style.display = 'flex';
    if (!waitlistRotateInterval) {
      waitlistRotateInterval = setInterval(rotateWaitlist, 10000);
    }
    updateWaitlistAddState();
  }
}

function closeWaitlist() {
  const popup = document.getElementById('waitlistPopup');
  if (popup) {
    popup.style.display = 'none';
  }
  if (waitlistRotateInterval) {
    clearInterval(waitlistRotateInterval);
    waitlistRotateInterval = null;
  }
}

function canJoinWaitlist() {
  const lastTimestamp = localStorage.getItem('waitlistJoinedAt');
  if (!lastTimestamp) {
    return { allowed: true };
  }

  const elapsed = Date.now() - Number(lastTimestamp);
  const cooldown = 60 * 60 * 1000;
  if (elapsed >= cooldown) {
    return { allowed: true };
  }

  const remainingMinutes = Math.ceil((cooldown - elapsed) / 60000);
  return { allowed: false, remainingMinutes };
}

function setWaitlistCooldown() {
  localStorage.setItem('waitlistJoinedAt', Date.now().toString());
}

function updateWaitlistAddState() {
  const nameInput = document.getElementById('waitlistNameInput');
  const addButton = document.getElementById('waitlistAddButton');
  const statusMessage = document.getElementById('waitlistStatusMessage');
  if (!nameInput || !addButton || !statusMessage) {
    return;
  }

  const name = nameInput.value.trim();
  const cooldown = canJoinWaitlist();
  const premiumUnlocked = isPremiumUnlocked();

  if (!premiumUnlocked) {
    statusMessage.innerText = 'Please upgrade your account before adding a name to the waitlist.';
    addButton.disabled = false;
    return;
  }

  if (!name) {
    statusMessage.innerText = '';
    addButton.disabled = false;
    return;
  }

  if (!cooldown.allowed) {
    statusMessage.innerText = `You have already joined the waitlist. You can still view it, but you cannot add another name for ${cooldown.remainingMinutes} more minute(s).`;
    addButton.disabled = false;
  } else {
    statusMessage.innerText = '';
    addButton.disabled = false;
  }
}

const nameInput = document.getElementById('waitlistNameInput');
if (nameInput) {
  nameInput.addEventListener('input', updateWaitlistAddState);
}

function addWaitlistEntry() {
  const nameInput = document.getElementById('waitlistNameInput');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) {
    alert('Please enter your name to join the waitlist.');
    return;
  }

  const cooldown = canJoinWaitlist(name);
  if (!cooldown.allowed) {
    updateWaitlistAddState();
    return;
  }

  const body = document.getElementById('waitlistBody');
  if (!body) {
    return;
  }

  const lastItem = body.querySelector('li:last-child');
  const lastMinutes = lastItem ? Math.max(Math.ceil(Number(lastItem.dataset.remaining) / 60), 1) : 1;
  const waitTime = getRandomWaitTime(lastMinutes);
  const newItem = createWaitlistItem(name, waitTime);
  body.appendChild(newItem);
  setWaitlistCooldown(name);
  nameInput.value = '';
  updateWaitlistAddState();
}

function closeVideoPopup() {
  // This function is no longer used, but remains in case the page still references it.
}
