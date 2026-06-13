const SCRIPT_URL='https://script.google.com/macros/s/AKfycbzTUzw3IX64LeRmkcISjuKd9bqcfAm0ilILIqwA5nqiX9bhSUIfp3ebcAjtLvhh-Z64Jg/exec'
const EVENTS = {
  nikkah: {
    name: "Toronto Nikkah",
    city: "Toronto",
    date: "August 22",
    summary: "Toronto Nikkah, August 22 at 5:00 PM",
    image: "assets/nikkah-card.jpeg",
    imageAlt: "Toronto nikkah invitation card"
  },
  walima: {
    name: "Montreal Walima",
    city: "Montreal",
    date: "August 29, 2026",
    summary: "Montreal Walima, August 29, 2026 at 7:00 PM",
    image: "assets/walima-card.png",
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
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` is-${type}` : ""}`;
}

function setEvent(eventKey) {
  const selectedEvent = EVENTS[eventKey];

  document.body.dataset.event = eventKey;
  eventInput.value = selectedEvent.name;
  eventCityInput.value = selectedEvent.city;
  eventDateInput.value = selectedEvent.date;
  eventSummary.textContent = selectedEvent.summary;
  invitationImage.src = selectedEvent.image;
  invitationImage.alt = selectedEvent.imageAlt;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.event === eventKey;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function syncGuestField() {
  const attending = form.elements.attending.value === "Yes";
  guestLabel.style.display = attending ? "grid" : "none";
  guestCount.required = attending;
  guestCount.value = attending ? Math.max(Number(guestCount.value) || 1, 1) : 0;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setEvent(tab.dataset.event);
    setStatus("");
  });
});

form.elements.attending.forEach((input) => {
  input.addEventListener("change", syncGuestField);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  if (!form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  formData.append("submitted_at", new Date().toISOString());
  formData.append("source", "wedding-rsvp-page");

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    setStatus("Thank you. Your RSVP has been sent.", "success");
    form.reset();
    setEvent(document.body.dataset.event || "nikkah");
    syncGuestField();
  } catch (error) {
    setStatus("Something went wrong. Please try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirm RSVP";
  }
});

setEvent("nikkah");
syncGuestField();
