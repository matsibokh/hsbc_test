const input = document.getElementById("letter");
const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const resultLetter = document.getElementById("result-letter");
const resultCount = document.getElementById("result-count");
const resultCities = document.getElementById("result-cities");

let requestId = 0; // used to ignore stale responses if the user types fast

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function showResult({ letter, count, cities }) {
  resultLetter.textContent = letter.toUpperCase();
  resultCount.textContent = count;
  resultCities.replaceChildren(
    ...cities.map((city) => {
      const li = document.createElement("li");
      li.textContent = city.country
        ? `${city.name} (${city.country})`
        : city.name;
      return li;
    }),
  );
  resultEl.hidden = false;
}

async function onInput() {
  const letter = input.value.trim();
  const id = ++requestId;

  errorEl.hidden = true;
  resultEl.hidden = true;
  statusEl.hidden = true;

  if (!letter) return;
  if (!/^[a-z]$/i.test(letter)) {
    showError("Please enter a single letter.");
    return;
  }

  statusEl.hidden = false;
  try {
    const res = await fetch(
      `/api/cities/count?letter=${encodeURIComponent(letter)}`,
    );
    const body = await res.json();
    if (id !== requestId) return;
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
    showResult(body);
  } catch (err) {
    if (id === requestId) showError(err.message);
  } finally {
    if (id === requestId) statusEl.hidden = true;
  }
}

input.addEventListener("input", onInput);
