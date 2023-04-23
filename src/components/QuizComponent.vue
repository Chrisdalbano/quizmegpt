<template>
  <div class="quiz-component">
    <div v-for="(question, index) in questions" :key="index">
      <p>{{ question.question }}</p>
      <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
        <input
          type="radio"
          :name="'question' + index"
          :value="option.value"
          v-model="userAnswers[index]"
        />
        <label>{{ option.text }}</label>
      </div>
    </div>
    <button @click="submitAnswers">Submit</button>
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
    };
  },
  methods: {
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
