// Curso de noruego (bokmål). Explicaciones en español.
import type { Course } from '../types';
import { lesson } from './build';

const L = (id: string, input: Parameters<typeof lesson>[2]) => lesson('no', id, input);

export const norwegian: Course = {
  lang: 'no',
  name: 'Noruego',
  flag: '🇳🇴',
  variant: 'Noruego bokmål',
  speechLang: 'nb-NO',
  extraLetters: ['æ', 'ø', 'å'],
  levels: [
    {
      id: 'A1',
      title: 'A1 · Principiante',
      description: 'Desde cero: saludar, presentarte, hablar de tu familia, pedir en un café y contar tu día.',
      units: [
        {
          id: 'no-u1',
          title: 'Saludos y presentaciones',
          emoji: '👋',
          lessons: [
            L('no-u1-l1', {
              title: 'Hola y adiós',
              goal: 'Saludar, despedirte y dar las gracias como un noruego.',
              vocab: [
                ['hei', 'hola', '👋', { note: 'Se pronuncia "jéi". Sirve para todo: amigos, jefes, desconocidos.' }],
                ['god morgen', 'buenos días', '🌅', { note: 'Se pronuncia "gu mórn". La d de "god" no suena.' }],
                ['god dag', 'buen día (formal)', '🌤️', { note: 'Muy formal. En el día a día los noruegos dicen "hei".' }],
                ['god kveld', 'buenas noches (al llegar)', '🌆', { note: 'Se pronuncia "gu kvel". La d final no suena.' }],
                ['ha det', 'adiós', '🚶', { alt: ['ha det bra'], note: 'Se pronuncia "já de". "Ha det bra" significa "que te vaya bien".' }],
                ['vi ses', 'nos vemos', '🔜'],
                ['takk', 'gracias', '🙏'],
                ['tusen takk', 'muchas gracias', '💐', { note: 'Literalmente "mil gracias".' }],
              ],
              tip: {
                title: 'La "d" que no suena y el "hei" para todo',
                body:
                  'En noruego muchas letras se escriben pero no se pronuncian. La "d" al final casi nunca suena: god → "gu", kveld → "kvel".\n\nNoruega es un país muy informal: a todo el mundo se le trata de tú y "hei" sirve para saludar a cualquiera, incluso a tu jefe.\n\n"Takk" se usa muchísimo: los noruegos dan las gracias por todo.',
                examples: [
                  { text: 'Hei, Ola!', es: '¡Hola, Ola! (Ola es un nombre noruego muy común)' },
                  { text: 'Ha det bra!', es: '¡Adiós, que te vaya bien!' },
                ],
              },
              sentences: [
                ['God morgen, Ola.', 'Buenos días, Ola.'],
                ['Tusen takk!', '¡Muchas gracias!'],
                ['Ha det bra, Kari!', '¡Adiós, Kari!'],
              ],
              dialog: {
                title: 'Saludando a una vecina',
                lines: [
                  ['A', 'Hei!', '¡Hola!'],
                  ['B', 'Hei! Hvordan har du det?', '¡Hola! ¿Cómo estás?'],
                  ['A', 'Bra, takk. Og du?', 'Bien, gracias. ¿Y tú?'],
                  ['B', 'Bare bra, takk!', '¡Muy bien, gracias!'],
                ],
              },
            }),
            L('no-u1-l2', {
              title: 'Me llamo…',
              goal: 'Decir tu nombre, preguntar el de otra persona y usar el verbo "være".',
              vocab: [
                ['navn', 'nombre', '🏷️', { note: 'Es neutro: "et navn".' }],
                ['jeg heter', 'me llamo', '🙋', { note: '"Jeg" se pronuncia "jái".' }],
                ['hva heter du?', '¿cómo te llamas?', '❓', { alt: ['hva heter du'], note: 'La h de "hva" no suena: "va".' }],
                ['hyggelig å møte deg', 'encantado de conocerte', '🤝', { note: 'Se pronuncia aproximadamente "jýgueli o meute dái".' }],
                ['jeg er', 'yo soy / yo estoy', '👤'],
                ['du er', 'tú eres / tú estás', '👉'],
                ['ja', 'sí', '✅'],
                ['nei', 'no', '❌', { note: 'Se pronuncia "nái".' }],
                ['unnskyld', 'perdón / disculpa', '😔', { note: 'Se pronuncia aproximadamente "únshil". La d no suena.' }],
              ],
              tip: {
                title: 'El verbo "være" (ser y estar)',
                body:
                  'Igual que en inglés, "ser" y "estar" son un solo verbo: "være".\n\nY la gran noticia: en noruego los verbos NO cambian según la persona.\n\njeg er (yo soy)\ndu er (tú eres)\nhan er (él es)\nhun er (ella es)\nvi er (nosotros somos)\n\nSiempre "er". Eso sí, como en inglés, hay que decir siempre el sujeto.',
                examples: [
                  { text: 'Jeg er Guille.', es: 'Soy Guille.' },
                  { text: 'Hun er trøtt.', es: 'Ella está cansada.' },
                ],
              },
              sentences: [
                ['Jeg heter Guille.', 'Me llamo Guille.'],
                ['Jeg er fra Barcelona.', 'Soy de Barcelona.'],
                ['Hyggelig å møte deg, Kari.', 'Encantado de conocerte, Kari.'],
              ],
              dialog: {
                title: 'Conociendo a alguien',
                lines: [
                  ['A', 'Hei! Hva heter du?', '¡Hola! ¿Cómo te llamas?'],
                  ['B', 'Jeg heter Kari. Og du?', 'Me llamo Kari. ¿Y tú?'],
                  ['A', 'Jeg heter Guille.', 'Me llamo Guille.'],
                  ['B', 'Hyggelig å møte deg, Guille.', 'Encantada de conocerte, Guille.'],
                ],
              },
            }),
            L('no-u1-l3', {
              title: '¿De dónde eres?',
              goal: 'Decir de dónde eres, dónde vives y tu nacionalidad.',
              vocab: [
                ['Spania', 'España', '🇪🇸'],
                ['Norge', 'Noruega', '🇳🇴', { note: 'Se pronuncia "nórgue".' }],
                ['England', 'Inglaterra', '🏴'],
                ['spansk', 'español (idioma o adjetivo)', '🗣️', { note: 'En noruego, como en español, idiomas y nacionalidades van en minúscula.' }],
                ['norsk', 'noruego (idioma o adjetivo)', '🎿'],
                ['hvor', 'dónde', '📍', { note: 'La h no suena: "vur".' }],
                ['fra', 'de (origen)', '🧭'],
                ['jeg bor i', 'vivo en', '🏡', { example: 'Jeg bor i Oslo.', exampleEs: 'Vivo en Oslo.' }],
              ],
              tip: {
                title: 'Preguntar el origen',
                body:
                  'Para preguntar de dónde es alguien se usa el verbo "komme" (venir):\n\n"Hvor kommer du fra?" (¿De dónde vienes?)\n"Jeg kommer fra Spania." (Vengo de España)\n\nFíjate en que "fra" va al FINAL de la pregunta, como en inglés.\n\nLos países van con mayúscula (Spania, Norge), pero los idiomas y nacionalidades en minúscula: spansk, norsk.',
                examples: [
                  { text: 'Jeg snakker spansk og litt norsk.', es: 'Hablo español y un poco de noruego.' },
                  { text: 'Hvor bor du?', es: '¿Dónde vives?' },
                ],
              },
              sentences: [
                ['Hvor kommer du fra?', '¿De dónde eres?'],
                ['Jeg kommer fra Spania.', 'Soy de España.'],
                ['Jeg bor i Oslo.', 'Vivo en Oslo.'],
              ],
              dialog: {
                title: 'En una fiesta',
                lines: [
                  ['A', 'Hvor kommer du fra?', '¿De dónde eres?'],
                  ['B', 'Jeg kommer fra Spania. Og du?', 'Soy de España. ¿Y tú?'],
                  ['A', 'Jeg er norsk. Jeg bor i Bergen.', 'Soy noruego. Vivo en Bergen.'],
                  ['B', 'Så fint! Jeg elsker Norge.', '¡Qué bien! Me encanta Noruega.'],
                ],
              },
            }),
          ],
        },
        {
          id: 'no-u2',
          title: 'Personas y familia',
          emoji: '👨‍👩‍👧',
          lessons: [
            L('no-u2-l1', {
              title: 'Mi familia',
              goal: 'Hablar de tu familia y colocar bien el posesivo.',
              vocab: [
                ['familie', 'familia', '👨‍👩‍👧', { note: 'Es masculino: "en familie".' }],
                ['mor', 'madre', '👩', { alt: ['mamma'], note: '"Mamma" es la forma cariñosa.' }],
                ['far', 'padre', '👨', { alt: ['pappa'] }],
                ['bror', 'hermano', '👦'],
                ['søster', 'hermana', '👧', { note: 'La ø suena como la "eu" francesa: "séuster".' }],
                ['sønn', 'hijo', '🧒'],
                ['datter', 'hija', '👧'],
                ['foreldre', 'padres (madre y padre)', '👫'],
              ],
              tip: {
                title: 'El posesivo va DETRÁS al hablar',
                body:
                  'En noruego "mi hermano" se puede decir de dos formas:\n\n• min bror (más formal o para dar énfasis)\n• broren min (lo más natural al hablar)\n\nEn la segunda, el nombre lleva el artículo pegado al final (bror → broren) y el posesivo va detrás.\n\nmin/din = mi/tu · hans = su (de él) · hennes = su (de ella)\nCon plurales: foreldrene mine (mis padres).',
                examples: [
                  { text: 'Dette er faren min.', es: 'Este es mi padre.' },
                  { text: 'Søsteren hennes bor i Oslo.', es: 'Su hermana (de ella) vive en Oslo.' },
                ],
              },
              sentences: [
                ['Dette er søsteren min.', 'Esta es mi hermana.'],
                ['Foreldrene mine bor i Spania.', 'Mis padres viven en España.'],
                ['Broren hans er høy.', 'Su hermano (de él) es alto.'],
              ],
              dialog: {
                title: 'Mirando fotos',
                lines: [
                  ['A', 'Hvem er dette?', '¿Quién es este?'],
                  ['B', 'Dette er broren min. Han er tjue år.', 'Este es mi hermano. Tiene veinte años.'],
                  ['A', 'Og hvem er hun?', '¿Y quién es ella?'],
                  ['B', 'Hun er moren min.', 'Es mi madre.'],
                ],
              },
            }),
            L('no-u2-l2', {
              title: 'Números y edad',
              goal: 'Contar del 1 al 10 y decir tu edad.',
              vocab: [
                ['en', 'uno', '1️⃣', { alt: ['én', 'ett'] }],
                ['to', 'dos', '2️⃣', { note: 'Se pronuncia "tu".' }],
                ['tre', 'tres', '3️⃣'],
                ['fire', 'cuatro', '4️⃣', { note: 'Se pronuncia "fíre".' }],
                ['fem', 'cinco', '5️⃣'],
                ['seks', 'seis', '6️⃣'],
                ['sju', 'siete', '7️⃣', { alt: ['syv'], note: 'Se pronuncia "shu". También existe la forma "syv".' }],
                ['åtte', 'ocho', '8️⃣', { note: 'La å suena como una "o": "ótte".' }],
                ['ni', 'nueve', '9️⃣'],
                ['ti', 'diez', '🔟'],
              ],
              tip: {
                title: 'La edad se dice con "være"',
                body:
                  'Como en inglés, en noruego "eres" años: se usa el verbo være.\n\n✅ Jeg er tretti år.\n❌ Jeg har tretti år.\n\nPara preguntar: "Hvor gammel er du?" (literalmente "¿cómo de viejo eres?").',
                examples: [
                  { text: 'Hvor gammel er du?', es: '¿Cuántos años tienes?' },
                  { text: 'Jeg er ti år.', es: 'Tengo diez años.' },
                ],
              },
              sentences: [
                ['Hvor gammel er du?', '¿Cuántos años tienes?'],
                ['Jeg har to søstre.', 'Tengo dos hermanas.'],
                ['Sønnen min er fem år.', 'Mi hijo tiene cinco años.'],
              ],
              dialog: {
                title: 'En el parque',
                lines: [
                  ['A', 'Hvor gammel er datteren din?', '¿Cuántos años tiene tu hija?'],
                  ['B', 'Hun er sju. Og sønnen din?', 'Tiene siete. ¿Y tu hijo?'],
                  ['A', 'Han er ni.', 'Tiene nueve.'],
                  ['B', 'De er nesten like gamle!', '¡Tienen casi la misma edad!'],
                ],
              },
            }),
            L('no-u2-l3', {
              title: 'Describir personas',
              goal: 'Describir a alguien con adjetivos sencillos.',
              vocab: [
                ['venn', 'amigo', '🧑‍🤝‍🧑', { note: '"En venn" es un amigo; "ei venninne", una amiga.' }],
                ['høy', 'alto', '🦒'],
                ['lav', 'bajo', '🐭'],
                ['ung', 'joven', '👶'],
                ['gammel', 'viejo / mayor', '👴'],
                ['glad', 'contento / feliz', '😊', { note: '¡Ojo! "Glad" no significa "glad" en inglés: significa "contento".' }],
                ['trøtt', 'cansado', '😴', { alt: ['trett'] }],
                ['hyggelig', 'simpático / agradable', '😃'],
              ],
              tip: {
                title: 'El adjetivo va delante y cambia un poco',
                body:
                  'Como en inglés, el adjetivo va ANTES del nombre: "en høy mann" (un hombre alto).\n\nPero, como en español, cambia un poco:\n• con palabras "et" (neutras) añade -t: et høyt hus (una casa alta)\n• en plural añade -e: høye menn (hombres altos)\n\nDe momento basta con reconocerlo; lo practicaremos más adelante.',
                examples: [
                  { text: 'Hun er en hyggelig venn.', es: 'Es una amiga simpática.' },
                  { text: 'De er trøtte.', es: 'Están cansados.' },
                ],
              },
              sentences: [
                ['Vennen min er veldig høy.', 'Mi amigo es muy alto.'],
                ['Jeg er trøtt i dag.', 'Hoy estoy cansado.'],
                ['Hun er en glad jente.', 'Es una niña feliz.'],
              ],
              dialog: {
                title: 'Hablando de un amigo',
                lines: [
                  ['A', 'Er vennen din Ola hyggelig?', '¿Tu amigo Ola es simpático?'],
                  ['B', 'Ja, han er veldig hyggelig.', 'Sí, es muy simpático.'],
                  ['A', 'Er han høy?', '¿Es alto?'],
                  ['B', 'Nei, han er lav og ung.', 'No, es bajo y joven.'],
                ],
              },
            }),
          ],
        },
        {
          id: 'no-u3',
          title: 'Comida y bebida',
          emoji: '☕',
          lessons: [
            L('no-u3-l1', {
              title: 'En la cafetería',
              goal: 'Pedir algo de beber y preguntar el precio.',
              vocab: [
                ['kaffe', 'café', '☕', { note: 'Noruega es uno de los países que más café bebe del mundo.' }],
                ['te', 'té', '🍵'],
                ['vann', 'agua', '💧'],
                ['melk', 'leche', '🥛'],
                ['en kopp', 'una taza', '🫖', { note: '"Una taza de café" es "en kopp kaffe", sin "de".' }],
                ['jeg vil gjerne ha', 'quisiera / me gustaría', '🙋', { note: '"Gjerne" se pronuncia "yérne".' }],
                ['hva koster det?', '¿cuánto cuesta?', '💰', { alt: ['hva koster det'], note: 'La h de "hva" no suena.' }],
              ],
              tip: {
                title: 'En noruego "por favor" se dice… "takk"',
                body:
                  'El noruego casi no usa una palabra para "por favor". Lo educado es pedir con "Jeg vil gjerne ha…" (quisiera…) o "Kan jeg få…?" (¿me da…?) y añadir "takk" al final:\n\n"En kaffe, takk." (Un café, por favor)\n\nY sin preposición: "en kopp te" = una taza de té.',
                examples: [
                  { text: 'Jeg vil gjerne ha en kopp te.', es: 'Quisiera una taza de té.' },
                  { text: 'Kan jeg få et glass vann?', es: '¿Me da un vaso de agua?' },
                ],
              },
              sentences: [
                ['Jeg vil gjerne ha en kaffe.', 'Quisiera un café.'],
                ['En kopp te med melk, takk.', 'Una taza de té con leche, por favor.'],
                ['Hva koster det?', '¿Cuánto cuesta?'],
              ],
              dialog: {
                title: 'Pidiendo en un café de Oslo',
                lines: [
                  ['A', 'Hei! Hva vil du ha?', '¡Hola! ¿Qué quieres tomar?'],
                  ['B', 'Jeg vil gjerne ha en te med melk.', 'Quisiera un té con leche.'],
                  ['A', 'Ja. Noe mer?', 'Vale. ¿Algo más?'],
                  ['B', 'Nei takk. Hva koster det?', 'No, gracias. ¿Cuánto es?'],
                ],
              },
            }),
            L('no-u3-l2', {
              title: 'Comida básica',
              goal: 'Nombrar alimentos básicos y aprender los géneros "en" y "et".',
              vocab: [
                ['et brød', 'un pan', '🍞', { alt: ['brød'] }],
                ['en ost', 'un queso', '🧀', { alt: ['ost'], note: 'El queso marrón "brunost" es típico de Noruega.' }],
                ['et eple', 'una manzana', '🍎', { alt: ['eple'] }],
                ['et egg', 'un huevo', '🥚', { alt: ['egg'] }],
                ['kylling', 'pollo', '🍗', { note: '"ky" suena parecido a "ji" muy suave: "jýling".' }],
                ['fisk', 'pescado / pez', '🐟'],
                ['frokost', 'desayuno', '🍳'],
              ],
              tip: {
                title: 'Los géneros: "en" y "et"',
                body:
                  'En noruego cada nombre tiene género, y el artículo "un/una" cambia:\n\n• en → masculino (y la mayoría de femeninos): en ost, en kopp\n• et → neutro: et eple, et brød, et egg\n\nNo se puede adivinar siempre, así que el truco es aprender cada palabra JUNTO con su artículo: no "eple", sino "et eple".',
                examples: [
                  { text: 'Jeg spiser et egg.', es: 'Me como un huevo.' },
                  { text: 'Hun kjøper en ost.', es: 'Ella compra un queso.' },
                ],
              },
              sentences: [
                ['Jeg spiser et eple hver dag.', 'Me como una manzana cada día.'],
                ['Brød og ost, takk.', 'Pan y queso, por favor.'],
                ['Jeg liker fisk og kylling.', 'Me gustan el pescado y el pollo.'],
              ],
              dialog: {
                title: 'El desayuno',
                lines: [
                  ['A', 'Hva spiser du til frokost?', '¿Qué desayunas?'],
                  ['B', 'Brød med ost og et egg.', 'Pan con queso y un huevo.'],
                  ['A', 'Og å drikke?', '¿Y para beber?'],
                  ['B', 'En kopp kaffe med melk.', 'Una taza de café con leche.'],
                ],
              },
            }),
            L('no-u3-l3', {
              title: 'En el restaurante',
              goal: 'Pedir mesa, la carta y la cuenta, y entender el artículo al final.',
              vocab: [
                ['et bord', 'una mesa', '🍽️', { alt: ['bord'] }],
                ['menyen', 'la carta / el menú', '📋'],
                ['regningen', 'la cuenta', '🧾', { note: 'Se pronuncia aproximadamente "ráiningen".' }],
                ['sulten', 'con hambre', '😋', { note: '"Jeg er sulten" = tengo hambre.' }],
                ['tørst', 'con sed', '🥤'],
                ['nydelig', 'delicioso / precioso', '🤤'],
                ['kan jeg få…?', '¿me da…? / ¿me puede traer…?', '🙏', { alt: ['kan jeg få'] }],
              ],
              tip: {
                title: 'El artículo "el/la" va pegado al final',
                body:
                  'En noruego "el/la" no va delante: se pega al FINAL del nombre.\n\nen meny (un menú) → menyen (el menú)\nen regning (una cuenta) → regningen (la cuenta)\net bord (una mesa) → bordet (la mesa)\n\nPara pedir: "Kan jeg få regningen?" (¿Me trae la cuenta?).\nY cuando te dan algo, oirás "Vær så god" (aquí tiene).',
                examples: [
                  { text: 'Kan jeg få menyen?', es: '¿Me trae la carta?' },
                  { text: 'Bordet er ledig.', es: 'La mesa está libre.' },
                ],
              },
              sentences: [
                ['Et bord til to, takk.', 'Una mesa para dos, por favor.'],
                ['Kan jeg få regningen?', '¿Me trae la cuenta?'],
                ['Jeg er veldig sulten.', 'Tengo mucha hambre.'],
              ],
              dialog: {
                title: 'Cenando fuera',
                lines: [
                  ['A', 'God kveld. Et bord til to?', 'Buenas noches. ¿Mesa para dos?'],
                  ['B', 'Ja, takk. Kan jeg få menyen?', 'Sí, gracias. ¿Me trae la carta?'],
                  ['A', 'Vær så god.', 'Aquí tiene.'],
                  ['B', 'Takk. Fisken ser nydelig ut.', 'Gracias. El pescado tiene una pinta deliciosa.'],
                ],
              },
            }),
          ],
        },
        {
          id: 'no-u4',
          title: 'Mi día a día',
          emoji: '🏠',
          lessons: [
            L('no-u4-l1', {
              title: 'Verbos básicos',
              goal: 'Hablar de lo que haces en presente (¡es facilísimo!).',
              vocab: [
                ['jobbe', 'trabajar', '💼', { note: 'Presente: jeg jobber (trabajo).' }],
                ['bo', 'vivir', '🏡', { note: 'Presente: jeg bor (vivo).' }],
                ['spise', 'comer', '🍴', { note: 'Presente: jeg spiser (como).' }],
                ['drikke', 'beber', '🥤', { note: 'Presente: jeg drikker (bebo).' }],
                ['snakke', 'hablar', '🗣️', { note: 'Presente: jeg snakker (hablo).' }],
                ['lære', 'aprender', '📚', { note: 'Presente: jeg lærer (aprendo).' }],
                ['gå', 'ir andando / caminar', '🚶', { note: 'Presente: jeg går (voy).' }],
              ],
              tip: {
                title: 'Presente = infinitivo + r',
                body:
                  'El presente en noruego es de lo más fácil que existe: se añade "-r" al infinitivo y es IGUAL para todas las personas.\n\njobbe → jeg jobber, du jobber, hun jobber, vi jobber\nbo → jeg bor, du bor, de bor\n\nNada de conjugar como en español. Hay pocas excepciones (como "er" de være).',
                examples: [
                  { text: 'Jeg snakker spansk.', es: 'Hablo español.' },
                  { text: 'Hun lærer engelsk.', es: 'Ella aprende inglés.' },
                ],
              },
              sentences: [
                ['Jeg jobber på et kontor.', 'Trabajo en una oficina.'],
                ['Hun snakker norsk.', 'Ella habla noruego.'],
                ['Vi lærer hver dag.', 'Aprendemos cada día.'],
              ],
              dialog: {
                title: 'Hablando del trabajo',
                lines: [
                  ['A', 'Hvor jobber du?', '¿Dónde trabajas?'],
                  ['B', 'Jeg jobber på et sykehus. Og du?', 'Trabajo en un hospital. ¿Y tú?'],
                  ['A', 'Jeg jobber hjemme.', 'Trabajo en casa.'],
                  ['B', 'Så heldig du er!', '¡Qué suerte tienes!'],
                ],
              },
            }),
            L('no-u4-l2', {
              title: 'Los días de la semana',
              goal: 'Decir los días y aprender la regla del verbo en segunda posición.',
              vocab: [
                ['mandag', 'lunes', '1️⃣'],
                ['tirsdag', 'martes', '2️⃣'],
                ['onsdag', 'miércoles', '3️⃣'],
                ['torsdag', 'jueves', '4️⃣', { note: 'Viene de Tor (Thor), el dios del trueno.' }],
                ['fredag', 'viernes', '5️⃣'],
                ['lørdag', 'sábado', '6️⃣'],
                ['søndag', 'domingo', '☀️'],
                ['i dag', 'hoy', '📅', { alt: ['idag'] }],
                ['i morgen', 'mañana (el día siguiente)', '⏭️', { alt: ['imorgen'], note: '¡Ojo! "morgen" es "mañana (por la mañana)", pero "i morgen" es "mañana (el día siguiente)".' }],
              ],
              tip: {
                title: 'El verbo siempre en 2ª posición',
                body:
                  'Los días van en minúscula, como en español: mandag, fredag. "El lunes" = "på mandag".\n\nY una regla muy importante del noruego: el verbo va SIEMPRE en segunda posición. Si la frase empieza por otra cosa (como "i dag"), el sujeto pasa detrás del verbo:\n\nJeg jobber i dag. (Trabajo hoy)\nI dag jobber jeg. (Hoy trabajo) ← ¡no "i dag jeg jobber"!',
                examples: [
                  { text: 'På lørdag spiser vi fisk.', es: 'El sábado comemos pescado.' },
                  { text: 'I morgen er det fredag.', es: 'Mañana es viernes.' },
                ],
              },
              sentences: [
                ['I dag er det mandag.', 'Hoy es lunes.'],
                ['Vi ses i morgen.', 'Nos vemos mañana.'],
                ['På fredag går jeg på trening.', 'El viernes voy a entrenar.'],
              ],
              dialog: {
                title: 'Quedando con un amigo',
                lines: [
                  ['A', 'Er du ledig på lørdag?', '¿Estás libre el sábado?'],
                  ['B', 'Nei, beklager. Jeg jobber på lørdag.', 'No, lo siento. Trabajo el sábado.'],
                  ['A', 'Hva med søndag?', '¿Y el domingo?'],
                  ['B', 'Søndag passer perfekt!', '¡El domingo me va perfecto!'],
                ],
              },
            }),
            L('no-u4-l3', {
              title: 'En casa',
              goal: 'Describir tu casa con "det er" (hay).',
              vocab: [
                ['et hus', 'una casa', '🏠', { alt: ['hus'] }],
                ['en leilighet', 'un piso / apartamento', '🏢', { alt: ['leilighet'] }],
                ['et kjøkken', 'una cocina', '🍳', { alt: ['kjøkken'], note: '"kj" suena como una "j" muy suave, casi un soplido: "jékken".' }],
                ['et soverom', 'un dormitorio', '🛏️', { alt: ['soverom'], note: 'Literalmente "habitación para dormir".' }],
                ['et bad', 'un baño', '🛁', { alt: ['bad'] }],
                ['en dør', 'una puerta', '🚪', { alt: ['dør'] }],
                ['et vindu', 'una ventana', '🪟', { alt: ['vindu'] }],
              ],
              tip: {
                title: 'Hay = "det er"',
                body:
                  '"Hay" en noruego se dice "det er", tanto en singular como en plural:\n\nDet er et kjøkken. (Hay una cocina)\nDet er to soverom. (Hay dos dormitorios)\n\nPara preguntar, se invierte: "Er det et bad?" (¿Hay un baño?)',
                examples: [
                  { text: 'Det er tre soverom i huset.', es: 'Hay tres dormitorios en la casa.' },
                  { text: 'Er det et vindu?', es: '¿Hay una ventana?' },
                ],
              },
              sentences: [
                ['Jeg bor i en liten leilighet.', 'Vivo en un piso pequeño.'],
                ['Det er et stort kjøkken.', 'Hay una cocina grande.'],
                ['Det er to soverom.', 'Hay dos dormitorios.'],
              ],
              dialog: {
                title: 'Buscando piso',
                lines: [
                  ['A', 'Hvor mange soverom er det?', '¿Cuántos dormitorios hay?'],
                  ['B', 'Det er to soverom.', 'Hay dos dormitorios.'],
                  ['A', 'Er det et bad?', '¿Hay un baño?'],
                  ['B', 'Ja, og det er et stort kjøkken.', 'Sí, y hay una cocina grande.'],
                ],
              },
            }),
          ],
        },
      ],
    },
  ],
};
