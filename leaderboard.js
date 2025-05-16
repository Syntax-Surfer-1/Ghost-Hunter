const scriptURL = "https://script.google.com/macros/s/AKfycbx86r-Ewu5O4ugiAn4qkIjmKq7jD1drewHr3tD15LThZxr9Kicz5RGFC8fiGjYoPuZMuw/exec";

// Submit player's score
function submitScore(name, score) {
  if (!name || name.trim() === "") return;

  const data = new FormData();
  data.append("name", name);
  data.append("score", score);

  fetch(scriptURL, {
    method: "POST",
    body: data
  })
    .then(response => response.text())
    .then(result => {
      console.log("Score submitted:", result);
      fetchLeaderboard(); // Refresh after submission
    })
    .catch(error => {
      console.error("Error submitting score:", error);
    });
}

// Fetch and display leaderboard
function fetchLeaderboard() {
  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      const leaderboard = document.getElementById("leaderboard");
      leaderboard.innerHTML = ""; // Clear previous entries

      data.sort((a, b) => b.score - a.score); // Highest first
      data.slice(0, 10).forEach((entry, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${entry.name} — ${entry.score}`;
        leaderboard.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Leaderboard fetch error:", err);
    });
}
