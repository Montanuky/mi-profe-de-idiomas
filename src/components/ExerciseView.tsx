// Muestra un ejercicio, comprueba la respuesta y explica el error en español.
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { courses } from '../content';
import { checkWritten, normalize } from '../lib/answer';
import type { Exercise } from '../lib/exercises';
import { shuffle } from '../lib/exercises';
import { speak } from '../lib/speech';
import { useStore } from '../state/store';
import { useColors } from '../theme';
import type { LangCode } from '../types';
import { Button, SpeakButton, T } from './ui';

interface Props {
  ex: Exercise;
  lang: LangCode;
  onDone: (correct: boolean, given: string) => void;
}

export function ExerciseView({ ex, lang, onDone }: Props) {
  const c = useColors();
  const { data } = useStore();
  const slow = data.profile?.slowAudio ?? false;
  const speechLang = courses[lang].speechLang;
  const [result, setResult] = useState<{ correct: boolean; given: string; warning?: string } | null>(null);

  // Texto en el idioma que se aprende (para reproducirlo tras responder)
  const targetText = ex.kind === 'choose' || ex.kind === 'listen' || ex.kind === 'listenSentence' ? ex.speak : ex.kind === 'match' ? undefined : ex.answer;

  useEffect(() => {
    if (ex.kind === 'listen' || ex.kind === 'listenSentence') {
      const t = setTimeout(() => speak(ex.speak!, speechLang, slow), 350);
      return () => clearTimeout(t);
    }
  }, [ex.key]);

  const submit = (correct: boolean, given: string, warning?: string) => {
    if (result) return;
    setResult({ correct, given, warning });
    if (targetText) speak(targetText, speechLang, slow);
  };

  return (
    <View style={{ flex: 1, gap: 18 }}>
      <View style={{ gap: 6 }}>
        {ex.graded ? (
          <Text style={{ color: c.warning, fontWeight: '800', fontSize: 12, letterSpacing: 1 }}>EVALUACIÓN</Text>
        ) : null}
        <T size={20} weight="800">
          {ex.instruction}
        </T>
      </View>

      <Prompt ex={ex} lang={lang} />

      <View style={{ flex: 1 }}>
        {ex.kind === 'write' ? (
          <WriteInput ex={ex} lang={lang} disabled={!!result} onSubmit={submit} />
        ) : ex.kind === 'build' ? (
          <BuildSentence ex={ex} disabled={!!result} onSubmit={submit} />
        ) : ex.kind === 'match' ? (
          <MatchPairs ex={ex} onSubmit={submit} />
        ) : (
          <Options ex={ex} result={result} onSubmit={submit} />
        )}
      </View>

      {result ? (
        <View
          style={{
            backgroundColor: result.correct ? c.successSoft : c.dangerSoft,
            borderRadius: 20,
            padding: 16,
            gap: 8,
          }}
        >
          <T size={18} weight="800" style={{ color: result.correct ? c.success : c.danger }}>
            {result.correct ? '¡Correcto! 🎉' : 'No es correcto'}
          </T>
          {result.warning ? <T size={15}>{result.warning}</T> : null}
          {!result.correct && ex.kind !== 'match' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <T size={13} muted>
                  Respuesta correcta
                </T>
                <T size={17} weight="700">
                  {ex.answer}
                </T>
              </View>
              {targetText ? <SpeakButton text={targetText} lang={lang} size={40} /> : null}
            </View>
          ) : null}
          {!result.correct || ex.kind === 'match' ? <T size={15}>💡 {ex.explanation}</T> : null}
          <Button title="Continuar" color={result.correct ? c.success : c.danger} onPress={() => onDone(result.correct, result.given)} />
        </View>
      ) : null}
    </View>
  );
}

