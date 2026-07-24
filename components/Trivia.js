"use client";

import { useState, useCallback } from "react";
import SectionReveal from "./SectionReveal";

const QUESTIONS = [
  {
    question: "¿Cuál es el color favorito de Susana?",
    options: [
      { label: "Rosado", color: "#FFB7E2", correct: true },
      { label: "Azul", color: "#6b9fff", correct: false },
      { label: "Verde", color: "#6b9f6b", correct: false },
    ],
  },
  {
    question: "¿Qué quiere ser Susana cuando sea grande?",
    options: [
      { label: "Doctora", icon: "local_hospital", correct: true },
      { label: "Astronauta", icon: "rocket", correct: false },
      { label: "Maestra", icon: "school", correct: false },
    ],
  },
  {
    question: "¿Cuál es su actividad favorita del spa?",
    options: [
      { label: "Pintarse las uñas", icon: "magic", correct: true },
      { label: "Masajes", icon: "spa", correct: false },
      { label: "Mascarillas", icon: "face", correct: false },
    ],
  },
  {
    question: "¿Cuál es su película favorita?",
    options: [
      { label: "Frozen", icon: "ac_unit", correct: true },
      { label: "Moana", icon: "sailing", correct: false },
      { label: "Encanto", icon: "music_note", correct: false },
    ],
  },
  {
    question: "¿Cuál es su animal favorito?",
    options: [
      { label: "Perro", icon: "pets", correct: true },
      { label: "Conejo", icon: "cruelty_free", correct: false },
      { label: "Gato", icon: "pets", correct: false },
    ],
  },
  {
    question: "¿Cuál es su comida favorita?",
    options: [
      { label: "Sushi", icon: "set_meal", correct: true },
      { label: "Pizza", icon: "local_pizza", correct: false },
      { label: "Hamburguesa", icon: "lunch_dining", correct: false },
    ],
  },
  {
    question: "¿Cuántos años cumple Susana?",
    options: [
      { label: "5 años", icon: "looks_two", correct: true },
      { label: "4 años", icon: "looks_one", correct: false },
      { label: "6 años", icon: "looks_3", correct: false },
    ],
  },
  {
    question: "¿Qué lleva puesto Susana en su día de spa ideal?",
    options: [
      { label: "Bata rosita y corona", icon: "crown", correct: true },
      { label: "Vestido de gala", icon: "evening", correct: false },
      { label: "Uniforme escolar", icon: "backpack", correct: false },
    ],
  },
];

const API = "http://localhost:4000/api";

