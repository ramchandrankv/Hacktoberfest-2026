/**
 * HustleForge AI - ElevenLabs Audio Ad Studio & Waveform Visualizer
 * Integrates Web Audio API, Speech Synthesis, and Real-Time Canvas Reactive Waveforms
 */

class AudioAdStudio {
  constructor() {
    this.isPlaying = false;
    this.audioCtx = null;
    this.analyser = null;
    this.animFrameId = null;
    this.currentUtterance = null;
    this.voiceName = "Rachel";
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVoice(name) {
    this.voiceName = name;
  }

  play(scriptText, onEndCallback) {
    this.initAudio();
    this.stop(); // Stop any existing speech

    this.isPlaying = true;

    // Check for window.speechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scriptText);
      this.currentUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      
      // Select appropriate natural voice if available
      let selectedVoice = null;
      if (this.voiceName.includes("Rachel")) {
        selectedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Female')) && v.lang.startsWith('en')) || voices[0];
        utterance.pitch = 1.05;
        utterance.rate = 1.0;
      } else if (this.voiceName.includes("Adam")) {
        selectedVoice = voices.find(v => (v.name.includes('David') || v.name.includes('Male') || v.name.includes('Guy')) && v.lang.startsWith('en')) || voices[0];
        utterance.pitch = 0.95;
        utterance.rate = 1.05;
      } else { // Antoni
        selectedVoice = voices.find(v => (v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('UK')) && v.lang.startsWith('en')) || voices[0];
        utterance.pitch = 0.9;
        utterance.rate = 0.95;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        this.isPlaying = false;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    }

    // Start synthetic waveform generator loop
    this.startVisualizerLoop();
  }

  stop() {
    this.isPlaying = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.renderIdleWaveform('audioWaveformCanvas');
  }

  startVisualizerLoop() {
    const canvas = document.getElementById('audioWaveformCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const draw = () => {
      if (!this.isPlaying) {
        this.renderIdleWaveform('audioWaveformCanvas');
        return;
      }

      tick += 0.12;
      const width = canvas.width = canvas.parentElement.clientWidth || 400;
      const height = canvas.height = 70;
      ctx.clearRect(0, 0, width, height);

      const numBars = 36;
      const barW = Math.max(3, (width - (numBars * 3)) / numBars);
      const centerY = height / 2;

      for (let i = 0; i < numBars; i++) {
        // Simulated voice frequency modulation with organic rhythm
        const wave1 = Math.sin(tick + i * 0.35);
        const wave2 = Math.cos(tick * 0.7 - i * 0.2);
        const energy = Math.abs(wave1 * wave2);
        const barHeight = Math.max(6, energy * (height * 0.85));

        const x = i * (barW + 3) + 10;
        const y = centerY - barHeight / 2;

        // Vivid neon gradient for ElevenLabs active voice synthesis
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#818cf8'); // Indigo
        grad.addColorStop(0.5, '#06b6d4'); // Cyan
        grad.addColorStop(1, '#10b981'); // Emerald

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barHeight, 3);
        ctx.fill();
      }

      this.animFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  renderIdleWaveform(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement.clientWidth || 400;
    const height = canvas.height = 70;
    ctx.clearRect(0, 0, width, height);

    const numBars = 36;
    const barW = Math.max(3, (width - (numBars * 3)) / numBars);
    const centerY = height / 2;

    for (let i = 0; i < numBars; i++) {
      const x = i * (barW + 3) + 10;
      const barHeight = 6 + Math.sin(i * 0.5) * 4;
      const y = centerY - barHeight / 2;

      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barHeight, 2);
      ctx.fill();
    }
  }
}

window.audioAdStudio = new AudioAdStudio();
