<template>
  <div class="results-component">
    <h2>Your Results:</h2>
    <p>Your score: {{ score }} out of {{ totalQuestions }}</p>
    <p>Your score: {{ score }} out of {{ totalQuestions }}</p>
    <p>You earned {{ xpEarned }} points for this quiz!</p>
    <ol>
      <li v-for="(question, index) in questions" :key="index">
        <strong>{{ question.question }}</strong>
        <p>Your answer: {{ getAnswerText(question, userAnswers[index]) }}</p>
        <p
          v-if="isAnswerCorrect(question, userAnswers[index])"
          class="correct-answer"
        >
          Correct!
        </p>
        <p v-else class="incorrect-answer">
          Incorrect. The correct answer is:
          {{ getAnswerText(question, question.correctAnswer) }}
        </p>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "ResultsComponent",
  props: {
    score: Number,
    totalQuestions: Number,
    questions: Array,
    userAnswers: Array,
    xpEarned: Number,
  },
  methods: {
    getAnswerText(question, answerValue) {
      const answer = question.options.find(
        (option) => option.value === answerValue
      );
      return answer ? answer.text : "N/A";
    },
    isAnswerCorrect(question, userAnswer) {
      return userAnswer === question.correctAnswer;
    },
  },
};
</script>

<style scoped>
.results-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.results-component h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.results-component ol {
  width: 100%;
  padding-left: 20px;
}

.results-component li {
  margin-bottom: 10px;
}

.results-component strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.results-component p {
  margin-bottom: 5px;
}

.correct-answer {
  color: green;
}

.incorrect-answer {
  color: red;
}
</style>
