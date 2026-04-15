let currentsong = new Audio();
let songs;
let current_folder;

function secondstominutes_seconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    };

    const minutes = Math.floor(seconds / 60);
    const remaining_seconds = Math.floor(seconds % 60);

    const formated_minutes = String(minutes).padStart(2, "0");
    const formated_seconds = String(remaining_seconds).padStart(2, "0");

    return `${formated_minutes}:${formated_seconds}`;
};

async function getsongs(folder) {
    current_folder = folder;

    // ✅ Read song list from info.json instead of directory listing
    let response = await fetch(`${folder}/info.json`);
    let info = await response.json();

    songs = info.songs; // array of filenames like ["song1.mp3", "song2.mp3"]

    // Get all the songs in the playlist
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";

    for (const song of songs) {
        songul.innerHTML += `<li>
            <img src="Assets/music.svg" alt="music-svg">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                <div>Artist Name</div>
            </div>
            <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="Assets/play-button.svg" alt="play-button-svg">
            </div>
        </li>`;
    };

    // Attach an event listener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            playmusic(element.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3");
        });
    });

    return songs;
};

const playmusic = (track, pause = false) => {
    currentsong.src = `${current_folder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "Assets/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", "");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function display_albums() {
    // ✅ Read folder list from songs.json instead of directory listing
    let res = await fetch("songs.json");
    let data = await res.json();

    let cardContainer = document.querySelector(".cardcontainer");

    for (const folder of data.folders) {
        try {
            let infoRes = await fetch(`Songs/${folder}/info.json`);
            if (!infoRes.ok) continue;

            let info = await infoRes.json();

            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <div class="play-btn">
                    <button class="btn">
                        <img src="Assets/play-button.svg" alt="play-button">
                    </button>
                </div>
                <img src="Songs/${folder}/cover.jpeg" alt="${info.title}">
                <h2>${info.title}</h2>
                <p>${info.description}</p>
            </div>`;

        } catch (err) {
            console.log("Error loading folder:", folder, err);
        }
    };

    // Attach click listeners to all cards
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
};

async function main() {

    display_albums();

    // Load default playlist on startup
    songs = await getsongs("Songs/Jennie_songs");
    playmusic(songs[0], true);

    // Play / Pause button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "Assets/pause.svg";
        } else {
            currentsong.pause();
            play.src = "Assets/play-button.svg";
        }
    });

    // Time update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondstominutes_seconds(currentsong.currentTime)} / ${secondstominutes_seconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    // Seekbar click
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });

    // Hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Close sidebar
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous button
    previous.addEventListener("click", () => {
        currentsong.pause();
        // Decode the current src to match against songs array
        let currentFile = decodeURIComponent(currentsong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentFile);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        };
    });

    // Next button
    next.addEventListener("click", () => {
        currentsong.pause();
        let currentFile = decodeURIComponent(currentsong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentFile);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        };
    });

    // Volume slider
    let volumeRange = document.querySelector(".volume input");
    let volbtn = document.querySelector("#volbtn");

    volumeRange.addEventListener("input", (e) => {
        currentsong.volume = e.target.value / 100;
    });

    // Volume mute toggle
    volbtn.addEventListener("click", () => {
        if (currentsong.volume > 0) {
            currentsong.volume = 0;
            volbtn.src = "Assets/volume-off.svg";
        } else {
            currentsong.volume = volumeRange.value / 100;
            volbtn.src = "Assets/volume.svg";
        }
    });
};

main();