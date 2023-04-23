<template>
    <div class="results-component">
      <h2>Your score: {{ score }} / {{ totalQuestions }}</h2>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ResultsComponent',
    props: {
      score: Number,
      totalQuestions: Number,
    },
  };
  </script>
  