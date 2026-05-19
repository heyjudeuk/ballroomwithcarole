(function () {
  const BALLROOM = ['Waltz', 'Foxtrot', 'Quickstep', 'Tango', 'Viennese Waltz'];
  const LATIN    = ['Cha Cha Cha', 'Jive', 'Rumba', 'Samba', 'Paso Doble'];
  const ROUND_TIME = 10;

  let streak      = 0;
  let currentStyle = null;
  let correctSet   = null;
  let remaining    = 0;
  let timerInterval = null;
  let timeLeft     = ROUND_TIME;
  let roundActive  = false;

  const modal       = document.getElementById('dance-game-modal');
  const playArea    = document.getElementById('game-play-area');
  const resultArea  = document.getElementById('game-result');
  const stylePrompt = document.getElementById('game-style-prompt');
  const timerFill   = document.getElementById('game-timer-fill');
  const timerText   = document.getElementById('game-timer-text');
  const danceGrid   = document.getElementById('game-dance-grid');
  const streakEl    = document.getElementById('game-streak-count');
  const resultTitle = document.getElementById('game-result-title');
  const resultMsg   = document.getElementById('game-result-msg');
  const resultStreak = document.getElementById('game-result-streak');
  const nextBtn     = document.getElementById('game-next-btn');
  const closeBtn    = document.getElementById('game-close-btn');

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function openGame() {
    modal.classList.remove('game-hidden');
    document.body.style.overflow = 'hidden';
    startRound();
  }

  function closeGame() {
    modal.classList.add('game-hidden');
    document.body.style.overflow = '';
    clearInterval(timerInterval);
    roundActive = false;
    streak = 0;
    updateStreakDisplay();
  }

  function startRound() {
    currentStyle = Math.random() < 0.5 ? 'BALLROOM' : 'LATIN';
    correctSet   = new Set(currentStyle === 'BALLROOM' ? BALLROOM : LATIN);
    remaining    = correctSet.size;
    timeLeft     = ROUND_TIME;
    roundActive  = true;

    stylePrompt.textContent = currentStyle;
    stylePrompt.className   = 'game-style-prompt ' + (currentStyle === 'BALLROOM' ? 'style-ballroom' : 'style-latin');

    danceGrid.innerHTML = '';
    shuffle([...BALLROOM, ...LATIN]).forEach(dance => {
      const btn = document.createElement('button');
      btn.className    = 'game-dance-btn';
      btn.textContent  = dance;
      btn.dataset.dance = dance;
      btn.addEventListener('click', () => handleTap(dance, btn));
      danceGrid.appendChild(btn);
    });

    playArea.classList.remove('game-hidden');
    resultArea.classList.add('game-hidden');

    updateStreakDisplay();
    updateTimer();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) endRound(false, 'time');
    }, 1000);
  }

  function updateTimer() {
    const pct = Math.max(0, (timeLeft / ROUND_TIME) * 100);
    timerFill.style.width = pct + '%';
    timerText.textContent = timeLeft + 's';
    timerFill.classList.toggle('timer-urgent', timeLeft <= 3);
  }

  function handleTap(dance, btn) {
    if (!roundActive || btn.disabled) return;

    if (correctSet.has(dance)) {
      btn.classList.add('dance-correct');
      btn.disabled = true;
      remaining--;
      if (remaining === 0) endRound(true);
    } else {
      btn.classList.add('dance-wrong');
      endRound(false, 'wrong', dance);
    }
  }

  function endRound(success, reason, wrongDance) {
    roundActive = false;
    clearInterval(timerInterval);

    if (success) {
      streak++;
    } else {
      streak = 0;
    }
    updateStreakDisplay();

    // Reveal any un-tapped correct dances
    setTimeout(() => {
      danceGrid.querySelectorAll('.game-dance-btn').forEach(btn => {
        btn.disabled = true;
        if (correctSet.has(btn.dataset.dance) && !btn.classList.contains('dance-correct')) {
          btn.classList.add('dance-reveal');
        }
      });
    }, 200);

    setTimeout(() => {
      playArea.classList.add('game-hidden');
      resultArea.classList.remove('game-hidden');

      const styleName = currentStyle.charAt(0) + currentStyle.slice(1).toLowerCase();

      if (success) {
        resultTitle.textContent = 'Well done!';
        resultMsg.textContent   = `You found all five ${styleName} dances.`;
        nextBtn.textContent     = 'Next round';
        if (streak > 1) {
          resultStreak.textContent = `Streak: ${streak}`;
          resultStreak.classList.remove('game-hidden');
        } else {
          resultStreak.classList.add('game-hidden');
        }
      } else if (reason === 'time') {
        resultTitle.textContent = "Time's up!";
        resultMsg.textContent   = `You were finding the ${styleName} dances.`;
        nextBtn.textContent     = 'Try again';
        resultStreak.classList.add('game-hidden');
      } else {
        const actualStyle = LATIN.includes(wrongDance) ? 'Latin' : 'Ballroom';
        resultTitle.textContent = 'Not quite!';
        resultMsg.textContent   = `${wrongDance} is a ${actualStyle} dance.`;
        nextBtn.textContent     = 'Try again';
        resultStreak.classList.add('game-hidden');
      }
    }, success ? 700 : 950);
  }

  function updateStreakDisplay() {
    streakEl.textContent = streak;
  }

  // Make pills interactive
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', openGame);
  });

  closeBtn.addEventListener('click', closeGame);
  nextBtn.addEventListener('click', startRound);
  modal.addEventListener('click', e => { if (e.target === modal) closeGame(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('game-hidden')) closeGame();
  });
})();
