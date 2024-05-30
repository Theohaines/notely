var currentElevateYour = "note taking";
var deleteMode = true;
var elevateYour = [
  "note taking",
  "productivity",
  "time saving",
  "shopping lists",
  "inventory taking",
  "desk space",
  "creativity",
  "learning",
  "focus",
  "brainstorming",
  "meetings",
  "research",
];

function elevateYourCTA() {
  const elevateYourCtaText = document.getElementById("elevateYourCtaText");

  if (deleteMode) {
    if (elevateYourCtaText.textContent != "elevate your ") {
      setTimeout(() => {
        elevateYourCtaText.textContent = elevateYourCtaText.textContent.slice(
          0,
          -1,
        );
        elevateYourCTA();
      }, 299);
    } else {
      deleteMode = false;
      pickNewRandElevateYour();
      elevateYourCTA();
    }
  } else {
    if (
      elevateYourCtaText.textContent !=
      "elevate your " + currentElevateYour
    ) {
      setTimeout(() => {
        elevateYourCtaText.textContent +=
          currentElevateYour[
            elevateYourCtaText.textContent.length - "elevate your ".length
          ];
        elevateYourCTA();
      }, 200);
    } else {
      deleteMode = true;
      setTimeout(elevateYourCTA, 3000); // Wait for 3 seconds before starting to delete again
    }
  }
}

function pickNewRandElevateYour() {
  currentElevateYour =
    elevateYour[Math.floor(Math.random() * elevateYour.length)];
}

elevateYourCTA();

function redirectURL(url) {
  window.location.href = url;
}
