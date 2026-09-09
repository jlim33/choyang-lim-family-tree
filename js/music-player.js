/**
 * ==============================================================================
 * 조양 임씨 가문 족보 - 클래식 뮤직 라운지 (Music Lounge Engine)
 * Classic Best 5선 (C:\Users\justi\Music\Classic Best)
 * ==============================================================================
 */

const CLASSIC_TRACKS = [
  {
    id: 1,
    num: "01",
    titleKo: "캐논 변주곡 (Canon in D)",
    titleEn: "Pachelbel - Canon in D Major",
    composerKo: "요한 파헬벨 (J. Pachelbel)",
    composerEn: "Johann Pachelbel",
    periodKo: "바로크 현악 명곡 🎻",
    periodEn: "Baroque Masterpiece 🎻",
    src: "audio/classic-best/01-pachelbel-canon.mp3",
    tag: "canon"
  },
  {
    id: 2,
    num: "02",
    titleKo: "엘리제를 위하여 (Für Elise)",
    titleEn: "Beethoven - Für Elise (WoO 59)",
    composerKo: "루트비히 판 베토벤 (L. v. Beethoven)",
    composerEn: "Ludwig van Beethoven",
    periodKo: "고전 피아노 명곡 🎹",
    periodEn: "Classical Grand Piano 🎹",
    src: "audio/classic-best/02-beethoven-fur-elise.mp3",
    tag: "beethoven"
  },
  {
    id: 3,
    num: "03",
    titleKo: "사계 '겨울' 1악장 (Winter 1st Mvt)",
    titleEn: "Vivaldi - Four Seasons: Winter (1st Mvt)",
    composerKo: "안토니오 비발디 (A. Vivaldi)",
    composerEn: "Antonio Vivaldi",
    periodKo: "바이올린 협주곡 🎻",
    periodEn: "Violin Concerto 🎻",
    src: "audio/classic-best/03-vivaldi-winter-1st.mp3",
    tag: "vivaldi"
  },
  {
    id: 4,
    num: "04",
    titleKo: "사랑의 기쁨 (Liebesfreud)",
    titleEn: "Kreisler - Liebesfreud (Love's Joy)",
    composerKo: "프리츠 크라이슬러 (F. Kreisler)",
    composerEn: "Fritz Kreisler",
    periodKo: "빈 살롱 바이올린 🌸",
    periodEn: "Viennese Salon Violin 🌸",
    src: "audio/classic-best/04-kreisler-liebesfreud.mp3",
    tag: "kreisler"
  },
  {
    id: 5,
    num: "05",
    titleKo: "타이스의 명상곡 (Méditation)",
    titleEn: "Massenet - Méditation from Thaïs",
    composerKo: "쥘 마스네 (J. Massenet)",
    composerEn: "Jules Massenet",
    periodKo: "오페라 간주곡 🌌",
    periodEn: "Opera Intermezzo 🌌",
    src: "audio/classic-best/05-massenet-meditation-thais.mp3",
    tag: "massenet"
  }
];

class MusicLoungeController {
  constructor() {
    this.tracks = CLASSIC_TRACKS;
    this.currentIndex = 0;
    this.audio = new Audio();
    this.audio.preload = "metadata";
    this.isPlaying = false;
    this.isLoading = false;
    this.volume = parseFloat(localStorage.getItem("choyang_music_vol") ?? "0.75");
    this.isMuted = false;
    this.isShuffle = localStorage.getItem("choyang_music_shuffle") === "true";
    this.autoAdvance = true;
    this.isModalOpen = false;

    this.audio.volume = this.volume;
    this.shuffledIndices = [];
    this.shufflePointer = 0;

    this.initAudioEvents();
    this.generateShuffleQueue();
  }

  init() {
    this.bindDOM();
    this.loadTrack(0, false);
    this.renderPlaylist();
    this.updateUI();
  }