function Prompt({ ex, lang }: { ex: Exercise; lang: LangCode }) {
  const c = useColors();
  if (ex.kind === 'listen' || ex.kind === 'listenSentence')
    return (
      <View style={{ alignItems: 'center', paddingVertical: 10 }}>
        <SpeakButton text={ex.speak!} lang={lang} size={84} slowToggle />
        <T muted size={13} style={{ marginTop: 8 }}>
          Toca para escuchar otra vez · 🐢 más despacio
        </T>
      </View>
    );
  if (ex.kind === 'dialog')
    return (
      <View style={{ gap: 8 }}>
        {ex.context?.map((l, i) => (
          <View key={i} style={{ alignSelf: l.speaker === 'A' ? 'flex-start' : 'flex-end', maxWidth: '85%', backgroundColor: l.speaker === 'A' ? c.cardAlt : c.primarySoft, borderRadius: 16, padding: 12 }}>
            <T weight="600">{l.text}</T>
            <T size={13} muted>
              {l.es}
            </T>
          </View>
        ))}
        <View style={{ alignSelf: (ex.context?.length ?? 0) % 2 === 0 ? 'flex-start' : 'flex-end', borderRadius: 16, padding: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: c.border }}>
          <T muted>…</T>
        </View>
      </View>
    );
  if (ex.kind === 'match') return null;
  return (
    <View style={{ backgroundColor: c.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: c.border, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      {ex.emoji ? <Text style={{ fontSize: 40 }}>{ex.emoji}</Text> : null}
      <View style={{ flex: 1 }}>
        <T size={22} weight="700">
          {ex.prompt}
        </T>
      </View>
      {ex.kind === 'choose' && ex.speak ? <SpeakButton text={ex.speak} lang={lang} /> : null}
    </View>
  );
}

function Options({ ex, result, onSubmit }: { ex: Exercise; result: { given: string } | null; onSubmit: (ok: boolean, given: string) => void }) {
  const c = useColors();
  return (
    <View style={{ gap: 10 }}>
      {ex.options!.map((o) => {
        const isAnswer = o === ex.answer;
        const isGiven = result?.given === o;
        const bg = result && isAnswer ? c.successSoft : result && isGiven ? c.dangerSoft : c.card;
        const border = result && isAnswer ? c.success : result && isGiven ? c.danger : c.border;
        return (
          <Pressable
            key={o}
            disabled={!!result}
            onPress={() => onSubmit(isAnswer, o)}
            style={({ pressed }) => ({ backgroundColor: bg, borderColor: border, borderWidth: 2, borderRadius: 16, padding: 16, opacity: pressed ? 0.8 : 1 })}
          >
            <T size={17} weight="600">
              {o}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

function WriteInput({ ex, lang, disabled, onSubmit }: { ex: Exercise; lang: LangCode; disabled: boolean; onSubmit: (ok: boolean, given: string, warning?: string) => void }) {
  const c = useColors();
  const [text, setText] = useState('');
  const letters = courses[lang].extraLetters;
  const check = () => {
    const r = checkWritten(text, ex.answer, ex.alts);
    onSubmit(r.correct, text.trim(), r.warning);
  };
  return (
    <View style={{ gap: 12 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        placeholder="Escribe aquí…"
        placeholderTextColor={c.textMuted}
        onSubmitEditing={() => text.trim() && check()}
        style={{ backgroundColor: c.card, color: c.text, borderColor: c.border, borderWidth: 2, borderRadius: 16, padding: 16, fontSize: 19 }}
      />
      {letters.length ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {letters.map((l) => (
            <Pressable key={l} disabled={disabled} onPress={() => setText((t) => t + l)} style={{ backgroundColor: c.cardAlt, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18 }}>
              <T size={20} weight="700">
                {l}
              </T>
            </Pressable>
          ))}
        </View>
      ) : null}
      {!disabled ? (
        <View style={{ gap: 8 }}>
          <Button title="Comprobar" onPress={check} disabled={!text.trim()} />
          <Button title="No lo sé" variant="ghost" onPress={() => onSubmit(false, '')} />
        </View>
      ) : null}
    </View>
  );
}

function BuildSentence({ ex, disabled, onSubmit }: { ex: Exercise; disabled: boolean; onSubmit: (ok: boolean, given: string) => void }) {
  const c = useColors();
  const tokens = useMemo(() => ex.tokens!.map((t, i) => ({ t, i })), [ex.key]);
  const [chosen, setChosen] = useState<number[]>([]);
  const sentence = chosen.map((i) => tokens[i].t).join(' ');
  const tokenStyle = { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 2 };
  return (
    <View style={{ gap: 14 }}>
      <View style={{ minHeight: 64, borderBottomWidth: 2, borderColor: c.border, flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 10 }}>
        {chosen.map((i) => (
          <Pressable key={i} disabled={disabled} onPress={() => setChosen((ch) => ch.filter((x) => x !== i))} style={[tokenStyle, { backgroundColor: c.primarySoft, borderColor: c.primary }]}>
            <T size={17} weight="600">
              {tokens[i].t}
            </T>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tokens.map(({ t, i }) => {
          const used = chosen.includes(i);
          return (
            <Pressable key={i} disabled={disabled || used} onPress={() => setChosen((ch) => [...ch, i])} style={[tokenStyle, { backgroundColor: used ? c.cardAlt : c.card, borderColor: c.border, opacity: used ? 0.35 : 1 }]}>
              <T size={17} weight="600">
                {t}
              </T>
            </Pressable>
          );
        })}
      </View>
      {!disabled ? (
        <Button title="Comprobar" disabled={!chosen.length} onPress={() => onSubmit(normalize(sentence) === normalize(ex.answer), sentence)} />
      ) : null}
    </View>
  );
}

function MatchPairs({ ex, onSubmit }: { ex: Exercise; onSubmit: (ok: boolean, given: string) => void }) {
  const c = useColors();
  const pairs = ex.pairs!;
  const left = useMemo(() => shuffle(pairs), [ex.key]);
  const right = useMemo(() => {
    // Evita que las dos columnas salgan en el mismo orden
    let r = shuffle(pairs);
    for (let i = 0; i < 5 && r.every((p, k) => p.id === left[k].id); i++) r = shuffle(pairs);
    return r;
  }, [ex.key]);
  const [selL, setSelL] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);

  const tapRight = (id: string) => {
    if (!selL) return;
    if (id === selL) {
      const nd = [...done, id];
      setDone(nd);
      setSelL(null);
      if (nd.length === pairs.length) onSubmit(errors === 0, errors === 0 ? 'sin fallos' : `${errors} fallo(s)`);
    } else {
      setErrors((e) => e + 1);
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const cell = (label: string, id: string, side: 'l' | 'r') => {
    const isDone = done.includes(id);
    const isSel = side === 'l' && selL === id;
    const isWrong = side === 'r' && wrong === id;
    return (
      <Pressable
        key={side + id}
        disabled={isDone}
        onPress={() => (side === 'l' ? setSelL(id) : tapRight(id))}
        style={{
          borderRadius: 14,
          borderWidth: 2,
          padding: 14,
          minHeight: 58,
          justifyContent: 'center',
          borderColor: isDone ? c.success : isSel ? c.primary : isWrong ? c.danger : c.border,
          backgroundColor: isDone ? c.successSoft : isSel ? c.primarySoft : isWrong ? c.dangerSoft : c.card,
          opacity: isDone ? 0.6 : 1,
        }}
      >
        <T size={15} weight="600" center>
          {label}
        </T>
      </Pressable>
    );
  };

  return (
    <View style={{ gap: 10 }}>
      <T muted size={14}>
        Toca una palabra de la izquierda y después su traducción.
      </T>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, gap: 10 }}>{left.map((p) => cell(p.left, p.id, 'l'))}</View>
        <View style={{ flex: 1, gap: 10 }}>{right.map((p) => cell(p.right, p.id, 'r'))}</View>
      </View>
    </View>
  );
}
