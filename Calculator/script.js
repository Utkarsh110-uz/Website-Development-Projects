const button_element = document.querySelectorAll("button");

const input_element = document.getElementById("result");

for(let i = 0; i < button_element.length; i++){
    button_element[i].addEventListener("click", ()=>{
        const button_value = button_element[i].innerHTML;
        if(button_value === "C"){
            clear_function();
        }
        else if(button_value === "="){
            calculate_result();
        }
        else{
            append_value(button_value);
        };
    });
};

function clear_function(){
    console.log("Clear");
};

function calculate_result(){
    console.log("Equal");
};

function append_value(buttonvalue){
    console.log(buttonvalue);
    input_element.value += buttonvalue;
};