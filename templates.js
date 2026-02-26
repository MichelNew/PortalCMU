/**
 * Motor de Redacción Dinámica CMU
 * Genera la sintaxis oficial combinando el Trámite, el Proceso y la Fase.
 */
export function renderDocument(data, tipo, proceso, fase) {
    
    // 1. Identificar el nombre formal del proceso para la redacción
    let procesoNombre = "";
    if (proceso === 'profesionales') {
        procesoNombre = "PRÁCTICAS PROFESIONALES";
    } else if (proceso === 'social') {
        procesoNombre = "SERVICIO SOCIAL";
    } else if (proceso === 'campo') {
        procesoNombre = `PRÁCTICAS DE CAMPO FASE ${fase}`;
    }

    // 2. Definir la acción gramatical según el trámite (Presentación, Aceptación o Término)
    const acciones = {
        presentacion: `solicita su valiosa colaboración para que el alumno(a) de esta institución pueda iniciar su programa de ${procesoNombre}.`,
        aceptacion: `hace de su conocimiento la ACEPTACIÓN formal del interesado(a) para el desarrollo de su ${procesoNombre} en sus instalaciones.`,
        termino: `extiende la presente para constar que el alumno(a) ha FINALIZADO satisfactoriamente su ${procesoNombre}, cumpliendo con el total de horas reglamentarias.`
    };

    // 3. Generar la estructura del oficio con los datos del alumno y la institución
    return `
    TOLUCA, ESTADO DE MÉXICO A ${new Date().toLocaleDateString()}
    OFICIO DE VINCULACIÓN: CMU-VINC-2026-${proceso.toUpperCase()}
    
    A QUIEN CORRESPONDA:
    
    Por medio de la presente, el Departamento de Vinculación del Colegio Mexiquense Universitario hace constar que el C. ${data.nombre.toUpperCase()}, con matrícula institucional ${data.control}, alumno regular de la licenciatura de ${data.licenciatura.toUpperCase()}, 
    ${acciones[tipo]}
    
    Dicho proceso se autoriza en la dependencia: ${data.dependencia.toUpperCase()}, 
    comprendiendo el periodo de vigencia del ${data.inicio} al ${data.termino}.
    
    Sin más por el momento, agradecemos de antemano la atención prestada para el desarrollo académico de nuestro estudiantado.
    
    
    ATENTAMENTE
    
    
    DIRECCIÓN DE VINCULACIÓN ACADÉMICA
    COLEGIO MEXIQUENSE UNIVERSITARIO
    "SER MEXIQUENSE ES SER DIFERENTE"
    `;
}