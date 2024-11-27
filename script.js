document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  const imageInput = document.getElementById('imageInput');
  const resultContainer = document.getElementById('result');
  const predictionMessage = document.getElementById('predictionMessage');

  // Validación: Verifica si se seleccionó un archivo
  if (imageInput.files.length === 0) {
      alert("Por favor, selecciona una imagen.");
      return;
  }

  formData.append('image', imageInput.files[0]);

  // Muestra un mensaje de carga
  predictionMessage.textContent = "Clasificando imagen... Por favor espera.";

  try {
      const response = await fetch('/classify', {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error("Error en la clasificación de la imagen.");
      }

      const prediction = await response.json();
      displayTopResult(prediction);
  } catch (error) {
      predictionMessage.textContent = `Error: ${error.message}`;
  }
});

// Función para mostrar solo el resultado con la mayor probabilidad
function displayTopResult(prediction) {
  const resultContainer = document.getElementById('result');
  const predictionMessage = document.getElementById('predictionMessage');

  if (prediction.predictions && prediction.predictions.length > 0) {
      // Encontrar el resultado con la probabilidad más alta
      const topPrediction = prediction.predictions.reduce((max, current) =>
          current.probability > max.probability ? current : max
      );

      predictionMessage.textContent = "¡Clasificación completa!";
      resultContainer.innerHTML = `
          <p>La flor es: <strong>${topPrediction.tagName}</strong></p>
          <p>Probabilidad: <strong>${(topPrediction.probability * 100).toFixed(2)}%</strong></p>
      `;
  } else {
      predictionMessage.textContent = "No se encontraron resultados.";
      resultContainer.innerHTML = "";
  }
}
