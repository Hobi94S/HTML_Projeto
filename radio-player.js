(function () {
    const playlist = [
        "Radio/17. Naruto Uzumaki Saga.mp3",
        "Radio/18. Sasuke Uchiha Saga.mp3",
        "Radio/19. Sakura Haruno Saga.mp3",
        "Radio/20. Kakashi Hatake Saga.mp3",
        "Radio/21. Hinata Hy\u016Bga Saga.mp3",
        "Radio/22. Neji Hy\u016Bga Saga.mp3",
        "Radio/23. Rock Lee Saga.mp3",
        "Radio/24. Shikamaru Nara Saga.mp3",
        "Radio/25. Gaara Saga.mp3",
        "Radio/26. Haku Saga.mp3"
    ];

    function getTrackLabel(path) {
        return path.split("/").pop().replace(/\.mp3$/i, "");
    }

    function buildRadio() {
        if (document.querySelector(".retro-radio")) {
            return;
        }

        const radio = document.createElement("section");
        radio.className = "retro-radio";
        radio.innerHTML = `
            <div class="retro-radio__window">
                <div class="retro-radio__titlebar">
                    <div class="retro-radio__title">
                        <span class="retro-radio__brand-dot" aria-hidden="true"></span>
                        <span>Naruto Radio.blog</span>
                    </div>
                    <div class="retro-radio__window-buttons">
                        <button type="button" class="retro-radio__toggle" aria-label="Minimizar">_</button>
                        <button type="button" class="retro-radio__stop" aria-label="Parar">X</button>
                    </div>
                </div>
                <div class="retro-radio__body">
                    <div class="retro-radio__screen">
                        <div class="retro-radio__visualizer" aria-hidden="true"></div>
                        <div class="retro-radio__meta">
                            <div class="retro-radio__now">Now playing</div>
                            <div class="retro-radio__song">Carregando...</div>
                        </div>
                    </div>
                    <div class="retro-radio__controls">
                        <button type="button" class="retro-radio__control retro-radio__prev">&lt;&lt;</button>
                        <button type="button" class="retro-radio__control retro-radio__play">PLAY</button>
                        <button type="button" class="retro-radio__control retro-radio__pause">PAUSE</button>
                        <button type="button" class="retro-radio__control retro-radio__next">&gt;&gt;</button>
                        <button type="button" class="retro-radio__control retro-radio__shuffle">MIX</button>
                    </div>
                    <div class="retro-radio__playlist-label">Saga playlist</div>
                    <div class="retro-radio__playlist"></div>
                    <div class="retro-radio__footer">
                        <label class="retro-radio__volume">
                            <span>Volume</span>
                            <input type="range" min="0" max="1" step="0.05" value="0.75">
                        </label>
                        <div class="retro-radio__status">ready</div>
                    </div>
                </div>
            </div>
        `;

        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.volume = 0.75;
        radio.appendChild(audio);
        document.body.appendChild(radio);

        const songLabel = radio.querySelector(".retro-radio__song");
        const playButton = radio.querySelector(".retro-radio__play");
        const pauseButton = radio.querySelector(".retro-radio__pause");
        const nextButton = radio.querySelector(".retro-radio__next");
        const prevButton = radio.querySelector(".retro-radio__prev");
        const shuffleButton = radio.querySelector(".retro-radio__shuffle");
        const stopButton = radio.querySelector(".retro-radio__stop");
        const toggleButton = radio.querySelector(".retro-radio__toggle");
        const playlistHost = radio.querySelector(".retro-radio__playlist");
        const volumeSlider = radio.querySelector(".retro-radio__volume input");
        const status = radio.querySelector(".retro-radio__status");

        let currentIndex = 0;

        function updateTrackButtons() {
            playlistHost.querySelectorAll(".retro-radio__track").forEach((button, index) => {
                button.classList.toggle("is-active", index === currentIndex);
            });
        }

        function setStatus(text) {
            status.textContent = text;
        }

        function loadTrack(index, shouldPlay) {
            currentIndex = (index + playlist.length) % playlist.length;
            const currentTrack = playlist[currentIndex];
            audio.src = currentTrack;
            songLabel.textContent = getTrackLabel(currentTrack);
            updateTrackButtons();
            setStatus(shouldPlay ? "loading" : "paused");

            if (shouldPlay) {
                audio.play().catch(() => {
                    setStatus("click play");
                });
            }
        }

        function nextTrack(shouldPlay = true) {
            loadTrack(currentIndex + 1, shouldPlay);
        }

        function previousTrack() {
            loadTrack(currentIndex - 1, true);
        }

        playlist.forEach((track, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "retro-radio__track";
            button.textContent = getTrackLabel(track);
            button.addEventListener("click", function () {
                loadTrack(index, true);
            });
            playlistHost.appendChild(button);
        });

        playButton.addEventListener("click", function () {
            if (!audio.src) {
                loadTrack(currentIndex, true);
                return;
            }

            audio.play().catch(() => {
                setStatus("click play");
            });
        });

        pauseButton.addEventListener("click", function () {
            audio.pause();
            setStatus("paused");
        });

        nextButton.addEventListener("click", function () {
            nextTrack(true);
        });

        prevButton.addEventListener("click", function () {
            previousTrack();
        });

        shuffleButton.addEventListener("click", function () {
            let nextIndex = currentIndex;
            while (playlist.length > 1 && nextIndex === currentIndex) {
                nextIndex = Math.floor(Math.random() * playlist.length);
            }
            loadTrack(nextIndex, true);
        });

        stopButton.addEventListener("click", function () {
            audio.pause();
            audio.currentTime = 0;
            setStatus("stopped");
        });

        toggleButton.addEventListener("click", function () {
            radio.classList.toggle("retro-radio--collapsed");
        });

        volumeSlider.addEventListener("input", function () {
            audio.volume = Number(volumeSlider.value);
        });

        audio.addEventListener("play", function () {
            setStatus("playing");
        });

        audio.addEventListener("pause", function () {
            if (audio.currentTime > 0 && !audio.ended) {
                setStatus("paused");
            }
        });

        audio.addEventListener("ended", function () {
            nextTrack(true);
        });

        audio.addEventListener("error", function () {
            setStatus("error");
        });

        loadTrack(0, false);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildRadio);
    } else {
        buildRadio();
    }
})();
