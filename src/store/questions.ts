import { create } from "zustand"
import { type Question } from '../types'
import confetti from 'canvas-confetti'
import { persist } from 'zustand/middleware'

interface State {
  questions: Question[]
  currentQuestion: number
  fetchQuestions: (limit: number) => void
  selectAnswer: (questionId: number, answerIndex: number) => void
  goNextQuestion: () => void
  goPreviousQuestion: () => void
  reset: () => void
}

export const useQuestionsStore = create<State>()(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0,

        fetchQuestions: async (limit: number) => {
            const res = await fetch('http://localhost:5173/data.json')
            const json = await res.json()

            const questions = json.sort(() => Math.random() -0.5).slice(0, limit)
            set({questions})

        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            // const state = get()
            const {questions} = get()
            // clonado del objeto
            const newQuestions = structuredClone(questions)
            // encontrar el indice de la pregunta
            const questionIndex = newQuestions.findIndex(q => q.id === questionId)
            // obtener info de la pregunta
            const questionInfo = newQuestions[questionIndex]
            // sabemos si el usuario ha seleccionado la respuesta correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;
            if (isCorrectUserAnswer) confetti();
            // cambiar la informacion en la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }
            // actualizar el estado
            set({ questions: newQuestions })

        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get()
            const nextQuestion = currentQuestion + 1
      
            if (nextQuestion < questions.length) {
            //   set({ currentQuestion: nextQuestion }, false, 'GO_NEXT_QUESTION')
              set({ currentQuestion: nextQuestion })
            }
          },
      
          goPreviousQuestion: () => {
            const { currentQuestion } = get()
            const previousQuestion = currentQuestion - 1
      
            if (previousQuestion >= 0) {
            //   set({ currentQuestion: previousQuestion }, false, 'GO_PREVIOUS_QUESTION')
              set({ currentQuestion: previousQuestion })
            }
          },

          reset: () => {
            // set({ currentQuestion: 0, questions: [] }, false, 'RESET')
            set({ currentQuestion: 0, questions: [] })
          }

    }
}, {
    // nombre de la store
    name: 'questions',
}))