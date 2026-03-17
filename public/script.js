const button = document.getElementById("summarizeBtn");
const textarea = document.getElementById("articleInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

button.addEventListener("click", async () => {

  const article = textarea.value;

  if (!article) {
    alert("Please paste an article first.");
    return;
  }

  result.textContent = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ article })
    });

    console.log(response);
    const data = await response.json();

    loading.classList.add("hidden");
    result.textContent = data.output;

  } catch (error) {
    loading.classList.add("hidden");
    result.textContent = "Error generating summary.";
  }

});