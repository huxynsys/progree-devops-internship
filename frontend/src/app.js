const button = document.getElementById("healthButton");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  result.textContent = "Checking system...";

  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
});