  generateShuffleQueue() {
    this.shuffledIndices = this.tracks.map((_, i) => i);
    for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledIndices[i], this.shuffledIndices[j]] = [this.shuffledIndices[j], this.shuffledIndices[i]];
    }
    this.shufflePointer = 0;
  }

  bindDOM() {
    // Mini Player Elements
    this.miniPlayBtn = document.getElementById("music-mini-play-btn");
    this.miniPrevBtn = document.getElementById("music-mini-prev-btn");
    this.miniNextBtn = document.getElementById("music-mini-next-btn");
    this.miniTitle = document.getElementById("music-mini-title");
    this.miniArtist = document.getElementById("music-mini-artist");
    this.miniWave = document.getElementById("music-mini-wave");
    this.miniStatusBadge = document.getElementById("music-mini-status");
    this.miniExpandBtn = document.getElementById("music-mini-expand-btn");
    this.miniCapsule = document.getElementById("music-mini-capsule");

    // Modal Elements
    this.modal = document.getElementById("music-lounge-modal");
    this.modalCloseBtn = document.getElementById("music-modal-close");
    this.modalPlayBtn = document.getElementById("music-modal-play-btn");
    this.modalPrevBtn = document.getElementById("music-modal-prev-btn");
    this.modalNextBtn = document.getElementById("music-modal-next-btn");
    this.modalShuffleBtn = document.getElementById("music-modal-shuffle-btn");
    this.modalAutoBtn = document.getElementById("music-modal-auto-btn");
    this.modalMuteBtn = document.getElementById("music-modal-mute-btn");
    this.volumeSlider = document.getElementById("music-volume-slider");
    this.progressBar = document.getElementById("music-progress-bar");
    this.progressContainer = document.getElementById("music-progress-container");
    this.timeCurrent = document.getElementById("music-time-current");
    this.timeTotal = document.getElementById("music-time-total");
    this.playlistContainer = document.getElementById("music-playlist-list");
    this.modalTrackTitle = document.getElementById("music-modal-track-title");
    this.modalTrackArtist = document.getElementById("music-modal-track-artist");
    this.modalTrackBadge = document.getElementById("music-modal-track-badge");
    this.modalAlbumArt = document.getElementById("music-modal-album-art");

    // Event Listeners - Mini Player
    if (this.miniPlayBtn) {
      this.miniPlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }
    if (this.miniPrevBtn) {
      this.miniPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.playPrev();
      });
    }
    if (this.miniNextBtn) {
      this.miniNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.playNext();
      });
    }
    if (this.miniCapsule) {
      this.miniCapsule.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          this.toggleModal();
        }
      });
    }
    if (this.miniExpandBtn) {
      this.miniExpandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleModal();
      });
    }

    // Event Listeners - Modal
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.toggleModal(false));
    }
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.toggleModal(false);
      });
    }
    if (this.modalPlayBtn) {
      this.modalPlayBtn.addEventListener("click", () => this.togglePlay());
    }
    if (this.modalPrevBtn) {
      this.modalPrevBtn.addEventListener("click", () => this.playPrev());
    }
    if (this.modalNextBtn) {
      this.modalNextBtn.addEventListener("click", () => this.playNext());
    }
    if (this.modalShuffleBtn) {
      this.modalShuffleBtn.addEventListener("click", () => this.toggleShuffle());
    }
    if (this.modalAutoBtn) {
      this.modalAutoBtn.addEventListener("click", () => this.toggleAutoAdvance());
    }
    if (this.modalMuteBtn) {
      this.modalMuteBtn.addEventListener("click", () => this.toggleMute());
    }
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
      this.volumeSlider.addEventListener("input", (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }
    if (this.progressContainer) {
      this.progressContainer.addEventListener("click", (e) => {
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.seek(pos);
      });
    }

    // ESC key closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalOpen) {
        this.toggleModal(false);
      }
    });
  }

  initAudioEvents() {
    this.audio.addEventListener("waiting", () => {
      this.isLoading = true;
      this.updateUI();
    });

    this.audio.addEventListener("playing", () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.updateUI();
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.audio.addEventListener("timeupdate", () => {
      this.updateProgress();
    });

    this.audio.addEventListener("loadedmetadata", () => {
      if (this.timeTotal) {
        this.timeTotal.textContent = this.formatTime(this.audio.duration);
      }
    });

    this.audio.addEventListener("ended", () => {
      if (this.autoAdvance) {
        this.playNext();
      } else {
        this.isPlaying = false;
        this.updateUI();
      }
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Audio playback error:", e);
      this.isLoading = false;
      this.isPlaying = false;
      this.updateUI();
    });
  }

  loadTrack(index, playImmediate = true) {
    if (index < 0 || index >= this.tracks.length) return;
    this.currentIndex = index;
    const track = this.tracks[this.currentIndex];

    this.audio.src = track.src;
    this.audio.load();

    if (playImmediate) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch(err => {
        console.log("Audio autoplay restricted by browser; user interaction required.", err);
        this.isPlaying = false;
        this.updateUI();
      });
    } else {
      this.updateUI();
    }
  }

  togglePlay() {
    if (!this.audio.src || this.audio.src === "") {
      this.loadTrack(this.currentIndex, true);
      return;
    }

    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch(err => {
        console.warn("Audio play error:", err);
      });
    } else {
      this.audio.pause();
      this.isPlaying = false;
      this.updateUI();
    }
  }

  playNext() {
    if (this.isShuffle) {
      this.shufflePointer = (this.shufflePointer + 1) % this.shuffledIndices.length;
      this.loadTrack(this.shuffledIndices[this.shufflePointer], true);
    } else {
      const nextIndex = (this.currentIndex + 1) % this.tracks.length;
      this.loadTrack(nextIndex, true);
    }
  }

  playPrev() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.isShuffle) {
      this.shufflePointer = (this.shufflePointer - 1 + this.shuffledIndices.length) % this.shuffledIndices.length;
      this.loadTrack(this.shuffledIndices[this.shufflePointer], true);
    } else {
      const prevIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
      this.loadTrack(prevIndex, true);
    }
  }

  seek(ratio) {
    if (this.audio.duration) {
      this.audio.currentTime = this.audio.duration * Math.max(0, Math.min(1, ratio));
      this.updateProgress();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.volume;
    this.isMuted = this.volume === 0;
    localStorage.setItem("choyang_music_vol", this.volume.toString());
    this.updateUI();
  }

  toggleMute() {
    if (this.isMuted) {
      this.isMuted = false;
      this.audio.volume = this.volume > 0 ? this.volume : 0.75;
      if (this.volumeSlider) this.volumeSlider.value = this.audio.volume;
    } else {
      this.isMuted = true;
      this.audio.volume = 0;
      if (this.volumeSlider) this.volumeSlider.value = 0;
    }
    this.updateUI();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    localStorage.setItem("choyang_music_shuffle", this.isShuffle.toString());
    if (this.isShuffle) {
      this.generateShuffleQueue();
    }
    this.updateUI();
  }

  toggleAutoAdvance() {
    this.autoAdvance = !this.autoAdvance;
    this.updateUI();
  }

  toggleModal(force) {
    this.isModalOpen = force !== undefined ? force : !this.isModalOpen;
    if (this.modal) {
      if (this.isModalOpen) {
        this.modal.classList.remove("hidden");
        this.modal.classList.add("flex");
        document.body.style.overflow = "hidden";
      } else {
        this.modal.classList.add("hidden");
        this.modal.classList.remove("flex");
        document.body.style.overflow = "";
      }
    }
    this.updateUI();
  }

  updateProgress() {
    if (!this.audio.duration) return;
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
    if (this.timeCurrent) {
      this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  renderPlaylist() {
    if (!this.playlistContainer) return;
    const currentLang = window.currentLanguage || "ko";
    const isEn = currentLang === "en";

    this.playlistContainer.innerHTML = this.tracks.map((track, idx) => {
      const isSelected = idx === this.currentIndex;
      const title = isEn ? track.titleEn : track.titleKo;
      const composer = isEn ? track.composerEn : track.composerKo;
      const period = isEn ? track.periodEn : track.periodKo;

      return `
        <div 
          class="music-track-item ${isSelected ? 'active' : ''}" 
          data-track-idx="${idx}"
          onclick="window.musicLounge.loadTrack(${idx}, true)"
        >
          <div class="music-track-left">
            <span class="music-track-num">${track.num}</span>
            <div class="music-track-info">
              <div class="music-track-title">${title}</div>
              <div class="music-track-composer">${composer}</div>
            </div>
          </div>
          <div class="music-track-right">
            <span class="music-track-period-badge">${period}</span>
            <div class="music-track-play-indicator">
              ${isSelected && this.isPlaying ? `
                <span class="music-eq-bar bar-1"></span>
                <span class="music-eq-bar bar-2"></span>
                <span class="music-eq-bar bar-3"></span>
              ` : `
                <i class="fas ${isSelected ? 'fa-volume-high' : 'fa-play'}"></i>
              `}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  updateUI() {
    const currentLang = window.currentLanguage || "ko";
    const isEn = currentLang === "en";
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    const title = isEn ? track.titleEn : track.titleKo;
    const composer = isEn ? track.composerEn : track.composerKo;
    const period = isEn ? track.periodEn : track.periodKo;

    // Mini Capsule Title & Artist
    if (this.miniTitle) this.miniTitle.textContent = title;
    if (this.miniArtist) this.miniArtist.textContent = composer;

    // Mini Play Button Icon
    if (this.miniPlayBtn) {
      if (this.isLoading) {
        this.miniPlayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      } else if (this.isPlaying) {
        this.miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.miniPlayBtn.title = isEn ? "Pause Classical BGM" : "클래식 BGM 일시정지";
      } else {
        this.miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.miniPlayBtn.title = isEn ? "Play Classical BGM" : "클래식 BGM 재생";
      }
    }

    // Mini Wave Animation
    if (this.miniWave) {
      if (this.isPlaying) {
        this.miniWave.classList.add("playing");
      } else {
        this.miniWave.classList.remove("playing");
      }
    }

    // Mini Status Badge
    if (this.miniStatusBadge) {
      if (this.isPlaying) {
        this.miniStatusBadge.innerHTML = `
          <span class="music-pulse-dot"></span>
          <span>${isEn ? "Continuous BGM" : "연속 자동 재생 중"}</span>
        `;
        this.miniStatusBadge.classList.add("playing");
      } else {
        this.miniStatusBadge.innerHTML = `
          <span class="music-idle-dot"></span>
          <span>${isEn ? "Classic Best 5" : "클래식 명곡 5선"}</span>
        `;
        this.miniStatusBadge.classList.remove("playing");
      }
    }

    // Modal Controls & Info
    if (this.modalTrackTitle) this.modalTrackTitle.textContent = title;
    if (this.modalTrackArtist) this.modalTrackArtist.textContent = composer;
    if (this.modalTrackBadge) this.modalTrackBadge.textContent = period;

    if (this.modalAlbumArt) {
      if (this.isPlaying) {
        this.modalAlbumArt.classList.add("rotating");
      } else {
        this.modalAlbumArt.classList.remove("rotating");
      }
    }

    if (this.modalPlayBtn) {
      this.modalPlayBtn.innerHTML = this.isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
    }

    if (this.modalShuffleBtn) {
      if (this.isShuffle) {
        this.modalShuffleBtn.classList.add("active");
        this.modalShuffleBtn.title = isEn ? "Shuffle: ON" : "랜덤 셔플: 켜짐";
      } else {
        this.modalShuffleBtn.classList.remove("active");
        this.modalShuffleBtn.title = isEn ? "Shuffle: OFF" : "랜덤 셔플: 꺼짐";
      }
    }

    if (this.modalAutoBtn) {
      if (this.autoAdvance) {
        this.modalAutoBtn.classList.add("active");
        this.modalAutoBtn.title = isEn ? "Autoplay Next: ON" : "다음 곡 자동 재생: 켜짐";
      } else {
        this.modalAutoBtn.classList.remove("active");
        this.modalAutoBtn.title = isEn ? "Autoplay Next: OFF" : "다음 곡 자동 재생: 꺼짐";
      }
    }

    if (this.modalMuteBtn) {
      this.modalMuteBtn.innerHTML = (this.isMuted || this.volume === 0)
        ? '<i class="fas fa-volume-xmark"></i>'
        : '<i class="fas fa-volume-high"></i>';
    }

    // Refresh playlist active state
    this.renderPlaylist();
  }
}

// Global Singleton Initialization
document.addEventListener("DOMContentLoaded", () => {
  window.musicLounge = new MusicLoungeController();
  window.musicLounge.init();
});
