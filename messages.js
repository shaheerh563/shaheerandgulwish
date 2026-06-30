const form = document.querySelector("#messageForm");
const anonymous = document.querySelector("#anonymous");
const nameGroup = document.querySelector("#nameGroup");
const nameInput = document.querySelector("#name");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submitButton");

anonymous.addEventListener("change", () => {
  const isAnonymous = anonymous.checked;
  nameGroup.classList.toggle("hidden", isAnonymous);
  nameInput.required = !isAnonymous;
  if (isAnonymous) nameInput.value = "";
});

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
    anonymous.checked = true;
    nameGroup.classList.add("hidden");
    nameInput.required = false;
    statusEl.textContent = "Sent. Thank you for leaving her something beautiful.";
  } catch (error) {
    statusEl.textContent = "Something went wrong. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
  }
});
