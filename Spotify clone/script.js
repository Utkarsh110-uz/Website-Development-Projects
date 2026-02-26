let currentsong = new Audio();
let songs;
let current_folder;

function secondstominutes_seconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    };

    const minutes = Math.floor(seconds / 60);
    const remaining_seconds = Math.floor(seconds % 60)

    const formated_miutes = String(minutes).padStart(2, "0");
    const formated_seconds = String(remaining_seconds).padStart(2, "0");

    return `${formated_miutes}:${formated_seconds}`;
};

async function getsongs(folder) {
    current_folder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let element = document.createElement("div");
    element.innerHTML = response;
    let as = element.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        };
    };

    // Get all the songs in the playlist
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img src="Assets/music.svg" alt="music-svg">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="Assets/play-button.svg" alt="play-button-svg">
                            </div></li>`;
    };

    // Attach an event listner to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            playmusic(element.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    return songs;
};

const playmusic = (track, pause = false) => {
    currentsong.src = `/${current_folder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "Assets/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function display_albums() {

    let a = await fetch("/songs/");
    let response = await a.text();

    let element = document.createElement("div");
    element.innerHTML = response;

    let anchors = element.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardcontainer");

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        let e = array[index];

        let url = new URL(e.href);
        let parts = url.pathname.split("/").filter(Boolean);

        if (
            parts.length === 2 &&
            parts[0] === "songs" &&
            !parts[1].startsWith(".")   // 🔥 ignore hidden files
        ) {

            let folder = parts[1];

            try {
                let a = await fetch(`/Songs/${folder}/info.json`);

                if (!a.ok) continue;

                let response = await a.json();
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                            <div class="play-btn">
                                <button class="btn">
                                    <img src="Assets/play-button.svg" alt="play-button">
                                </button>
                            </div>
                            <img src="/songs/${folder}/cover.jpeg" alt="happy-mood-picture">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`

            } catch (err) {
                console.log("Error:", err);
            }
        }
    };
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
};

async function main() {

    display_albums();

    // Get all the songs
    songs = await getsongs("Songs/Calm_music");
    playmusic(songs[0], true);

    // Attach an event listner to previous, next and play buttons
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "Assets/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "Assets/play-button.svg"
        }
    });

    // Listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondstominutes_seconds(currentsong.currentTime)}/${secondstominutes_seconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    });

    // Add event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Add an event listener to previous button
    previous.addEventListener("click", () => {
        currentsong.pause();
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        };
    });

    // Add an event listener to next button
    next.addEventListener("click", () => {
        currentsong.pause();
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        };
    });

    // Select elements
    let volumeRange = document.querySelector(".volume input");
    let volbtn = document.querySelector("#volbtn"); // adjust if needed

    // Volume slider change
    volumeRange.addEventListener("input", (e) => {
        currentsong.volume = e.target.value / 100;
    });

    // Volume button toggle
    volbtn.addEventListener("click", () => {

        if (currentsong.volume > 0) {
            // Mute
            currentsong.volume = 0;
            volbtn.src = "Assets/volume-off.svg";
        }
        else {
            // Restore from slider value
            currentsong.volume = volumeRange.value / 100;
            volbtn.src = "Assets/volume.svg";
        }

    });
};

main();