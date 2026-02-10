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

async function main() {
    let songs =  await getsongs();
    console.log(songs);

    var audio = new Audio(songs[0]);

    const button = document.querySelector(".playbutton");
    button.addEventListener("click", () => {
        audio.play();
    });

    audio.addEventListener("loadeddata", ()=>{
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });

    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs){
        songul.innerHTML = songul.innerHTML + `<li> ${song} </li>`;
    }
};
main()