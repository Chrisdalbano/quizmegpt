<template>
  <div class="quiz-component">
    <div v-if="currentQuestionIndex < questions.length">
      <p>{{ questions[currentQuestionIndex].question }}</p>
      <div v-for="(option, optionIndex) in questions[currentQuestionIndex].options" :key="optionIndex">
        <input
          type="radio"
          :name="'question' + currentQuestionIndex"
          :value="option.value"
          v-model="userAnswers[currentQuestionIndex]"
        />
        <label>{{ option.text }}</label>
      </div>
      <button @click="nextQuestion" v-if="currentQuestionIndex < questions.length - 1">Next Question</button>
      <button @click="submitAnswers" v-else>Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizComponent",
  props: {
    questions: Array,
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
      this.$emit("submit-answers", score);
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

.question {
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.option {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
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
</style>
