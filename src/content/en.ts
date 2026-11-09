// Curso de inglés británico. Explicaciones en español.
import type { Course } from '../types';
import { lesson } from './build';

const L = (id: string, input: Parameters<typeof lesson>[2]) => lesson('en', id, input);

export const english: Course = {
  lang: 'en',
  name: 'Inglés',
  flag: '🇬🇧',
  variant: 'Inglés británico',
  speechLang: 'en-GB',
  extraLetters: [],
  levels: [
    {
      id: 'A1',
      title: 'A1 · Principiante',
      description: 'Desde cero: saludar, presentarte, hablar de tu familia, pedir comida y contar tu día.',
      units: [
        {
          id: 'en-u1',
          title: 'Saludos y presentaciones',
          emoji: '👋',
          lessons: [
            L('en-u1-l1', {
              title: 'Hola y adiós',
              goal: 'Saludar y despedirte según la hora del día y dar las gracias.',
              vocab: [
                ['hello', 'hola', '👋', { example: 'Hello, Anna!', exampleEs: '¡Hola, Anna!', note: 'Se pronuncia aproximadamente "jelóu". La h suena como una j suave.' }],
                ['good morning', 'buenos días', '🌅', { example: 'Good morning, Tom.', exampleEs: 'Buenos días, Tom.', note: 'Se usa hasta las 12 del mediodía.' }],
                ['good afternoon', 'buenas tardes', '🌤️', { note: 'De las 12 a las 6 de la tarde, más o menos.' }],
                ['good evening', 'buenas tardes / buenas noches (al llegar)', '🌆', { note: 'Desde las 6 de la tarde, para saludar al llegar.' }],
                ['goodbye', 'adiós', '🚶', { alt: ['bye'], note: '"Bye" es la forma corta e informal.' }],
                ['see you later', 'hasta luego', '🔜', { alt: ['see you'] }],
                ['thank you', 'gracias', '🙏', { alt: ['thanks'], note: 'La "th" se pronuncia con la lengua entre los dientes, como la "z" en España.' }],
                ['please', 'por favor', '🤲'],
              ],
              tip: {
                title: 'Saludar según la hora',
                body:
                  'En inglés el saludo cambia con la hora: "good morning" por la mañana, "good afternoon" después de comer y "good evening" a partir de las seis.\n\n¡Ojo! "Good night" NO es un saludo: solo se dice al despedirte por la noche o al irte a dormir.\n\n"Hello" sirve a cualquier hora y "hi" es aún más informal.',
                examples: [
                  { text: 'Good evening, sir.', es: 'Buenas noches, señor. (al llegar)' },
                  { text: 'Good night, see you tomorrow.', es: 'Buenas noches, hasta mañana. (al irte)' },
                ],
              },
              sentences: [
                ['Good morning, Tom.', 'Buenos días, Tom.'],
                ['Thank you very much.', 'Muchas gracias.'],
                ['See you later, Anna.', 'Hasta luego, Anna.'],
              ],
              dialog: {
                title: 'En la oficina por la mañana',
                lines: [
                  ['A', 'Good morning!', '¡Buenos días!'],
                  ['B', 'Good morning! How are you?', '¡Buenos días! ¿Cómo estás?'],
                  ['A', 'Fine, thanks. And you?', 'Bien, gracias. ¿Y tú?'],
                  ['B', 'Very well, thank you.', 'Muy bien, gracias.'],
                ],
              },
            }),
            L('en-u1-l2', {
              title: 'Me llamo…',
              goal: 'Decir tu nombre, preguntar el de otra persona y usar el verbo "to be".',
              vocab: [
                ['name', 'nombre', '🏷️'],
                ['my name is', 'me llamo', '🙋', { example: 'My name is Guille.', exampleEs: 'Me llamo Guille.' }],
                ["what's your name?", '¿cómo te llamas?', '❓', { alt: ['what is your name?', 'what is your name'] }],
                ['nice to meet you', 'encantado de conocerte', '🤝'],
                ['I am', 'yo soy / yo estoy', '👤', { alt: ["I'm"], note: 'En la conversación casi siempre se dice "I\'m".' }],
                ['you are', 'tú eres / tú estás', '👉', { alt: ["you're"] }],
                ['yes', 'sí', '✅'],
                ['no', 'no', '❌'],
                ['sorry', 'perdón / lo siento', '😔'],
              ],
              tip: {
                title: 'El verbo "to be" (ser y estar)',
                body:
                  'En inglés "ser" y "estar" son el mismo verbo: "to be".\n\nI am (yo soy/estoy)\nyou are (tú eres/estás)\nhe is (él es/está)\nshe is (ella es/está)\n\nEn el inglés hablado se juntan: I\'m, you\'re, he\'s, she\'s.\n\nAdemás, en inglés SIEMPRE hay que decir el sujeto: no se puede decir solo "am tired", hay que decir "I am tired".',
                examples: [
                  { text: "I'm Guille.", es: 'Soy Guille.' },
                  { text: 'She is tired.', es: 'Ella está cansada.' },
                ],
              },
              sentences: [
                ['My name is Guille.', 'Me llamo Guille.'],
                ["I'm from Barcelona.", 'Soy de Barcelona.'],
                ['Nice to meet you, Sarah.', 'Encantado de conocerte, Sarah.'],
              ],
              dialog: {
                title: 'Conociendo a alguien',
                lines: [
                  ['A', "Hi! What's your name?", '¡Hola! ¿Cómo te llamas?'],
                  ['B', "I'm Sarah. And you?", 'Soy Sarah. ¿Y tú?'],
                  ['A', 'My name is Guille.', 'Me llamo Guille.'],
                  ['B', 'Nice to meet you, Guille.', 'Encantada de conocerte, Guille.'],
                ],
              },
            }),
            L('en-u1-l3', {
              title: '¿De dónde eres?',
              goal: 'Decir de dónde eres, dónde vives y tu nacionalidad.',
              vocab: [
                ['Spain', 'España', '🇪🇸'],
                ['England', 'Inglaterra', '🏴'],
                ['Norway', 'Noruega', '🇳🇴'],
                ['Spanish', 'español (nacionalidad o idioma)', '🗣️', { note: 'Las nacionalidades e idiomas se escriben con MAYÚSCULA en inglés.' }],
                ['English', 'inglés (nacionalidad o idioma)', '💂'],
                ['where', 'dónde', '📍', { note: 'Se pronuncia "uéar".' }],
                ['from', 'de (origen)', '🧭'],
                ['I live in', 'vivo en', '🏡', { example: 'I live in Madrid.', exampleEs: 'Vivo en Madrid.' }],
              ],
              tip: {
                title: 'Preguntar el origen',
                body:
                  'Para preguntar de dónde es alguien: "Where are you from?". Fíjate en que "from" va al FINAL de la pregunta.\n\nRespuesta: "I\'m from Spain."\n\nY recuerda: en inglés los países, las nacionalidades y los idiomas van con mayúscula: Spanish, English, Norwegian.',
                examples: [
                  { text: 'Where are you from?', es: '¿De dónde eres?' },
                  { text: "I'm Spanish and I live in Oslo.", es: 'Soy español y vivo en Oslo.' },
                ],
              },
              sentences: [
                ['Where are you from?', '¿De dónde eres?'],
                ["I'm from Spain.", 'Soy de España.'],
                ['I live in London.', 'Vivo en Londres.'],
              ],
              dialog: {
                title: 'En una fiesta',
                lines: [
                  ['A', 'Where are you from?', '¿De dónde eres?'],
                  ['B', "I'm from Spain. And you?", 'Soy de España. ¿Y tú?'],
                  ['A', "I'm English. I live in Oslo.", 'Soy inglés. Vivo en Oslo.'],
                  ['B', 'Oh, I love Norway!', '¡Oh, me encanta Noruega!'],
                ],
              },
            }),
          ],
        },
        {
          id: 'en-u2',
          title: 'Personas y familia',
          emoji: '👨‍👩‍👧',
          lessons: [
            L('en-u2-l1', {
              title: 'Mi familia',
              goal: 'Hablar de tu familia y usar "my, your, his, her".',
              vocab: [
                ['family', 'familia', '👨‍👩‍👧'],
                ['mother', 'madre', '👩', { alt: ['mum'], note: 'En Reino Unido se dice "mum" de forma cariñosa.' }],
                ['father', 'padre', '👨', { alt: ['dad'] }],
                ['brother', 'hermano', '👦'],
                ['sister', 'hermana', '👧'],
                ['son', 'hijo', '🧒'],
                ['daughter', 'hija', '👧', { note: 'Se pronuncia "dóta". La "gh" no suena.' }],
                ['parents', 'padres (madre y padre)', '👫'],
              ],
              tip: {
                title: 'Los posesivos: my, your, his, her',
                body:
                  'my = mi/mis\nyour = tu/tus\nhis = su (de él)\nher = su (de ella)\n\nA diferencia del español, no cambian en plural: "my brother" y "my brothers".\n\nY en inglés se distingue de quién es: "his sister" (la hermana de él) y "her sister" (la hermana de ella).',
                examples: [
                  { text: 'This is my mother.', es: 'Esta es mi madre.' },
                  { text: 'Her brother lives in London.', es: 'Su hermano (de ella) vive en Londres.' },
                ],
              },
              sentences: [
                ['This is my sister.', 'Esta es mi hermana.'],
                ['My parents live in Spain.', 'Mis padres viven en España.'],
                ['His brother is tall.', 'Su hermano (de él) es alto.'],
              ],
              dialog: {
                title: 'Mirando fotos',
                lines: [
                  ['A', 'Who is this?', '¿Quién es este?'],
                  ['B', "This is my brother. He's twenty.", 'Este es mi hermano. Tiene veinte años.'],
                  ['A', 'And who is she?', '¿Y quién es ella?'],
                  ['B', "She's my mother.", 'Es mi madre.'],
                ],
              },
            }),
            L('en-u2-l2', {
              title: 'Números y edad',
              goal: 'Contar del 1 al 10 y decir tu edad.',
              vocab: [
                ['one', 'uno', '1️⃣'],
                ['two', 'dos', '2️⃣', { note: 'Se pronuncia "tu".' }],
                ['three', 'tres', '3️⃣', { note: 'La "th" con la lengua entre los dientes: "zri".' }],
                ['four', 'cuatro', '4️⃣'],
                ['five', 'cinco', '5️⃣'],
                ['six', 'seis', '6️⃣'],
                ['seven', 'siete', '7️⃣'],
                ['eight', 'ocho', '8️⃣', { note: 'Se pronuncia "éit".' }],
                ['nine', 'nueve', '9️⃣', { note: 'Se pronuncia "náin".' }],
                ['ten', 'diez', '🔟'],
              ],
              tip: {
                title: 'La edad se dice con "to be"',
                body:
                  'En español "tenemos" años, pero en inglés "somos" años: se usa el verbo "to be".\n\n✅ I am thirty.\n❌ I have thirty years.\n\nPara preguntar: "How old are you?" (literalmente "¿cómo de viejo eres?").',
                examples: [
                  { text: 'How old are you?', es: '¿Cuántos años tienes?' },
                  { text: "I'm ten years old.", es: 'Tengo diez años.' },
                ],
              },
              sentences: [
                ['How old are you?', '¿Cuántos años tienes?'],
                ['I have two sisters.', 'Tengo dos hermanas.'],
                ['My son is five.', 'Mi hijo tiene cinco años.'],
              ],
              dialog: {
                title: 'En el parque',
                lines: [
                  ['A', 'How old is your daughter?', '¿Cuántos años tiene tu hija?'],
                  ['B', "She's seven. And your son?", 'Tiene siete. ¿Y tu hijo?'],
                  ['A', "He's nine.", 'Tiene nueve.'],
                  ['B', 'They are almost the same age!', '¡Tienen casi la misma edad!'],
                ],
              },
            }),
            L('en-u2-l3', {
              title: 'Describir personas',
              goal: 'Describir a alguien con adjetivos sencillos.',
              vocab: [
                ['friend', 'amigo / amiga', '🧑‍🤝‍🧑'],
                ['tall', 'alto', '🦒'],
                ['short', 'bajo', '🐭', { note: '"Short" también significa "corto".' }],
                ['young', 'joven', '👶'],
                ['old', 'viejo / mayor', '👴'],
                ['happy', 'contento / feliz', '😊'],
                ['tired', 'cansado', '😴'],
                ['nice', 'simpático / agradable', '😃'],
              ],
              tip: {
                title: 'El adjetivo va delante y no cambia',
                body:
                  'En inglés el adjetivo va ANTES del nombre: "a tall man" (un hombre alto).\n\nY nunca cambia: no tiene masculino, femenino ni plural.\n\na tall man → two tall men\na tall woman → two tall women',
                examples: [
                  { text: 'She is a nice friend.', es: 'Es una amiga simpática.' },
                  { text: 'They are tired.', es: 'Están cansados.' },
                ],
              },
              sentences: [
                ['My friend is very tall.', 'Mi amigo es muy alto.'],
                ["I'm tired today.", 'Hoy estoy cansado.'],
                ['She is a happy girl.', 'Es una niña feliz.'],
              ],
              dialog: {
                title: 'Hablando de un amigo',
                lines: [
                  ['A', 'Is your friend Tom nice?', '¿Tu amigo Tom es simpático?'],
                  ['B', 'Yes, he is very nice.', 'Sí, es muy simpático.'],
                  ['A', 'Is he tall?', '¿Es alto?'],
                  ['B', 'No, he is short and young.', 'No, es bajo y joven.'],
                ],
              },
            }),
          ],
        },
        {
          id: 'en-u3',
          title: 'Comida y bebida',
          emoji: '☕',
          lessons: [
            L('en-u3-l1', {
              title: 'En la cafetería',
              goal: 'Pedir algo de beber con educación y preguntar el precio.',
              vocab: [
                ['coffee', 'café', '☕'],
                ['tea', 'té', '🍵', { note: 'En Reino Unido el té se toma con leche: "tea with milk".' }],
                ['water', 'agua', '💧', { note: 'En inglés británico suena "uóta".' }],
                ['milk', 'leche', '🥛'],
                ['a cup of', 'una taza de', '🫖'],
                ["I'd like", 'me gustaría / quisiera', '🙋', { alt: ['I would like'] }],
                ['how much is it?', '¿cuánto cuesta?', '💷', { alt: ['how much is it'] }],
              ],
              tip: {
                title: 'Pedir con educación: "I\'d like…"',
                body:
                  '"I want" (quiero) suena brusco al pedir en un bar en Reino Unido. Lo natural es "I\'d like…" (quisiera…) o "Can I have…?" (¿me pones…?).\n\nY casi siempre se añade "please" al final.\n\nI\'d like a coffee, please.\nCan I have a tea, please?',
                examples: [
                  { text: "I'd like a cup of tea, please.", es: 'Quisiera una taza de té, por favor.' },
                  { text: 'How much is it?', es: '¿Cuánto es?' },
                ],
              },
              sentences: [
                ["I'd like a coffee, please.", 'Quisiera un café, por favor.'],
                ['A cup of tea with milk.', 'Una taza de té con leche.'],
                ['How much is it?', '¿Cuánto cuesta?'],
              ],
              dialog: {
                title: 'Pidiendo en una cafetería de Londres',
                lines: [
                  ['A', 'Hello! What would you like?', '¡Hola! ¿Qué le pongo?'],
                  ['B', "I'd like a tea with milk, please.", 'Quisiera un té con leche, por favor.'],
                  ['A', 'Of course. Anything else?', 'Claro. ¿Algo más?'],
                  ['B', 'No, thanks. How much is it?', 'No, gracias. ¿Cuánto es?'],
                ],
              },
            }),
            L('en-u3-l2', {
              title: 'Comida básica',
              goal: 'Nombrar alimentos básicos y usar "a" y "an".',
              vocab: [
                ['bread', 'pan', '🍞'],
                ['cheese', 'queso', '🧀'],
                ['an apple', 'una manzana', '🍎'],
                ['an egg', 'un huevo', '🥚'],
                ['chicken', 'pollo', '🍗'],
                ['fish', 'pescado / pez', '🐟'],
                ['breakfast', 'desayuno', '🍳', { note: 'Se pronuncia "brékfast".' }],
              ],
              tip: {
                title: '"a" o "an"',
                body:
                  'Los dos significan "un/una". Se elige por el SONIDO de la palabra siguiente:\n\n• "a" delante de sonido de consonante: a banana, a cup.\n• "an" delante de sonido de vocal: an apple, an egg, an orange.\n\nAsí se pronuncia más fácil: "an apple" suena "anápol".',
                examples: [
                  { text: 'I eat an egg for breakfast.', es: 'Me como un huevo para desayunar.' },
                  { text: 'A sandwich with cheese.', es: 'Un bocadillo con queso.' },
                ],
              },
              sentences: [
                ['I eat an apple every day.', 'Me como una manzana cada día.'],
                ['Bread and cheese, please.', 'Pan y queso, por favor.'],
                ['I like fish and chicken.', 'Me gustan el pescado y el pollo.'],
              ],
              dialog: {
                title: 'El desayuno',
                lines: [
                  ['A', 'What do you eat for breakfast?', '¿Qué desayunas?'],
                  ['B', 'Bread with cheese and an egg.', 'Pan con queso y un huevo.'],
                  ['A', 'And to drink?', '¿Y para beber?'],
                  ['B', 'A cup of coffee with milk.', 'Una taza de café con leche.'],
                ],
              },
            }),
            L('en-u3-l3', {
              title: 'En el restaurante',
              goal: 'Pedir mesa, la carta y la cuenta en un restaurante.',
              vocab: [
                ['table', 'mesa', '🍽️'],
                ['the menu', 'la carta / el menú', '📋'],
                ['the bill', 'la cuenta', '🧾', { note: 'En inglés británico es "bill". En Estados Unidos dicen "check".' }],
                ['hungry', 'con hambre', '😋', { note: '"I\'m hungry" = tengo hambre (literalmente "estoy hambriento").' }],
                ['thirsty', 'con sed', '🥤'],
                ['delicious', 'delicioso', '🤤'],
                ['can I have…?', '¿me puede traer…? / ¿me da…?', '🙏', { alt: ['can I have', 'can i have?'] }],
              ],
              tip: {
                title: 'Tener hambre = "estar" hambriento',
                body:
                  'Igual que con la edad, el hambre y la sed se dicen con "to be":\n\n✅ I\'m hungry. (Tengo hambre)\n✅ I\'m thirsty. (Tengo sed)\n❌ I have hunger.\n\nPara pedir algo, "Can I have…?" es la fórmula más útil: "Can I have the bill, please?"',
                examples: [
                  { text: 'Can I have the menu, please?', es: '¿Me trae la carta, por favor?' },
                  { text: "We're very hungry.", es: 'Tenemos mucha hambre.' },
                ],
              },
              sentences: [
                ['A table for two, please.', 'Una mesa para dos, por favor.'],
                ['Can I have the bill, please?', '¿Me trae la cuenta, por favor?'],
                ["I'm very hungry.", 'Tengo mucha hambre.'],
              ],
              dialog: {
                title: 'Cenando fuera',
                lines: [
                  ['A', 'Good evening. A table for two?', 'Buenas noches. ¿Mesa para dos?'],
                  ['B', 'Yes, please. Can I have the menu?', 'Sí, por favor. ¿Me trae la carta?'],
                  ['A', 'Here you are.', 'Aquí tiene.'],
                  ['B', 'Thank you. The fish looks delicious.', 'Gracias. El pescado tiene una pinta deliciosa.'],
                ],
              },
            }),
          ],
        },
        {
          id: 'en-u4',
          title: 'Mi día a día',
          emoji: '🏠',
          lessons: [
            L('en-u4-l1', {
              title: 'Verbos básicos',
              goal: 'Hablar de lo que haces normalmente con el presente simple.',
              vocab: [
                ['work', 'trabajar', '💼'],
                ['live', 'vivir', '🏡'],
                ['eat', 'comer', '🍴'],
                ['drink', 'beber', '🥤'],
                ['speak', 'hablar (un idioma)', '🗣️'],
                ['learn', 'aprender', '📚'],
                ['go', 'ir', '🚶'],
              ],
              tip: {
                title: 'Presente simple: la "s" de he/she',
                body:
                  'El presente en inglés es muy fácil: el verbo no cambia… excepto con he, she e it, que llevan una "-s".\n\nI work · you work · we work · they work\nhe works · she works\n\nEs uno de los errores más comunes de los hispanohablantes: "she work" ❌ → "she works" ✅.',
                examples: [
                  { text: 'I speak Spanish.', es: 'Hablo español.' },
                  { text: 'She learns Norwegian.', es: 'Ella aprende noruego.' },
                ],
              },
              sentences: [
                ['I work in an office.', 'Trabajo en una oficina.'],
                ['She speaks English.', 'Ella habla inglés.'],
                ['We learn every day.', 'Aprendemos cada día.'],
              ],
              dialog: {
                title: 'Hablando del trabajo',
                lines: [
                  ['A', 'Where do you work?', '¿Dónde trabajas?'],
                  ['B', 'I work in a hospital. And you?', 'Trabajo en un hospital. ¿Y tú?'],
                  ['A', 'I work at home.', 'Trabajo en casa.'],
                  ['B', 'Lucky you!', '¡Qué suerte!'],
                ],
              },
            }),
            L('en-u4-l2', {
              title: 'Los días de la semana',
              goal: 'Decir los días de la semana y hablar de hoy y mañana.',
              vocab: [
                ['Monday', 'lunes', '1️⃣'],
                ['Tuesday', 'martes', '2️⃣'],
                ['Wednesday', 'miércoles', '3️⃣', { note: 'Se pronuncia "uénsdei". La primera "d" no suena.' }],
                ['Thursday', 'jueves', '4️⃣'],
                ['Friday', 'viernes', '5️⃣'],
                ['Saturday', 'sábado', '6️⃣'],
                ['Sunday', 'domingo', '☀️'],
                ['today', 'hoy', '📅'],
                ['tomorrow', 'mañana (el día siguiente)', '⏭️'],
              ],
              tip: {
                title: 'Días con mayúscula y con "on"',
                body:
                  'Los días de la semana siempre se escriben con MAYÚSCULA en inglés: Monday, Friday.\n\nPara decir "el lunes" se usa "on": "on Monday".\nPara "los lunes" (siempre) se usa el plural: "on Mondays".',
                examples: [
                  { text: 'See you on Friday!', es: '¡Nos vemos el viernes!' },
                  { text: "I don't work on Sundays.", es: 'No trabajo los domingos.' },
                ],
              },
              sentences: [
                ['Today is Monday.', 'Hoy es lunes.'],
                ['See you tomorrow.', 'Hasta mañana.'],
                ['I go to the gym on Fridays.', 'Voy al gimnasio los viernes.'],
              ],
              dialog: {
                title: 'Quedando con un amigo',
                lines: [
                  ['A', 'Are you free on Saturday?', '¿Estás libre el sábado?'],
                  ['B', 'No, sorry. I work on Saturday.', 'No, lo siento. Trabajo el sábado.'],
                  ['A', 'What about Sunday?', '¿Y el domingo?'],
                  ['B', 'Sunday is perfect!', '¡El domingo es perfecto!'],
                ],
              },
            }),
            L('en-u4-l3', {
              title: 'En casa',
              goal: 'Describir tu casa con "there is" y "there are".',
              vocab: [
                ['house', 'casa', '🏠'],
                ['flat', 'piso / apartamento', '🏢', { alt: ['apartment'], note: 'En Reino Unido se dice "flat"; en Estados Unidos, "apartment".' }],
                ['kitchen', 'cocina', '🍳'],
                ['bedroom', 'dormitorio', '🛏️'],
                ['bathroom', 'baño', '🛁'],
                ['door', 'puerta', '🚪'],
                ['window', 'ventana', '🪟'],
              ],
              tip: {
                title: 'Hay = "there is" / "there are"',
                body:
                  '"Hay" en inglés tiene dos formas:\n\n• there is (there\'s) → con una cosa: "There is a kitchen."\n• there are → con varias cosas: "There are two bedrooms."\n\nPara preguntar se le da la vuelta: "Is there a bathroom?"',
                examples: [
                  { text: 'There are three bedrooms.', es: 'Hay tres dormitorios.' },
                  { text: 'Is there a window?', es: '¿Hay una ventana?' },
                ],
              },
              sentences: [
                ['I live in a small flat.', 'Vivo en un piso pequeño.'],
                ['There is a big kitchen.', 'Hay una cocina grande.'],
                ['There are two bedrooms.', 'Hay dos dormitorios.'],
              ],
              dialog: {
                title: 'Buscando piso',
                lines: [
                  ['A', 'How many bedrooms are there?', '¿Cuántos dormitorios hay?'],
                  ['B', 'There are two bedrooms.', 'Hay dos dormitorios.'],
                  ['A', 'Is there a bathroom?', '¿Hay un baño?'],
                  ['B', "Yes, and there's a big kitchen.", 'Sí, y hay una cocina grande.'],
                ],
              },
            }),
          ],
        },
      ],
    },
  ],
};