export default function Trivia() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCode, setSavedCode] = useState(null);

  const handleAnswer = useCallback(
    (index) => {
      if (showFeedback) return;
      setSelected(index);
      setShowFeedback(true);
      if (QUESTIONS[current].options[index].correct) {
        setScore((s) => s + 1);
      }
    },
    [current, showFeedback]
  );

  const handleNext = useCallback(() => {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  }, [current]);

  const handleRestart = useCallback(() => {
    setStarted(false);
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowFeedback(false);
    setName("");
    setCode("");
    setSaveStatus("idle");
    setSaveMessage("");
    setSavedCode(null);
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !code.trim()) return;
    setSaveStatus("loading");
    try {
      const res = await fetch(`${API}/trivia/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), invitationCode: code.trim(), score, total: QUESTIONS.length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedCode(code.trim());
      setSaveStatus("success");
      setSaveMessage("¡Puntaje guardado! 🎉");
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(err.message);
    }
  };

  if (!started) {
    return (
      <SectionReveal id="trivia">
        <div className="glass-morphism rounded-xl p-6 space-y-6 bg-white/60 border-white/80 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">👑</span>
            <span className="material-symbols-outlined text-5xl text-pink-500">extension</span>
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="font-headline text-xl text-primary font-bold italic princess-title">
            ¿Cuánto conoces a Susana?
          </h3>
          <p className="text-xs text-pink-600/70 font-medium">
            Responde todas las preguntas y demuestra que eres su mejor amiga.
            <br />
            <strong className="text-pink-600">Quien obtenga más puntaje tendrá un premio especial en la fiesta. 👑✨</strong>
          </p>
          <button
            onClick={() => setStarted(true)}
            className="btn-gradient text-white rounded-lg font-bold text-sm px-8 py-3 shadow-lg"
          >
            ¡Comenzar juego! ✨
          </button>
        </div>
      </SectionReveal>
    );
  }

  if (finished) {
    const total = QUESTIONS.length;
    const percent = Math.round((score / total) * 100);
    let emoji, message;
    if (percent === 100) {
      emoji = "🏆";
      message = "¡Perfecto! Eres la mejor amiga de Susana, el premio te espera.";
    } else if (percent >= 75) {
      emoji = "🎉";
      message = "¡Casi perfecto! Sabes mucho de Susana.";
    } else if (percent >= 50) {
      emoji = "😊";
      message = "Conoces bastante bien a Susana. ¡Sigue así!";
    } else {
      emoji = "🤗";
      message = "Sigue aprendiendo de Susana, ella te espera en la fiesta.";
    }

    return (
      <SectionReveal id="trivia">
        <div className="glass-morphism rounded-xl p-6 space-y-6 bg-white/60 border-white/80 text-center">
          <div className="text-6xl">{emoji}</div>
          <h3 className="font-headline text-xl text-primary font-bold italic princess-title">
            ¡Juego terminado! 👑
          </h3>
          <div className="bg-gradient-to-r from-pink-100/50 to-purple-100/50 rounded-lg p-4 border border-pink-200/50">
            <p className="text-4xl font-bold text-pink-600">{score}/{total}</p>
            <p className="text-xs text-pink-600/70 mt-1">preguntas correctas ✨</p>
          </div>
          <p className="text-sm font-semibold text-secondary">{message}</p>

          {savedCode ? (
            <p className="text-sm font-bold text-green-700">¡Puntaje guardado! 🎉</p>
          ) : (
            <div className="space-y-3">
              <input
                className="w-full bg-white/50 border border-white/50 rounded-lg py-3 px-4 text-center text-lg font-bold tracking-[0.15em] text-primary outline-none focus:ring-2 focus:ring-primary/20 placeholder-primary/50"
                placeholder="Código de invitación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <input
                className="w-full bg-white/50 border border-white/50 rounded-lg py-3 px-4 text-center text-primary font-semibold outline-none focus:ring-2 focus:ring-primary/20 placeholder-primary/50"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={handleSave}
                disabled={saveStatus === "loading" || !name.trim() || !code.trim()}
                className="w-full py-3 btn-gradient text-white rounded-lg font-bold text-sm shadow-lg disabled:opacity-60"
              >
                {saveStatus === "loading" ? "Guardando..." : "Guardar puntaje"}
              </button>
              {saveMessage && (
                <p className={`text-sm font-bold ${saveStatus === "success" ? "text-green-700" : "text-red-700"}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleRestart}
            className="btn-gradient text-white rounded-lg font-bold text-sm px-8 py-3 shadow-lg"
          >
            Volver a jugar ✨
          </button>
        </div>
      </SectionReveal>
    );
  }

  const q = QUESTIONS[current];

  return (
    <SectionReveal id="trivia">
      <div className="glass-morphism rounded-xl p-6 space-y-6 bg-white/60 border-white/80">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-lg text-primary font-bold italic princess-title">
            Trivia 👑
          </h3>
          <span className="text-xs font-bold text-pink-600/70 bg-pink-100/40 px-3 py-1 rounded-full border border-pink-200/50">
            {current + 1} / {QUESTIONS.length} ✨
          </span>
        </div>

        <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden border border-pink-200/40">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="bg-gradient-to-r from-pink-50/50 to-purple-50/50 p-4 rounded-lg text-center border border-pink-200/40">
          <p className="font-semibold text-pink-700/90 text-sm">{q.question}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = opt.correct;
            let btnClass = "bg-white/30 border-pink-200/40 hover:bg-pink-100/40";

            if (showFeedback) {
              if (isCorrect) btnClass = "bg-green-100 border-green-300";
              else if (isSelected) btnClass = "bg-red-100 border-red-300";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all text-left disabled:cursor-default ${btnClass}`}
              >
                {opt.color ? (
                  <div
                    className="w-6 h-6 rounded-full shadow-sm shrink-0 border-2 border-white"
                    style={{ backgroundColor: opt.color }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-pink-500 text-xl shrink-0">
                    {opt.icon}
                  </span>
                )}
                <span className="font-bold text-pink-700/80 text-sm">{opt.label}</span>
                {showFeedback && isSelected && (
                  <span
                    className={`material-symbols-outlined ml-auto text-sm ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isCorrect ? "check_circle" : "cancel"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="text-center space-y-3">
            <p className="text-sm font-bold text-pink-600">
              {q.options[selected].correct
                ? "¡Correcto! 🎉✨"
                : `Incorrecto. La respuesta correcta es: ${q.options.find((o) => o.correct).label}`}
            </p>
            <button
              onClick={handleNext}
              className="btn-gradient text-white rounded-lg font-bold text-sm px-8 py-3 shadow-lg"
            >
              {current < QUESTIONS.length - 1 ? "Siguiente pregunta" : "Ver resultados"}
            </button>
          </div>
        )}
      </div>
    </SectionReveal>
  );
}
