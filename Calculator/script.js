const button_element = document.querySelectorAll("button");

const input_element = document.getElementById("result");

for(let index = 0; index<button_element.length; index++){
    button_element[index].addEventListener("click", ()=>{
        const button_value = button_element[index].innerHTML;
        if(button_value === "C"){
            clear_result();
        }
        else if(button_value === "="){
            calculate();
        }
        else{
            append_value(button_value);
        }
    });
};

function clear_result(){
    input_element.value = "";
};

function calculate(){
    input_element.value = eval(input_element.value);
};

function append_value(button_value){
    input_element.value += button_value;
};