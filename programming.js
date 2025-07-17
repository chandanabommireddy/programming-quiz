const quizData = [
  {
    question: "Who created the C language?",
    options: ["Dennis Ritchie", "Bjarne Stroustrup", "James Gosling", "Ken Thompson"],
    answer: "Dennis Ritchie",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Denis_Ritchie_2011.jpg/330px-Denis_Ritchie_2011.jpg"
  },
  {
    question: "What is the correct extension for a C file?",
    options: [".cpp", ".java", ".c", ".py"],
    answer: ".c",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Programming_Language.svg"
  },
  {
    question: "Which library is used for input/output in C?",
    options: ["<stdio.h>", "<stdlib.h>", "<conio.h>", "<string.h>"],
    answer: "<stdio.h>",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/C_Hello_World_Code.png"
  },
  {
    question: "What is the keyword to define a function in C?",
    options: ["def", "function", "void", "define"],
    answer: "void",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/C_function_example.png"
  },
  {
    question: "Which operator is used to compare two values?",
    options: ["=", "==", "!=", ">="],
    answer: "==",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/C_if_condition_example.png"
  }
];

let currentIndex = 0;
let score = 0;
let countdown;
let playerName = "";

function initQuiz() {
  playerName = document.getElementById("player-name").value || "Guest";
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("question-screen").style.display = "block";
  renderQuestion();
}

function renderQuestion() {
  const current = quizData[currentIndex];
  document.getElementById("question-text").textContent = current.question;

  const image = document.getElementById("question-img");
  if (current.image) {
    image.src = current.image;
    image.style.display = "block";
  } else {
    image.style.display = "none";
  }

  const optionsContainer = document.getElementById("option-buttons");
  optionsContainer.innerHTML = "";
  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => evaluateAnswer(option, current.answer);
    optionsContainer.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  let time = 10;
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = `⏱ Time Left: ${time}s`;

  clearInterval(countdown);
  countdown = setInterval(() => {
    time--;
    countdownElement.textContent = `⏱ Time Left: ${time}s`;
    if (time === 0) {
      clearInterval(countdown);
      evaluateAnswer("", quizData[currentIndex].answer, true);
    }
  }, 1000);
}

function evaluateAnswer(selected, correct, isTimeout = false) {
  clearInterval(countdown);

  const resultIcon = document.createElement("div");
  resultIcon.style.fontSize = "48px";
  resultIcon.style.animation = "pop 1s ease";
  resultIcon.textContent = selected === correct ? "😝" : "🙃";
  document.getElementById("question-screen").appendChild(resultIcon);
  setTimeout(() => resultIcon.remove(), 1000);

  if (selected === correct) {
    document.getElementById("sound-correct").play();
    score++;
  } else {
    document.getElementById("sound-wrong").play();
  }

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < quizData.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, 1200);
}

function showResults() {
  document.getElementById("question-screen").style.display = "none";
  document.getElementById("end-screen").style.display = "block";
  document.getElementById("score-display").textContent = `Hey ${playerName}, you scored ${score}/${quizData.length}!`;

  const leaderboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  leaderboard.push({ name: playerName, score, time: new Date().toLocaleString() });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("scoreboard", JSON.stringify(leaderboard.slice(0, 5)));

  const scoreboardList = document.getElementById("scoreboard");
  scoreboardList.innerHTML = "";
  leaderboard.slice(0, 5).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.score} (${entry.time})`;
    scoreboardList.appendChild(li);
  });
}
