/**
 * VerdantPulse - Main Application Controller
 * Coordinates Trails Data, TabPFN Predictor, Gemma 2 Engine, and Audio Companion.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const trailSelect = document.getElementById("trail-select");
  const btnGenerate = document.getElementById("btn-generate");
  const btnPocketMode = document.getElementById("btn-pocket-mode");
  const offlineToggle = document.getElementById("offline-toggle");
  const networkStatusPill = document.getElementById("network-status-pill");
  const networkStatusText = document.getElementById("network-status-text");
  const networkStatusDot = document.getElementById("network-status-dot");

  // TabPFN Elements
  const gaugeFill = document.getElementById("gauge-fill");
  const gaugeScore = document.getElementById("gauge-score");
  const foliageStageTitle = document.getElementById("foliage-stage-title");
  const foliageDesc = document.getElementById("foliage-desc");
  const colorSwatch = document.getElementById("color-swatch");
  const colorName = document.getElementById("color-name");
  const metricElevation = document.getElementById("metric-elevation");
  const metricTemp = document.getElementById("metric-temp");
  const metricFooting = document.getElementById("metric-footing");
  const forecastBarsContainer = document.getElementById("forecast-bars");

  // Gemma Field Card Elements
  const fieldCardContent = document.getElementById("field-card-content");
  const telemetryModel = document.getElementById("telemetry-model");
  const telemetryLatency = document.getElementById("telemetry-latency");
  const telemetryTokens = document.getElementById("telemetry-tokens");

  // Audio & Ambient Elements
  const btnToggleSpeech = document.getElementById("btn-toggle-speech");
  const btnToggleAmbient = document.getElementById("btn-toggle-ambient");
  const soundWaveAnim = document.getElementById("sound-wave-anim");
  const ambientStatusText = document.getElementById("ambient-status-text");

  // Pocket Mode Overlay Elements
  const pocketOverlay = document.getElementById("pocket-mode-overlay");
  const btnExitPocket = document.getElementById("btn-exit-pocket");
  const pocketTimer = document.getElementById("pocket-timer");
  const pocketTrailName = document.getElementById("pocket-trail-name");
  const btnLogGrass = document.getElementById("btn-log-grass");
  const journalLogContainer = document.getElementById("journal-log-container");

  // Settings Modal Elements
  const btnOpenSettings = document.getElementById("btn-open-settings");
  const btnCloseSettings = document.getElementById("btn-close-settings");
  const settingsModal = document.getElementById("settings-modal");
  const inputElevenLabsKey = document.getElementById("input-elevenlabs-key");
  const inputOllamaUrl = document.getElementById("input-ollama-url");
  const selectGemmaVariant = document.getElementById("select-gemma-variant");
  const btnSaveSettings = document.getElementById("btn-save-settings");

  // Application State
  let currentTrail = TRAILS_DATABASE[0];
  let currentTabpfnResult = null;
  let currentFieldCardText = "";
  let pocketTimerInterval = null;
  let pocketSecondsElapsed = 0;
  let isOffline = false;

  // Initialize Trail Selector Options
  function initTrailSelector() {
    trailSelect.innerHTML = "";
    TRAILS_DATABASE.forEach(trail => {
      const option = document.createElement("option");
      option.value = trail.id;
      option.textContent = `${trail.name} — ${trail.region.split(",")[0]}`;
      trailSelect.appendChild(option);
    });

    trailSelect.addEventListener("change", (e) => {
      const selected = TRAILS_DATABASE.find(t => t.id === e.target.value);
      if (selected) {
        currentTrail = selected;
        executeInferencePipeline();
      }
    });
  }

  // Get current season condition simulation
  function getCurrentConditions(trail) {
    // Current early-mid October day of year (approx day 285)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    let dayOfYear = Math.floor(diff / oneDay);
    if (dayOfYear < 250 || dayOfYear > 320) {
      dayOfYear = 282; // Default to prime fall foliage window
    }

    // Lapse rate estimate based on elevation
    const baseTemp = 14.5;
    const elevationLapse = (trail.elevationMeters / 1000) * 6.5;
    const meanTemp = Math.round((baseTemp - elevationLapse) * 10) / 10;

    return {
      dayOfYear: dayOfYear,
      elevation: trail.elevationMeters,
      latitude: trail.latitude,
      meanTemp: meanTemp,
      rainLast7d: 18.0,
      canopyCoverage: 85,
      weatherDesc: meanTemp < 8 ? "Crisp Autumn Chill" : "Mild Sunny Ridge"
    };
  }

  // Execute complete TabPFN + Gemma Pipeline
  async function executeInferencePipeline() {
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = `<span class="spin">⏳</span> Synthesizing Field Intelligence...`;

    const conditions = getCurrentConditions(currentTrail);

    // 1. Run TabPFN Tabular Foundation Model Prediction
    currentTabpfnResult = tabpfnPredictor.predict(currentTrail.historicalTabularData, conditions);
    updateTabPFNDisplay(currentTabpfnResult, conditions);

    // 2. Run Gemma 2 Open-Weight Field Naturalist Engine
    try {
      const gemmaResult = await gemmaEngine.generateFieldCard(currentTrail, currentTabpfnResult, conditions);
      currentFieldCardText = gemmaResult.content;
      updateGemmaDisplay(gemmaResult);
    } catch (err) {
      console.error("Gemma inference error", err);
      fieldCardContent.textContent = "Error generating field card. Local weights ready.";
    } finally {
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = `<span>✨</span> Generate 60s Field Card`;
    }
  }

  // Update UI with TabPFN predictions
  function updateTabPFNDisplay(result, conditions) {
    // Circular Gauge update
    const circumference = 283;
    const offset = circumference - (result.foliageScore / 100) * circumference;
    gaugeFill.style.strokeDashoffset = offset;
    gaugeFill.style.stroke = result.dominantColor;
    gaugeScore.textContent = `${result.foliageScore}%`;

    foliageStageTitle.textContent = result.stage;
    foliageDesc.textContent = result.stageDesc;
    colorSwatch.style.background = result.dominantColor;
    colorSwatch.style.boxShadow = `0 0 10px ${result.dominantColor}`;
    colorName.textContent = result.colorName;
    colorName.style.color = result.dominantColor;

    metricElevation.textContent = `${currentTrail.elevationMeters}m`;
    metricTemp.textContent = `${conditions.meanTemp}°C`;
    metricFooting.textContent = `${result.footingGrade.level}`;
    metricFooting.style.color = result.footingGrade.badgeColor;

    // Render 7-day forecast bars
    forecastBarsContainer.innerHTML = "";
    result.forecastCurve.forEach(item => {
      const col = document.createElement("div");
      col.className = "forecast-col";

      const valLabel = document.createElement("div");
      valLabel.className = "forecast-val-label";
      valLabel.textContent = `${item.score}%`;

      const bar = document.createElement("div");
      bar.className = "forecast-bar";
      bar.style.height = `${Math.max(10, (item.score / 100) * 60)}px`;
      if (item.score >= 85) {
        bar.style.background = "linear-gradient(180deg, #c0392b, #e67e22)";
      } else {
        bar.style.background = "linear-gradient(180deg, #f39c12, #27ae60)";
      }

      const dayLabel = document.createElement("div");
      dayLabel.className = "forecast-day-label";
      dayLabel.textContent = item.label;

      col.appendChild(valLabel);
      col.appendChild(bar);
      col.appendChild(dayLabel);
      forecastBarsContainer.appendChild(col);
    });
  }

  // Update UI with Gemma 2 Output
  function updateGemmaDisplay(result) {
    fieldCardContent.innerHTML = formatMarkdownToHtml(result.content);
    telemetryModel.textContent = result.model;
    telemetryLatency.textContent = `${result.latencyMs}ms`;
    telemetryTokens.textContent = `${result.tokens} tok`;
  }

  // Simple Markdown Formatter
  function formatMarkdownToHtml(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // Offline Mode Switch Handler
  offlineToggle.addEventListener("change", (e) => {
    isOffline = e.target.checked;
    gemmaEngine.isOfflineMode = isOffline;
    if (isOffline) {
      networkStatusText.textContent = "Offline Trail Mode (Local Gemma & TabPFN Active)";
      networkStatusDot.className = "status-dot offline";
      networkStatusPill.style.borderColor = "rgba(52, 152, 219, 0.4)";
    } else {
      networkStatusText.textContent = "Online Mode (Localhost / Cloud Fallback)";
      networkStatusDot.className = "status-dot";
      networkStatusPill.style.borderColor = "var(--border-subtle)";
    }
  });

  // Audio Companion Event Listeners
  btnToggleSpeech.addEventListener("click", () => {
    if (audioCompanion.isSpeaking) {
      audioCompanion.stopSpeech();
      btnToggleSpeech.classList.remove("active");
    } else {
      btnToggleSpeech.classList.add("active");
      audioCompanion.speakFieldCard(
        currentFieldCardText,
        (engineName) => {
          btnToggleSpeech.title = `Speaking: ${engineName}`;
        },
        () => {
          btnToggleSpeech.classList.remove("active");
          btnToggleSpeech.title = "Read Field Card Aloud";
        }
      );
    }
  });

  btnToggleAmbient.addEventListener("click", () => {
    const isPlaying = audioCompanion.toggleAmbientSoundscape();
    if (isPlaying) {
      btnToggleAmbient.classList.add("active");
      soundWaveAnim.classList.remove("paused");
      ambientStatusText.textContent = "Forest Soundscape Playing (Procedural Web Audio)";
    } else {
      btnToggleAmbient.classList.remove("active");
      soundWaveAnim.classList.add("paused");
      ambientStatusText.textContent = "Forest Soundscape Off";
    }
  });

  // Pocket Mode Implementation ("Touch Grass" Screen-Minimizing Mode)
  btnPocketMode.addEventListener("click", () => {
    enterPocketMode();
  });

  btnExitPocket.addEventListener("click", () => {
    exitPocketMode();
  });

  function enterPocketMode() {
    pocketOverlay.classList.add("active");
    pocketTrailName.textContent = currentTrail.name;
    pocketSecondsElapsed = 0;
    updatePocketTimerDisplay();

    // Start background presence timer
    pocketTimerInterval = setInterval(() => {
      pocketSecondsElapsed++;
      updatePocketTimerDisplay();

      // Every 15 minutes (or 60 seconds in demo), ring mindfulness chime
      if (pocketSecondsElapsed > 0 && pocketSecondsElapsed % 60 === 0) {
        audioCompanion.playMindfulnessChime();
      }
    }, 1000);

    // Gentle tactile chime upon entering pocket
    audioCompanion.playMindfulnessChime();
  }

  function exitPocketMode() {
    pocketOverlay.classList.remove("active");
    clearInterval(pocketTimerInterval);

    // Save to Nature Journal if spent more than 10 seconds
    if (pocketSecondsElapsed >= 10) {
      const minutes = Math.max(1, Math.round(pocketSecondsElapsed / 60));
      saveJournalEntry({
        trailName: currentTrail.name,
        minutesOffScreen: minutes,
        date: new Date().toLocaleDateString(),
        foliageIndex: currentTabpfnResult ? currentTabpfnResult.foliageScore : 85
      });
    }
  }

  function updatePocketTimerDisplay() {
    const mins = Math.floor(pocketSecondsElapsed / 60).toString().padStart(2, '0');
    const secs = (pocketSecondsElapsed % 60).toString().padStart(2, '0');
    pocketTimer.textContent = `${mins}:${secs}`;
  }

  // Nature Journal Local Storage
  function saveJournalEntry(entry) {
    const logs = JSON.parse(localStorage.getItem("verdant_nature_logs") || "[]");
    logs.unshift(entry);
    localStorage.setItem("verdant_nature_logs", JSON.stringify(logs.slice(0, 10)));
    renderJournal();
  }

  function renderJournal() {
    const logs = JSON.parse(localStorage.getItem("verdant_nature_logs") || "[]");
    if (!journalLogContainer) return;
    journalLogContainer.innerHTML = "";

    if (logs.length === 0) {
      journalLogContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 14px;">No off-screen sessions logged yet. Put phone in pocket to touch grass!</div>`;
      return;
    }

    logs.forEach(log => {
      const card = document.createElement("div");
      card.className = "journal-entry-card";
      card.innerHTML = `
        <div>
          <div style="font-weight: 700; font-size: 14.5px; color: #fff;">${log.trailName}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${log.date} • Foliage Color Index: ${log.foliageIndex}%</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--accent-emerald);">+${log.minutesOffScreen} min</div>
          <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Off-Screen</div>
        </div>
      `;
      journalLogContainer.appendChild(card);
    });
  }

  btnLogGrass.addEventListener("click", () => {
    saveJournalEntry({
      trailName: currentTrail.name,
      minutesOffScreen: 45,
      date: new Date().toLocaleDateString(),
      foliageIndex: currentTabpfnResult ? currentTabpfnResult.foliageScore : 92
    });
    audioCompanion.playMindfulnessChime();
    alert("🌿 Logged 45 minutes of real-world nature immersion to your offline device!");
  });

  // Settings Modal Handlers
  btnOpenSettings.addEventListener("click", () => {
    inputElevenLabsKey.value = localStorage.getItem("verdant_elevenlabs_key") || "";
    inputOllamaUrl.value = localStorage.getItem("verdant_ollama_url") || "http://localhost:11434/api/generate";
    settingsModal.classList.add("active");
  });

  btnCloseSettings.addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });

  btnSaveSettings.addEventListener("click", () => {
    const key = inputElevenLabsKey.value.trim();
    const url = inputOllamaUrl.value.trim();
    localStorage.setItem("verdant_elevenlabs_key", key);
    localStorage.setItem("verdant_ollama_url", url);
    audioCompanion.elevenLabsApiKey = key;
    gemmaEngine.localOllamaUrl = url;
    settingsModal.classList.remove("active");
    alert("Settings saved locally.");
  });

  // Initialize
  initTrailSelector();
  executeInferencePipeline();
  renderJournal();
});
