# Mi profe de idiomas

Aplicación móvil personal para aprender **inglés británico** y **noruego bokmål** desde cero, con explicaciones en español. Funciona en Android y iPhone.

## Qué incluye la versión 1

- **Perfil personal**: nombre, objetivo diario (10, 15, 20 o 30 minutos), modo claro/oscuro y audio lento.
- **Dos cursos independientes** (inglés y noruego), cada uno con su propio progreso.
- **Prueba inicial de nivel**: 4 preguntas por unidad; si aciertas 3, se da la unidad por sabida y empiezas en la siguiente.
- **Nivel A1 completo**: 4 unidades × 3 lecciones por idioma (unas 130 palabras y frases por idioma) y un examen por unidad.
- **Lecciones con la estructura pedida**: repaso inicial, vocabulario nuevo con imagen y audio, explicación sencilla, ejercicios, escucha, una pequeña conversación y test final.
- **7 tipos de ejercicio**: elegir significado, elegir traducción, escuchar y elegir, escribir, ordenar palabras, unir parejas (juego) y completar conversaciones.
- **No se avanza sin aprender**: cada lección se supera con un 80 % en el test final y cada unidad con un 80 % en el examen.
- **Repetición de errores**: si fallas un ejercicio, vuelve a salir en la misma lección (hasta 3 veces).
- **Repetición espaciada** (algoritmo SM-2, el de Anki): cada palabra vuelve justo cuando estás a punto de olvidarla.
- **Adaptación**: la app mide tus aciertos en vocabulario, escucha, escritura y gramática; tu punto más débil recibe ejercicios extra y te recomienda qué hacer cada día.
- **Seguimiento**: racha de días, objetivo diario, calendario, estadísticas por habilidad, porcentaje del curso, vocabulario aprendido e historial de errores.
- **Funciona sin conexión**: todo el contenido va dentro de la app y el progreso se guarda en el teléfono.

## Cómo probarla en tu móvil (Expo Go)

Necesitas un ordenador solo para arrancarla la primera vez:

1. Instala **Node.js** (versión LTS) desde https://nodejs.org.
2. Descarga esta carpeta del proyecto en tu ordenador.
3. Abre una terminal dentro de la carpeta y ejecuta:
   ```
   npm install
   npx expo start
   ```
4. En el móvil instala la app gratuita **Expo Go** (Google Play o App Store).
5. Con el móvil y el ordenador en la misma wifi, escanea el código QR que aparece en la terminal:
   - Android: desde la propia app Expo Go.
   - iPhone: con la cámara del iPhone.

Si en tu móvil no suena el noruego, instala la voz noruega en los ajustes del teléfono (Android: *Salida de texto a voz*; iPhone: *Accesibilidad → Contenido leído → Voces*). En el Perfil de la app puedes comprobarlo.

## Tecnología

- **React Native + Expo (SDK 58)** con **Expo Router**: un único código para Android e iPhone.
- **AsyncStorage**: el progreso se guarda en el teléfono, sin servidores ni cuentas.
- **Voces reales grabadas** con Piper (gratis, código abierto): británica "cori" y noruega "talesyntese", generadas por el workflow "Voces reales". Si falta una grabación se usa la voz del teléfono (expo-speech).
- TypeScript.

### Estructura

```
src/
  app/            Pantallas (cada archivo es una ruta)
    (tabs)/       Inicio, Curso, Repaso, Progreso, Perfil
    lesson/[id]   Lección
    exam/[unitId] Examen de unidad
    placement     Prueba de nivel
    review-session Sesión de repaso
  components/     Interfaz: ejercicios, sesión, resultados
  content/        Contenido del curso (en.ts, no.ts)
  lib/            Repetición espaciada, ejercicios, corrección, audio, estadísticas
  state/          Estado y guardado local
scripts/check-content.ts  Comprobación automática del contenido
```

### Comandos útiles

```
npm run typecheck   # comprobar tipos
npm run check       # comprobar el contenido y los ejercicios
npx expo start      # arrancar
```

## Próximas fases

- Profesor con IA (conversación por texto y voz, corrección explicada). Necesita una API de pago (Claude u OpenAI, céntimos por conversación) o la capa gratuita de Google Gemini, con límites diarios.
- Evaluación de pronunciación con el reconocimiento de voz del teléfono (gratis, pero requiere compilar la app en lugar de usar Expo Go).
- Niveles A2 a C2, historias graduadas, diccionario y más juegos.
