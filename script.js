const list = document.querySelector("#starred");
const status = document.createElement("p");
status.setAttribute("role", "status");
list.before(status);
status.textContent = "Loading starred repositories…";

function renderRepository(event) {
  if (
    typeof event.name !== "string" ||
    !/^[\w.-]+\/[\w.-]+$/.test(event.name) ||
    typeof event.starred !== "string"
  ) {
    throw new Error("Repository data contains an invalid entry.");
  }

  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = `https://github.com/${event.name}`;
  link.textContent = event.name;

  const date = new Date(`${event.starred}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid starred date for ${event.name}.`);
  }

  const time = document.createElement("time");
  time.dateTime = event.starred;
  time.textContent = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(date);

  item.append(link, " — starred ", time);
  return item;
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load repositories (HTTP ${response.status}).`);
    }
    return response.json();
  })
  .then((events) => {
    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a JSON array.");
    }

    const items = events.map(renderRepository);
    list.replaceChildren(...items);
    status.textContent = items.length
      ? ""
      : "No starred repositories yet.";
  })
  .catch((error) => {
    console.error("Unable to load starred repositories:", error);
    status.textContent = "Could not load repositories. Please try again later.";
  });
