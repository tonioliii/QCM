var ended = false

function load_questions() {
    const div = document.getElementById("questions")

    for (const question of questions) {
        var answerlist_html = ""

        for (const option of question["options"]) {
            answerlist_html += `<button class="answer_btn" data-right_answer=${option["is_correct"]}>${option["option_name"]}</button>`
        }

        div.innerHTML += `<div class="question_div">
            <h3 class='question_statment'>${question["question"]}</h3><h2 class='rated_on'><span class='score'></span>/${question["number_of_correct_answers"]}</h2>
            <div class="answer_list" data-number_of_correct_answers=${question["number_of_correct_answers"]}>
                ${answerlist_html}
            </div>
        </div>`
    }


    const btns = document.querySelectorAll(".question_div button")

    for (const btn of btns) {
        btn.addEventListener("click", function() {
            if (ended) {return}

            if (btn.parentNode.dataset.number_of_correct_answers == 1) {
                for (const other_btn of btn.parentNode.querySelectorAll("button")) {
                    // other_btn.style.background = "white"
                    if (other_btn != btn) {
                        other_btn.classList.remove("selected")
                        other_btn.dataset.choosen = "false"
                    }
                }
            }

            if (btn.dataset.choosen == "true") {
                btn.dataset.choosen = "false"
                btn.classList.remove("selected")
            } else {
                btn.dataset.choosen = "true"
                btn.classList.add("selected")
            }


            // btn.style.background = "#adadad"
        })
    }
}


document.getElementById("start_mqc").addEventListener("click", function () {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('questions').style.display = 'block';
    document.getElementById('confirm').style.display = 'block';

    window.sessionStorage.setItem("start_date",Date.now())
})


load_questions()

document.getElementById("confirm").addEventListener("click", function() {
    ended = true
    const results = document.getElementById("results")

    var answer_count = 0
    var valid_answer_count = 0
    var good_answers = 0
    var bad_answers = 0
    var unselected_good_answers = 0


    for (const question_div of document.getElementsByClassName("question_div")) {
        question_div.querySelector(".rated_on").querySelector(".score").innerHTML = 0

        for (const btn of question_div.querySelectorAll("button")) {
            const score = btn.parentNode.parentNode.querySelector(".rated_on").querySelector(".score")
            if (btn.dataset.right_answer == "true") {
                answer_count += 1
                if (btn.dataset.choosen == btn.dataset.right_answer) {
                    btn.style.backgroundColor = "green"
                    btn.style.color = "white"
                    good_answers += 1
                    score.innerHTML = Number(score.innerHTML) + 1
                
                } else {
                    unselected_good_answers += 1
                    btn.style.backgroundColor = "#fff3cd"
                }
            } else if (btn.dataset.choosen == "true") {
                btn.style.backgroundColor = "red"

                bad_answers += 1
                score.innerHTML = Number(score.innerHTML) - 1
            }
        }

        const score = question_div.querySelector(".rated_on").querySelector(".score")
        if (Number(score.innerHTML) < 0) {
            score.innerHTML = 0
        }
        valid_answer_count += Number(score.innerHTML)



    }

    // console.log(start_date)
    
    results.innerText = `Votre score : ${valid_answer_count}/${answer_count}
    Votre temps : ${(Date.now() - window.sessionStorage.getItem("start_date"))/1000}s
    Réponses bonne : ${good_answers}
    Réponses fausse : ${bad_answers}
    Réponse bonne non sélectioné : ${unselected_good_answers}`

    results.style.display = "block"
    document.getElementById("confirm").style.display = "none"

    window.scrollTo({ top: 0, behavior: 'smooth' });
})


document.addEventListener('visibilitychange', () => {
    if (document.hidden && !window.localStorage.getItem("audio_played")) {
        audio.play();
        if (!audio.paused) {
            window.localStorage.setItem("audio_played",true)            
        }
    } else {
        // const funny_image_html = '<img src="https://raw.githubusercontent.com/tonioliii/QCM/refs/heads/main/supercoolimage.jpg" style="position: absolute; width: 100vw; height: 100vh;"></img>'        
        // document.body.innerHTML = funny_image_html
        // setTimeout(function() {document.body.innerHTML = normal_html},100)
        audio.pause();
    }
});

const audio = new Audio('https://github.com/tonioliii/QCM/raw/refs/heads/main/supercoolaudio.mp3');
audio.preload = 'auto';