<template>
  <div class="results-component">
    <h2>Your score: {{ score }} / {{ totalQuestions }}</h2>
  </div>
</template>

<script>
export default {
  name: "ResultsComponent",
  props: {
    score: Number,
    totalQuestions: Number,
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
}
</style>
