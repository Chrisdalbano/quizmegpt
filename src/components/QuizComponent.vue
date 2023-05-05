<template>
  <div class="quiz-component">
    <div
      class="question-wrapper"
      v-if="currentQuestionIndex < questions.length"
    >
      <p>
        <b>{{ questions[currentQuestionIndex].question }}</b>
      </p>
      <div
        class="choice"
        v-for="(option, optionIndex) in questions[currentQuestionIndex].options"
        :key="optionIndex"
      >
        <div class="option">
          <input
            type="radio"
            :name="'question' + currentQuestionIndex"
            :value="option.value"
            v-model="userAnswers[currentQuestionIndex]"
            :id="'option' + optionIndex"
            class="hidden-radio"
          />
          <label :for="'option' + optionIndex" class="option-label">{{ option.text }}</label>
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
      this.$emit("submit-answers", { score, xpEarned, questions: this.questions });
      
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
}

.question-wrapper {
  background-color: #f3f3f3;
  padding: 15px;
  border-radius: px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

.choice {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}


.option input {
  margin-right: 5px;
  
}

.submit-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2a75c1;
}

.hidden-radio {
    display: none;
  }

  .option {
    display: flex;
    align-items: center;
    justify-content: left;
    background-color: #FFC973;
    width: 200px;
    border-radius: 41px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .option:hover {
    background-color: #FFE3B3;
  }

  .option label.option-label {
    cursor: pointer;
    width: 100%;
  }

  .hidden-radio:checked + .option-label {
    background-color: #006BB9;
    color: white;
    border-radius: 41px;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 20px;
  }
</style>
