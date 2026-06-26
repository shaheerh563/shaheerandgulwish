const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw0HRAYXxJz98EdVpJ5tfNLX1dWzoke1C0kqoNETxBIjEW8avbRHbfnWdQDJSKbirbPZw/exec";
const EVENTS = {
  nikkah: {
    name: "Toronto Nikkah",
    city: "Toronto",
    date: "August 22",
    summary: "Toronto Nikkah, August 22 at 5:00 PM",
    image: "/shaheerandgulwish/nikkah-card.jpeg",
    imageAlt: "Toronto nikkah invitation card"
  },
  walima: {
    name: "Montreal Walima",
    city: "Montreal",
    date: "August 29, 2026",
    summary: "Montreal Walima, August 29, 2026 at 7:00 PM",
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
const guestLabel = document.querySelector("#guestLabel");
const statusEl = document.querySelector("#formStatus");
const submitButton = document.querySelector("#submitButton");

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

function syncGuestField() {
  if (!form || !guestLabel || !guestCount || !form.elements.attending) {
    return;
  }

  const attending = form.elements.attending.value === "Yes";
  guestLabel.style.display = attending ? "grid" : "none";
  guestCount.required = attending;
  guestCount.value = attending ? Math.max(Number(guestCount.value) || 1, 1) : 0;
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

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    formData.append("submitted_at", new Date().toISOString());
    formData.append("source", "wedding-rsvp-page");

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

      setStatus(`
Thank you for your RSVP!

We look forward to celebrating our special day with you.

Shaheer & Gulwish
`, "success");
      const currentEvent = document.body.dataset.event || getInitialEventKey();

      form.reset();
      setEvent(currentEvent);
      syncGuestField();
    } catch (error) {
      setStatus("Something went wrong. Please try again in a moment.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm RSVP";
      }
    }
  });
}

setEvent(getInitialEventKey());
syncGuestField();
