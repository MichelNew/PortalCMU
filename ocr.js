// ocr.js

export async function runOCR(file, onProgress, onResult, onError) {
  try {
    if (!file) throw new Error("No se seleccionó ninguna imagen");

    const imageURL = URL.createObjectURL(file);

    // Mostrar progreso visual desde el callback
    if (onProgress) onProgress("Preprocesando imagen...", 0); 

    // 1 Preprocesamiento de la imagen (mejora contraste, escala, etc.)
    const processedImage = await preprocessImage(imageURL);

    // 2️ Inicializar Tesseract con mejores opciones
    const worker = await Tesseract.createWorker("spa", 1, {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress)
          // Si activas el OCR real, aquí se envía el progreso y la confianza
          onProgress(`Reconociendo texto...`, Math.round(m.progress * 100));
      },
    });

    // 3️ Ejecutar reconocimiento
    const { data } = await worker.recognize(processedImage);

    // 4️ Limpiar texto y aplicar correcciones comunes
    const cleanText = cleanOCRText(data.text);

    await worker.terminate();

    // 5️ Retornar resultados: Devolvemos el texto limpio Y la confianza media
    if (onResult) onResult({
        text: cleanText,
        confidence: data.confidence 
    });
  } catch (err) {
    if (onError) onError(err);
    console.error("Error en OCR:", err);
  }
}

// --- Función para limpiar texto OCR ---
function cleanOCRText(text) {
  return text
    .replace(/[^\x00-\x7F]/g, " ") 
    .replace(/\s{2,}/g, " ")
    .replace(/\bO\b/g, "0") 
    .replace(/\bI\b/g, "1")
    .replace(/SociaI/g, "Social")
    .replace(/Práctic[aá]s?/gi, "Prácticas")
    .replace(/\bdeI\b/g, "del")
    .trim();
}

// --- Preprocesamiento con Canvas (EXPORTADO) ---
export async function preprocessImage(src) { 
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = 1.5;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = avg > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.src = src;
  });
}