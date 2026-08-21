/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 27: /bin/ps: Operation not permitted
const form = document.querySelector("#messageForm");
const anonymous = document.querySelector("#anonymous");
const nameInput = document.querySelector("#name");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submitButton");
const messageCount = document.querySelector("#messageCount");

function updateCharacterCount() {
  messageCount.textContent = `${form.message.value.length} / 1500`;
}

function syncAnonymousChoice() {
  const isAnonymous = anonymous.checked;
  nameInput.disabled = isAnonymous;
  nameInput.placeholder = isAnonymous ? "Anonymous note selected" : "How should we sign your note?";
  if (isAnonymous) nameInput.value = "";
}

anonymous.addEventListener("change", syncAnonymousChoice);
form.message.addEventListener("input", updateCharacterCount);
syncAnonymousChoice();
updateCharacterCount();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const scriptUrl = window.MESSAGES_CONFIG?.GOOGLE_SCRIPT_URL;
  if (!scriptUrl || scriptUrl.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
    statusEl.textContent = "This page is almost ready. Please connect the message sheet first.";
    return;
  }

  const payload = {
    message: form.message.value.trim(),
    anonymous: anonymous.checked,
    name: anonymous.checked ? "" : form.name.value.trim()
  };

  if (!payload.message) {
    statusEl.textContent = "Please write a message before sending.";
    return;
  }

  submitButton.disabled = true;
  statusEl.textContent = "Sending...";

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    form.reset();
    anonymous.checked = false;
    syncAnonymousChoice();
    updateCharacterCount();
    statusEl.textContent = "Thank you all for helping me make something special for your friend!";
  } catch (error) {
    statusEl.textContent = "Something went wrong. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
  }
});
