const btnelement = document.querySelector(".btn");

const input_element = document.getElementById("input");

const copy_icon_element = document.querySelector(".fa-copy");

const alert_container_element = document.querySelector(".alert-container");

btnelement.addEventListener("click", ()=>{
    createpassword();
});

copy_icon_element.addEventListener("click", ()=>{
    copypassword();
    if(input_element.value){
        alert_container_element.classList.remove("active");
    setTimeout(() => {
        alert_container_element.classList.add("active");
    }, 2000);
    };
});

function createpassword(){
    const chars = "abcdefjhigklmnopqrstuvwxyzABCDEFGHIZKLMNOPQRSTUVWXYZ1234567890./*-+!@#$%^&()-_=~`{}[]:;',.<>?";
    const password_length = 14;
    let password = "";
    for(let index=0; index<password_length; index++){
        const random_number = Math.floor(Math.random() * chars.length);
        password += chars.substring(random_number, random_number + 1);
    };
    input_element.value = password;
    alert_container_element.innerHTML = `${password}  Copied!`;
}

function copypassword(){
    input_element.select();
    input_element.setSelectionRange(0, 9999);
    navigator.clipboard.writeText(input_element.value);
}