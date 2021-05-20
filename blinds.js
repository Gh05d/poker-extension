let notFound = true;
let config;
// Strings which are basically tuples, as they will get splitted by a space between them
const blindLevels = [
  "20 40",
  "25 50",
  "30 60",
  "40 80",
  "50 100",
  "75 150",
  "100 200",
  "150 300",
  "200 400",
  "250 500",
  "300 600",
  "400 800",
  "500 1000",
  "750 1500",
  "1000 2000",
  "1500 3000",
  "2000 4000",
  "3000 6000",
  "4000 8000",
  "5000 10000",
];

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// Needed to update the element as it is a React App
const updateElement = el =>
  el.dispatchEvent(new Event("change", { bubbles: true }));

function updateDuration(el, value) {
  el.value = value;
  const event = new Event("input", { bubbles: true });
  // Hack React16 https://github.com/facebook/react/issues/11488
  const tracker = el._valueTracker;

  if (tracker) {
    tracker.setValue(value);
  }

  el.dispatchEvent(event);
}

async function setBlinds() {
  const button = config.querySelector("button.add-level-blind-button");
  button.click();

  const firstDuration = config.querySelector(
    "tbody tr:first-of-type td:nth-of-type(4) input"
  );

  updateDuration(firstDuration, 10);

  blindLevels.forEach((blind, i) => {
    const row = config.querySelector(`tbody tr:nth-of-type(${i + 2})`);

    const sbInput = row.querySelector("td:nth-of-type(2) input");
    const bbInput = row.querySelector("td:nth-of-type(3) input");

    const [sb, bb] = blind.split(" ");

    sbInput.setAttribute("value", sb);
    updateElement(sbInput);
    bbInput.setAttribute("value", bb);
    updateElement(bbInput);

    if (i + 1 != blindLevels.length) {
      button.click();
    }
  });

  // You can only update a duration if it has at least one "next" neighbor,
  // as the last duration is always infinity and can't be updated
  blindLevels.forEach((_blind, i) => {
    const row = config.querySelector(`tbody tr:nth-of-type(${i + 2})`);
    const duration = row.querySelector("td:nth-of-type(4) input");

    updateDuration(duration, i < 4 || i > 11 ? 10 : 15);
  });

  await sleep(200);

  const submitButton = document.querySelector("form button[type=submit]");
  submitButton.click();
}

async function findConfig() {
  config = document.querySelector("div.config-content table.blind-level-table");

  if (config) {
    found = false;
    await sleep(200);

    const configButtons = document.querySelectorAll("form button");

    configButtons.forEach(button => {
      if (button.innerHTML == "Slow (9s)") {
        button.click();
      }
    });

    await sleep(100);

    return setBlinds();
  } else {
    await sleep(2000);

    return findConfig();
  }
}

findConfig();
