<template>
  <div class="score-container">
    <p>Your results</p>
    <p class="total-score">{{ score }}/{{ totalQuestions }}</p>
    <p>You earned {{ xpEarned }} points</p>
  </div>

  <div class="results-component">
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
.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 2rem auto;
  width: 20rem;
  background-color: #ffc973;
  border-radius: 41px;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

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
  margin-bottom: 3rem;
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

.total-score {
  margin: 0;
  font-size: 80px;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  color: white;
  -webkit-text-stroke: 3px #000000;
}
</style>
