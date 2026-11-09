// Mapa del curso: niveles, unidades, lecciones y exámenes.
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LangSwitcher } from '../../components/LangSwitcher';
import { Button, Card, H1, T, Screen } from '../../components/ui';
import { courses, isExamUnlocked, isLessonUnlocked } from '../../content';
import { useStore } from '../../state/store';
import { langColor, useColors } from '../../theme';

export default function CourseScreen() {
  const c = useColors();
  const { data } = useStore();
  const lang = data.activeLang;
  const course = courses[lang];
  const p = data.langs[lang];
  const col = langColor(c, lang);

  return (
    <Screen>
      <H1>Curso</H1>
      <LangSwitcher />
      {!p.placementDone ? (
        <Card>
          <T weight="700">¿Ya sabes algo de {course.name.toLowerCase()}?</T>
          <T muted size={14}>
            Con la prueba de nivel saltarás las unidades que ya dominas.
          </T>
          <Button title="Hacer la prueba de nivel" variant="secondary" onPress={() => router.push('/placement')} />
        </Card>
      ) : null}

      {course.levels.map((level) => (
        <View key={level.id} style={{ gap: 14 }}>
          <View>
            <T size={22} weight="800">
              {level.title}
            </T>
            <T muted size={14}>
              {level.description}
            </T>
          </View>
          {level.units.map((unit, ui) => {
            const examOpen = isExamUnlocked(unit, p);
            const exam = p.exams[unit.id];
            return (
              <Card key={unit.id} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 30 }}>{unit.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <T size={12} muted weight="700">
                      UNIDAD {ui + 1}
                    </T>
                    <T size={18} weight="800">
                      {unit.title}
                    </T>
                  </View>
                </View>
                {unit.lessons.map((lesson, li) => {
                  const res = p.lessons[lesson.id];
                  const open = isLessonUnlocked(lang, lesson.id, p);
                  return (
                    <Pressable
                      key={lesson.id}
                      disabled={!open}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        borderRadius: 14,
                        backgroundColor: res?.passed ? c.successSoft : open ? c.primarySoft : c.cardAlt,
                        opacity: open ? (pressed ? 0.8 : 1) : 0.55,
                      })}
                    >
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: res?.passed ? c.success : open ? col : c.border, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontWeight: '800' }}>{res?.passed ? '✓' : open ? li + 1 : '🔒'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <T weight="700">{lesson.title}</T>
                        <T size={13} muted>
                          {res?.passed
                            ? res.viaPlacement
                              ? 'Superada en la prueba de nivel'
                              : `Superada · mejor nota ${Math.round(res.bestScore * 100)} %`
                            : res
                              ? `Sin superar · mejor nota ${Math.round(res.bestScore * 100)} %`
                              : open
                                ? `${lesson.vocab.length} palabras nuevas`
                                : 'Supera la lección anterior para desbloquearla'}
                        </T>
                      </View>
                    </Pressable>
                  );
                })}
                <Pressable
                  disabled={!examOpen}
                  onPress={() => router.push(`/exam/${unit.id}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderStyle: 'dashed',
                    borderColor: exam?.passed ? c.success : examOpen ? c.warning : c.border,
                    opacity: examOpen ? (pressed ? 0.8 : 1) : 0.55,
                  })}
                >
                  <Text style={{ fontSize: 24 }}>{exam?.passed ? '🏅' : examOpen ? '📝' : '🔒'}</Text>
                  <View style={{ flex: 1 }}>
                    <T weight="700">Examen de la unidad</T>
                    <T size={13} muted>
                      {exam?.passed
                        ? exam.viaPlacement
                          ? 'Superado en la prueba de nivel'
                          : `Aprobado con ${Math.round(exam.bestScore * 100)} %`
                        : examOpen
                          ? 'Necesitas un 80 % para desbloquear la siguiente unidad'
                          : 'Completa todas las lecciones de la unidad'}
                    </T>
                  </View>
                </Pressable>
              </Card>
            );
          })}
        </View>
      ))}

      <Card style={{ backgroundColor: c.cardAlt, borderWidth: 0 }}>
        <T weight="700">Próximos niveles</T>
        <T muted size={14}>
          Esta es la primera versión, con el nivel A1 completo. Los niveles A2, B1, B2, C1 y C2 se irán añadiendo en las próximas versiones.
        </T>
      </Card>
    </Screen>
  );
}
