const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuración de Azure Custom Vision
const predictionKey = 'CO66Ve3VcS2GIsLTzz2YLlluYjHM5ivJAqkKwlgxgw1pUkXCO1hzJQQJ99AKACYeBjFXJ3w3AAAIACOG3un2';
const endpoint = 'https://clasificadordeflores-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/d801d9f5-8a3c-4aa3-9645-d1e4d510870c/classify/iterations/Iteration2/image';

// Sirve los archivos estáticos
app.use(express.static(path.join(__dirname)));

// Endpoint para clasificar imágenes
app.post('/classify', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const response = await axios.post(endpoint, require('fs').readFileSync(imagePath), {
      headers: {
        'Prediction-Key': predictionKey,
        'Content-Type': 'application/octet-stream',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error en la predicción:', error.message);
    res.status(500).send('Error al clasificar la imagen.');
  }
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

