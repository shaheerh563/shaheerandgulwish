const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw0HRAYXxJz98EdVpJ5tfNLX1dWzoke1C0kqoNETxBIjEW8avbRHbfnWdQDJSKbirbPZw/exec";
const EVENTS = {
  nikkah: {
    name: "Toronto Nikkah",
    city: "Toronto",
    date: "August 22, 2026",
    summary: "Toronto Nikkah, August 22, 2026 at 5:00 PM InshaAllah",
    image: "/shaheerandgulwish/nikkah-card.jpeg",
    imageAlt: "Toronto nikkah invitation card"
  },
  walima: {
    name: "Montreal Walima",
    city: "Montreal",
    date: "August 29, 2026",
    summary: "Montreal Walima, August 29, 2026 at 7:00 PM InshaAllah",
    image: "/shaheerandgulwish/walima-card.png",
    imageAlt: "Montreal walima invitation card with red roses"
  }
};

const form = document.querySelector("#rsvpForm");
const tabs = document.querySelectorAll(".event-tab");
const eventInput = document.querySelector("#eventInput");
const eventCityInput = document.querySelector("#eventCityInput");
const eventDateInput = document.querySelector("#eventDateInput");
const eventSummary = document.querySelector("#eventSummary");
const invitationImage = document.querySelector("#invitationImage");
const guestCount = document.querySelector("#guestCount");
const guestGroup = document.querySelector("#guestGroup");
const maleGuestCount = document.querySelector("#maleGuestCount");
const femaleGuestCount = document.querySelector("#femaleGuestCount");
const statusEl = document.querySelector("#formStatus");
const submitButton = document.querySelector("#submitButton");
const familyInput = document.querySelector("#familyInput");

function setStatus(message, type = "") {
  if (!statusEl) {
    return;
  }

  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` is-${type}` : ""}`;
}

function setEvent(eventKey) {
  const selectedEvent = EVENTS[eventKey];

  if (!selectedEvent) {
    return;
  }

  document.body.dataset.event = eventKey;
  if (eventInput) eventInput.value = selectedEvent.name;
  if (eventCityInput) eventCityInput.value = selectedEvent.city;
  if (eventDateInput) eventDateInput.value = selectedEvent.date;
  if (eventSummary) eventSummary.textContent = selectedEvent.summary;
  applyFamilyFromUrl();
  syncSubmittedState();

  if (invitationImage) {
    invitationImage.src = selectedEvent.image;
    invitationImage.alt = selectedEvent.imageAlt;
  }

  tabs.forEach((tab) => {
    const isActive = tab.dataset.event === eventKey;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function normalizeGuestCount(input) {
  if (!input) {
    return 0;
  }

  const value = Math.max(Number(input.value) || 0, 0);
  input.value = value;

  return value;
}

function syncGuestField() {
  if (!form || !guestGroup || !guestCount || !form.elements.attending) {
    return;
  }

  const attending = form.elements.attending.value === "Yes";
  guestGroup.style.display = attending ? "grid" : "none";

  if (!attending) {
    if (maleGuestCount) maleGuestCount.value = 0;
    if (femaleGuestCount) femaleGuestCount.value = 0;
  }

  const maleCount = normalizeGuestCount(maleGuestCount);
  const femaleCount = normalizeGuestCount(femaleGuestCount);
  guestCount.value = attending ? maleCount + femaleCount : 0;
}

function getSubmittedStorageKey(eventKey = document.body.dataset.event || getInitialEventKey()) {
  const familyKey = familyInput?.value.trim().toLowerCase().replace(/\s+/g, "-") || "general";

  return `shaheer-gulwish-rsvp:${eventKey}:${familyKey}`;
}

function hasSubmittedRsvp() {
  try {
    return window.localStorage.getItem(getSubmittedStorageKey()) === "submitted";
  } catch (error) {
    return false;
  }
}

function markSubmittedRsvp() {
  try {
    window.localStorage.setItem(getSubmittedStorageKey(), "submitted");
  } catch (error) {
    // Local storage can be unavailable in private browsing; the server still records the RSVP.
  }
}

function syncSubmittedState() {
  if (!form || !submitButton) {
    return;
  }

  const alreadySubmitted = hasSubmittedRsvp();

  submitButton.disabled = alreadySubmitted;
  submitButton.textContent = alreadySubmitted ? "RSVP Already Submitted" : "Confirm RSVP";

  Array.from(form.elements).forEach((field) => {
    if (field.type !== "hidden" && field !== submitButton) {
      field.disabled = alreadySubmitted;
    }
  });

  if (alreadySubmitted) {
    setStatus("This RSVP link has already been used on this device.", "success");
  }
}

function applyFamilyFromUrl() {
  if (!familyInput) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const family = params.get("family") || params.get("guest") || params.get("f") || "";

  if (family) {
    familyInput.value = family.trim();
  }
}

function getInitialEventKey() {
  const path = window.location.pathname.toLowerCase();
  const eventValue = eventInput?.value.toLowerCase() || "";

  if (path.includes("walima") || eventValue.includes("walima")) {
    return "walima";
  }

  return "nikkah";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setEvent(tab.dataset.event);
    setStatus("");
  });
});

if (form?.elements.attending) {
  form.elements.attending.forEach((input) => {
    input.addEventListener("change", syncGuestField);
  });
}

[maleGuestCount, femaleGuestCount].forEach((input) => {
  input?.addEventListener("input", syncGuestField);
});

document.querySelectorAll("[data-stepper-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.querySelector(`#${button.dataset.stepperTarget}`);

    if (!input) {
      return;
    }

    const change = Number(button.dataset.stepperChange) || 0;
    const min = Number(input.min) || 0;
    const max = Number(input.max) || 20;
    const nextValue = Math.min(Math.max((Number(input.value) || 0) + change, min), max);
    input.value = nextValue;
    syncGuestField();
  });
});
window.rsvpStepperReady = true;

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    if (!form.reportValidity()) {
      return;
    }

    syncGuestField();

    const formData = new FormData(form);
    formData.append("submitted_at", new Date().toISOString());
    formData.append("source", "wedding-rsvp-page");

    if (hasSubmittedRsvp()) {
      setStatus("This RSVP link has already been used on this device.", "success");
      syncSubmittedState();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      markSubmittedRsvp();
      setStatus(`
Thank you for your RSVP!

We look forward to celebrating our special day with you.

Shaheer & Gulwish
`, "success");
      const currentEvent = document.body.dataset.event || getInitialEventKey();

      form.reset();
      setEvent(currentEvent);
      syncGuestField();
      syncSubmittedState();
    } catch (error) {
      setStatus("Something went wrong. Please try again in a moment.", "error");
    } finally {
      if (submitButton && !hasSubmittedRsvp()) {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm RSVP";
      }
    }
  });
}

setEvent(getInitialEventKey());
syncGuestField();
syncSubmittedState();
