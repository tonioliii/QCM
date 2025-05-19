const questions = [
  { id: "q1", question: "Un atome est électriquement neutre car :", options: { A: "Il possède plus de protons que d’électrons", B: "Il possède autant de protons que de neutrons", C: "Il possède autant de protons que d’électrons", D: "Il ne possède pas de charges électriques" }, correct: ["C"] },
  { id: "q2", question: "Parmi les particules suivantes, lesquelles sont présentes dans le noyau ?", options: { A: "Protons", B: "Neutrons", C: "Électrons", D: "Photons" }, correct: ["A", "B"] },
  { id: "q3", question: "Le nombre de protons dans le noyau est appelé :", options: { A: "Nombre de masse", B: "Nombre atomique", C: "Nombre neutronique", D: "Nombre isotopique" }, correct: ["B"] },
  { id: "q4", question: "Les particules électriquement neutres sont :", options: { A: "Neutrons", B: "Protons", C: "Électrons", D: "Atomes neutres" }, correct: ["A", "D"] },
  { id: "q5", question: "Quel est le nombre de nucléons dans un noyau contenant 6 protons et 6 neutrons ?", options: { A: "6", B: "12", C: "18", D: "3" }, correct: ["B"] },
  { id: "q6", question: "Quelles affirmations sont vraies pour un isotope ?", options: { A: "Même nombre de protons", B: "Même nombre de neutrons", C: "Même symbole chimique", D: "Même nombre de nucléons" }, correct: ["A", "C"] },
  { id: "q7", question: "Quel est le symbole de l’électron ?", options: { A: "e⁺", B: "e⁻", C: "n⁰", D: "p⁺" }, correct: ["B"] },
  { id: "q8", question: "Les modèles atomiques successifs ont permis :", options: { A: "De mieux connaître la structure de l’atome", B: "D'expliquer le Big Bang", C: "D'affiner la position des électrons", D: "De déterminer les réactions nucléaires" }, correct: ["A", "C"] },
  { id: "q9", question: "La charge du proton est :", options: { A: "+1", B: "-1", C: "0", D: "+2" }, correct: ["A"] },
  { id: "q10", question: "Le neutron est :", options: { A: "Plus léger que l’électron", B: "Chargé positivement", C: "Chargé négativement", D: "Neutre" }, correct: ["D"] }
];

let stats = { essais: 0, bonnes: 0, erreurs: 0, tentatives: {} };
questions.forEach(q => stats.tentatives[q.id] = 0);

let erreurIds = [];
let isRetry = false;

let bonnesInitiales = 0;

