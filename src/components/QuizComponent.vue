<template>
  <p class="questionNumber">
    Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}
  </p>
  <div class="currentQuestion">
    <b>{{ questions[currentQuestionIndex].question }}</b>
  </div>
  <div class="quiz-component">
    <div
      class="question-wrapper"
      v-if="currentQuestionIndex < questions.length"
    >
      <div
        class="choice"
        v-for="(option, optionIndex) in questions[currentQuestionIndex].options"
        :key="optionIndex"
      >
        <div
          class="option"
          :class="{
            selected: userAnswers[currentQuestionIndex] === option.value,
          }"
          @click="selectAnswer(option.value)"
        >
          <label :for="'option' + optionIndex" class="option-label">{{
            option.text
          }}</label>
        </div>
      </div>
    </div>
    <button
      @click="nextQuestion"
      v-if="currentQuestionIndex < questions.length - 1"
    >
      Next Question
    </button>
    <button @click="submitAnswers" v-else>Submit</button>
  </div>
</template>

<script>
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase.js";

export default {
  name: "QuizComponent",
  props: {
    questions: Array,
  },

  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },

  data() {
    return {
      userAnswers: Array(this.questions.length).fill(null),
      currentQuestionIndex: 0,
    };
  },
  methods: {
    selectAnswer(answer) {
      this.userAnswers[this.currentQuestionIndex] = answer;
    },
    nextQuestion() {
      if (this.userAnswers[this.currentQuestionIndex] !== null) {
        this.currentQuestionIndex++;
      }
    },
    submitAnswers() {
      let score = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (this.userAnswers[i] === this.questions[i].correctAnswer) {
          score++;
        }
      }
      const xpEarned = score * 10; // Modify this value to change XP per correct answer
      // this.saveQuizHistory({ score, xpEarned, questions: this.questions });
      this.$emit("submit-answers", {
        score,
        xpEarned,
        questions: this.questions,
      });
    },

    async saveQuizHistory(quizData) {
      const quizHistoryRef = collection(db, "quizHistory");
      const newQuizHistory = {
        userId: this.loggedInUser.uid,
        timestamp: new Date(),
        ...quizData,
      };
      await addDoc(quizHistoryRef, newQuizHistory);
    },
  },
};
</script>

<style scoped>
.quiz-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 150px;
}

.question-wrapper {
  background-color: #f3f3f3;
  padding: 15px;
  border-radius: 41px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

.choice {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}

.option {
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: #ffc973;
  width: 200px;
  border-radius: 41px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.selected {
  background-color: #006bb9;
  color: white;
}

.option:hover {
  background-color: #ffe3b3;
}

.option label.option-label {
  cursor: pointer;
  width: 100%;
}

.hidden-radio:checked + .option-label {
  background-color: #006bb9;
  color: white;
  border-radius: 41px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
}

.currentQuestion {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 20px auto;
  background-color: #ffe3b3;
  border-radius: 41px;
  padding: 30px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.questionNumber {
  font-size: 1rem;
  opacity: 60%;
  display: flex;
  align-content: center;
  margin: auto;
  padding-bottom: 10px;
}

.hidden-radio {
  display: none;
}

.option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Responsive Styles */

@media (max-width: 600px) {
  .currentQuestion {
    margin: 20px;
  }
}
</style>
