/**
 * VerdantPulse - Audio Companion & Procedural Nature Soundscape
 * Supports ElevenLabs Voice Narration (API key optional) + Web Speech API (100% Offline)
 * + Procedural Web Audio API Nature Soundscapes (Wind, Rustling Leaves, Zen Chimes).
 */

class AudioCompanion {
  constructor() {
    this.audioCtx = null;
    this.isPlayingAmbient = false;
    this.ambientNodes = [];
    this.isSpeaking = false;
    this.elevenLabsApiKey = localStorage.getItem("verdant_elevenlabs_key") || "";
    this.elevenLabsVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel - Warm, natural voice
    this.speechSynth = window.speechSynthesis || null;
    this.currentUtterance = null;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  /**
   * Procedurally generate soothing mountain breeze & rustling leaves via Web Audio API
   * Zero audio files required, runs 100% offline on any device!
   */
  startAmbientForestSoundscape() {
    this.initAudioContext();
    if (!this.audioCtx || this.isPlayingAmbient) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink/Brownian noise for deep organic wind
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5; // Gain factor
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter simulating mountain breeze through canopy
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

      // Filter modulation for gentle gusts
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.18, this.audioCtx.currentTime); // 1 gust every ~5 seconds
      lfoGain.gain.setValueAtTime(140, this.audioCtx.currentTime);
      lfo.connect(filter.frequency);

      // Master ambient volume
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.audioCtx.destination);

      whiteNoise.start();
      lfo.start();

      this.ambientNodes = [whiteNoise, lfo, masterGain, filter];
      this.isPlayingAmbient = true;
      console.log("Ambient forest soundscape started (Procedural Web Audio)");
    } catch (e) {
      console.warn("Could not start ambient soundscape", e);
    }
  }

  stopAmbientForestSoundscape() {
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.isPlayingAmbient = false;
  }

  toggleAmbientSoundscape() {
    if (this.isPlayingAmbient) {
      this.stopAmbientForestSoundscape();
      return false;
    } else {
      this.startAmbientForestSoundscape();
      return true;
    }
  }

  /**
   * Synthesize gentle Zen Singing Bowl chime for trail mindfulness cues
   */
  playMindfulnessChime() {
    this.initAudioContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(528, this.audioCtx.currentTime); // 528 Hz Solfeggio frequency

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 3.6);

      // Trigger mobile vibration if available
      if (navigator.vibrate) {
        navigator.vibrate([150, 80, 150]);
      }
    } catch (e) {
      console.warn("Chime failed", e);
    }
  }

  /**
   * Speak field card text using ElevenLabs API or Offline Web Speech API
   */
  async speakFieldCard(plainText, onStart, onEnd) {
    if (this.isSpeaking) {
      this.stopSpeech();
      if (onEnd) onEnd();
      return;
    }

    // Prepare speech text: clean markdown stars and emojis for clear natural narration
    const cleanSpeech = plainText
      .replace(/[\*#_⚠️📴🌲🌿🍂💨]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    // Check if ElevenLabs key is available
    if (this.elevenLabsApiKey && this.elevenLabsApiKey.trim().length > 10) {
      try {
        if (onStart) onStart("ElevenLabs Natural Voice");
        this.isSpeaking = true;

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${this.elevenLabsVoiceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": this.elevenLabsApiKey
            },
            body: JSON.stringify({
              text: cleanSpeech,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            })
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          this.currentAudioElement = audio;
          audio.onended = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
          };
          audio.play();
          return;
        } else {
          console.warn("ElevenLabs request failed, falling back to Web Speech API");
        }
      } catch (err) {
        console.warn("ElevenLabs error, using offline speech fallback", err);
      }
    }

    // High quality offline Web Speech API fallback (Works 100% in airplane mode!)
    if (this.speechSynth) {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.rate = 0.95; // Slightly slower, calm cadence
      utterance.pitch = 1.0;

      // Select natural English voice if present
      const voices = this.speechSynth.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart("Offline Web Speech Voice");
      };
      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  stopSpeech() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    this.isSpeaking = false;
  }
}

// Global instance
const audioCompanion = new AudioCompanion();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AudioCompanion, audioCompanion };
}