let timer;
let timeElapsed = 0;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("qcmForm");

  const remplirQuestions = (filtrerErreurs = false) => {
  form.innerHTML = "";
  const cible = filtrerErreurs ? erreurIds : questions.map(q => q.id);

  questions.forEach(q => {
    if (!cible.includes(q.id)) return;

    const div = document.createElement("div");
    div.className = "question";
    div.id = `div-${q.id}`;

    // Ajout du bouton Indice
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const h3 = document.createElement("h3");
    h3.textContent = q.question;

    const indiceBtn = document.createElement("button");
    indiceBtn.textContent = "💡 Indice (par hugo)";
    indiceBtn.className = "indice-btn";
    indiceBtn.type = "button";
    indiceBtn.onclick = () => {
      window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0", "_blank");
    };

    header.appendChild(h3);
    header.appendChild(indiceBtn);
    div.appendChild(header);

    const isMulti = q.correct.length > 1;
    Object.entries(q.options).forEach(([k, v]) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="${isMulti ? "checkbox" : "radio"}" name="${q.id}" value="${k}" onchange="toggleBold(this)"> ${v}`;
      div.appendChild(label);
    });

    form.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.textContent = filtrerErreurs ? "Corriger" : "Soumettre";
  btn.type = "button";
  btn.onclick = filtrerErreurs ? bilanFinal : corriger;
  form.appendChild(btn);
};



  window.startQCM = function () {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("qcmContainer").style.display = "block";
    document.getElementById("timer").style.display = "block";
    document.getElementById("result").style.display = "none";
    document.getElementById("stats").style.display = "none";
    document.getElementById("chartContainer").style.display = "none";
    document.getElementById("finalButtons").style.display = "none";
    erreurIds = [];
    isRetry = false;

    bonnesInitiales = 0;

    stats = { essais: 0, bonnes: 0, erreurs: 0, tentatives: {} };
    questions.forEach(q => stats.tentatives[q.id] = 0);
    remplirQuestions();
    startTimer();
  };

  function corriger() {
    stopTimer();
    stats.essais++;
    let score = 0;
    erreurIds = [];
    let resultHTML = "<h2>Résultats</h2>";

    questions.forEach(q => {
      const inputs = [...document.querySelectorAll(`input[name="${q.id}"]`)];
      const selected = inputs.filter(i => i.checked).map(i => i.value).sort().join(",");
      const expected = q.correct.sort().join(",");
      stats.tentatives[q.id]++;
      const isCorrect = selected === expected;

      if (isCorrect) {
        score++;
        resultHTML += `<div class="correction"><strong>${q.question}</strong><br>✅ Bonne réponse</div>`;
      } else {
        erreurIds.push(q.id);
        resultHTML += `<div class="correction wrong"><strong>${q.question}</strong><br>❌ Mauvaise réponse</div>`;
      }      

      inputs.forEach(i => i.disabled = true);
    });
    
    bonnesInitiales = score;

    document.getElementById("questionsContainer").style.display = "none";
    document.getElementById("result").innerHTML = resultHTML;
    document.getElementById("result").style.display = "block";

    if (erreurIds.length > 0) {
      const retryBtn = document.createElement("button");
      retryBtn.textContent = "Réessayer les erreurs";
      retryBtn.onclick = () => {
        isRetry = true;
        document.getElementById("result").style.display = "none";
        document.getElementById("questionsContainer").style.display = "block";
        remplirQuestions(true);
        startTimer();
      };
      document.getElementById("result").appendChild(retryBtn);
    } else {
      bilanFinal();
    }

    saveScore(score);
  }

  function bilanFinal() {
  stopTimer();
  let score = 0;
  let correctionHTML = "<h3>Correction :</h3>";

  questions.forEach(q => {
    const inputs = [...document.querySelectorAll(`input[name="${q.id}"]`)];
    const selected = inputs.filter(i => i.checked).map(i => i.value).sort().join(",");
    const expected = q.correct.sort().join(",");
    const correcte = selected === expected;

    if (correcte) score++;

    const bonnesReponses = q.correct.map(rep => q.options[rep]).join(", ");
    const classes = correcte ? "correction" : "correction wrong";

    correctionHTML += `<div class="${classes}"><strong>${q.question}</strong><br>`;
    correctionHTML += correcte
      ? "✅ Bonne réponse"
      : `❌ Mauvaise réponse<br><em>✅ Réponse attendue : ${bonnesReponses}</em>`;
    correctionHTML += `</div>`;

    inputs.forEach(i => i.disabled = true);
  });

  saveScore(score);
  const message = getScoreMessage(score);

  document.getElementById("questionsContainer").style.display = "none";
  document.getElementById("result").innerHTML =
    `<h2><strong>Score :</strong> ${score}/10<br>${message}</h2>` +
    correctionHTML;

  document.getElementById("result").style.display = "block";
  document.getElementById("stats").style.display = "block";
  document.getElementById("chartContainer").style.display = "block";
  document.getElementById("finalButtons").style.display = "block";

  afficherStats();
  afficherGraphiqueScores();
}


  function getScoreMessage(score) {
    if (score === 10) return "Parfait.";
    if (score === 9) return "Très bien.";
    if (score >= 7) return "Bien.";
    if (score >= 4) return "Tu peux encore progresser.";
    if (score >= 1) return "Tu manques de connaissances.";
    return "Es-tu vraiment en terminale ?";
  }

  function saveScore(score) {
    const scores = JSON.parse(localStorage.getItem("historiqueScoresQCM") || "[]");
    scores.push(score);
    localStorage.setItem("historiqueScoresQCM", JSON.stringify(scores));
  }

  function afficherStats() {
    let table = "<h3>Statistiques</h3><table><tr><th>Question</th><th>Réponse</th><th>Correct ?</th></tr>";
    questions.forEach(q => {
      const inputs = [...document.querySelectorAll(`input[name="${q.id}"]`)];
      const selected = inputs.filter(i => i.checked).map(i => i.value).sort().join(",");
      const expected = q.correct.sort().join(",");
      const correcte = selected === expected;
      table += `<tr><td>${q.id}</td><td>${selected || "-"}</td><td>${correcte ? "✅" : "❌"}</td></tr>`;
    });
    table += "</table>";
    document.getElementById("stats").innerHTML = table;
  }

  function afficherGraphiqueScores() {
    const scores = JSON.parse(localStorage.getItem("historiqueScoresQCM") || "[]");
    const ctx = document.getElementById("scoreChart").getContext("2d");
    if (window.chart) window.chart.destroy();
    window.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: scores.map((_, i) => `Essai ${i + 1}`),
        datasets: [{
          label: "Scores",
          data: scores,
          borderColor: "blue",
          backgroundColor: "lightblue",
          fill: true
        }]
      }
    });
  }

  window.resetHistorique = function () {
    localStorage.removeItem("historiqueScoresQCM");
    alert("Historique supprimé.");
    afficherGraphiqueScores();
  };

  window.toggleBold = function (input) {
    const label = input.closest("label");
    if (input.type === "checkbox") {
      label.classList.toggle("selected", input.checked);
    } else {
      const radios = document.querySelectorAll(`input[name="${input.name}"]`);
      radios.forEach(r => r.closest("label").classList.remove("selected"));
      label.classList.add("selected");
    }
  };

  function startTimer() {
    timer = setInterval(() => {
      timeElapsed++;
      document.getElementById("timerDisplay").textContent = formatTime(timeElapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? "0" + s : s}`;
  }

  // Initialisation du thème
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(`${savedTheme}-mode`);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.innerHTML = savedTheme === "dark" ? "☀️ Mode clair" : "🌑 Mode sombre";
}

  window.toggleTheme = function () {
    const body = document.body;
    const btn = document.getElementById("themeToggleBtn");
    if (body.classList.contains("dark-mode")) {
      body.classList.replace("dark-mode", "light-mode");
      localStorage.setItem("theme", "light");
      btn.innerHTML = "🌑 Mode sombre";
    } else {
      body.classList.replace("light-mode", "dark-mode");
      localStorage.setItem("theme", "dark");
      btn.innerHTML = "☀️ Mode clair";
    }
  };

window.restartQCM = function () {
  stopTimer(); // stoppe l'ancien timer s'il tournait encore
  timeElapsed = 0;
  document.getElementById("timerDisplay").textContent = "0:00";
  
  bonnesInitiales = 0;

  erreurIds = [];
  isRetry = false;
  stats = { essais: 0, bonnes: 0, erreurs: 0, tentatives: {} };
  questions.forEach(q => stats.tentatives[q.id] = 0);

  document.getElementById("result").style.display = "none";
  document.getElementById("stats").style.display = "none";
  document.getElementById("chartContainer").style.display = "none";
  document.getElementById("finalButtons").style.display = "none";

  document.getElementById("questionsContainer").style.display = "block";
  document.getElementById("qcmContainer").style.display = "block";
  document.getElementById("timer").style.display = "block";

  remplirQuestions(); // recharge toutes les questions
  startTimer();       // redémarre le chrono
};

});
