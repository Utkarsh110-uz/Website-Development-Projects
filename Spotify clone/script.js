let currentsong = new Audio();

function secondstominutes_seconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Time"
    };

    const minutes = Math.floor(seconds / 60);
    const remaining_seconds = Math.floor(seconds % 60)

    const formated_miutes = String(minutes).padStart(2, "0");
    const formated_seconds = String(remaining_seconds).padStart(2, "0");

    return `${formated_miutes}:${formated_seconds}`;
};

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/Songs/");
    let response = await a.text();
    let element = document.createElement("div");
    element.innerHTML = response;
    let as = element.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1]);
        };
    };
    return songs;
};

const playmusic = (track, pause=false) => {
    currentsong.src = "/Songs/" + track;
    if(!pause){
        currentsong.play();
        play.src = "Assests/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {

    // Get all the songs
    let songs = await getsongs();
    playmusic(songs[0], true);

    // Get all the songs in the playlist
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img src="Assests/music.svg" alt="music-svg">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="Assests/play-button.svg" alt="play-button-svg">
                            </div></li>`;
    };

    // Attach an event listner to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML);
            playmusic(element.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    // Attach an event listner to previous, next and play buttons
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "Assests/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "Assests/play-button.svg"
        }
    });

    // Listen for timupdate event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondstominutes_seconds(currentsong.currentTime)}/${secondstominutes_seconds(currentsong.duration)}`
    });

};

main();