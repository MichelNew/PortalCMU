// utils.js - funciones para parseo específico del formulario (ejemplos y heurísticas)

export function parseFormText(rawText) {
  // Normalizar: quitar retornos de carro extra y múltiples espacios
  const r = rawText.replace(/\r/g,'').replace(/\t/g,' ').replace(/\u00A0/g,' ').replace(/\uFEFF/g, '').replace(/\s+\n/g,'\n');
  const lines = r.split(/\n+/).map(l=>l.trim()).filter(Boolean);

  const text = lines.join('\n');

  const out = {};

  // --- 1. DATOS PERSONALES ---

  let m = text.match(/Nombre del Prestador[:\s]*([\s\S]*?)\nDomicilio/i); 
  if(m) out.nombre = cleanSpaces(m[1].trim());

  m = text.match(/Domicilio\s+particular[:\s]*([\s\S]*?)\n(?:Colonia|Teléfono)/i) || text.match(/Domicilio[:\s]*([\s\S]*?)\n(?:Colonia|Teléfono)/i);
  if(m) out.domicilio = cleanSpaces(m[1].trim().replace(/\n/g, ' '));
  
  m = text.match(/Edad[:\s]*([0-9]{1,3})/i);
  if(m) out.edad = m[1];

  m = text.match(/Sexo[:\s]*([A-Za-z]+)/i);
  if(m) out.sexo = m[1];
  
  m = text.match(/Teléfono[:\s]*(\d{7,12})/i);
  if(m) out.telefono = m[1];


  // --- 2. ESCOLARIDAD ---

  m = text.match(/Licenciatura[:\s]*([\s\S]*?)\n(?:Semestre|No\.?\s*de\s*Control)/i);
  if(m) out.licenciatura = cleanSpaces(m[1].trim().replace(/\n/g, ' '));

  m = text.match(/(Semestre|Cuatrimestre)[:\s]*([0-9º°\w]+)/i);
  if(m) out.semestre = m[2];

  m = text.match(/No\.?\s*de\s*Control[:\s]*([A-Z0-9\-\s]{6,})/i) || text.match(/No\.?\s*control[:\s]*([A-Z0-9\-\s]{6,})/i);
  if(m) out.control = cleanSpaces(m[1]);

  m = text.match(/Per[ií]odo de Inicio[:\s]*([0-9]{1,2}\s+de\s+[A-Za-z]+(?:\s+de\s+[0-9]{4})?)/i);
  if(m) out.inicio = m[1];
  
  m = text.match(/T[ée]rmino[:\s]*([0-9]{1,2}\s+de\s+[A-Za-z]+(?:\s+de\s+[0-9]{4})?)/i);
  if(m) out.termino = m[1];

  m = text.match(/Servicio Social/i);
  if(m) out.tipo = 'Servicio Social';
  m = text.match(/Pr[aá]cticas Profesionales|Pr[aá]cticas Escolares|Pr[áa]cticas/i);
  if(m && out.tipo) out.tipo = 'Servicio Social / Prácticas';
  else if (m) out.tipo = 'Prácticas';


  // --- 3. INFORMACIÓN DE LA DEPENDENCIA ---
  
  m = text.match(/Dependencia Oficial u organismo[:\s]*([\s\S]*?)\nDirección/i);
  if(m) out.dependencia = cleanSpaces(m[1].trim().replace(/\n/g, ' '));

  m = text.match(/Dirección[:\s]*([\s\S]*?)(?:Teléfono|Nombre del programa)/i);
  if(m) out.direccionDep = cleanSpaces(m[1].trim().replace(/\n/g, ' '));

  m = text.match(/Actividad B[aá]sica[:\s]*([A-Za-z0-9ÁÉÍÓÚÑñ\.\,\s]{6,})/i);
  if(m) out.actividad = cleanSpaces(m[1]);


  return out;
}

function cleanSpaces(s){
  return s.replace(/\s{2,}/g,' ').replace(/^\s+|\s+$/g,'');
}