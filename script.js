const compileBtn = document.getElementById("compileBtn");
const codeEditor = document.getElementById("code");
const language = document.getElementById("language");
const output = document.getElementById("output");

compileBtn.addEventListener("click", compileCode);

function compileCode(){

    output.innerText = "Compiling...";

    const code = codeEditor.value;
    const langId = language.value;

    fetch("https://course.codequotient.com/api/executeCode", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            code:code,
            langId:langId
        })

    })

    .then(function(response){
        return response.json();
    })

    .then(function(data){

        if(data.error){
            output.innerText = data.error;
        }

        else{

            const codeId = data.codeId;

            checkResult(codeId);
        }

    })

    .catch(function(error){
        output.innerText = "Something went wrong";
    });

}

function checkResult(codeId){

    let interval = setInterval(function(){

        fetch(`https://course.codequotient.com/api/codeResult/${codeId}`)

        .then(function(response){
            return response.json();
        })

        .then(function(result){

            if(result.data && Object.keys(result.data).length > 0){

                clearInterval(interval);

                if(result.data.output){
                    output.innerText = result.data.output;
                }

                else if(result.data.errors){
                    output.innerText = result.data.errors;
                }

            }

        })

        .catch(function(error){

            clearInterval(interval);

            output.innerText = "Error fetching result";

        });

    },2000);

}