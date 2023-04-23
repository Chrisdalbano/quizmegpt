<template>
    <div class="quiz-component">
      <div v-for="(question, index) in questions" :key="index" class="question">
        <p class="question-text">{{ question.question }}</p>
        <div
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
          class="option"
        >
          <input
            type="radio"
            :name="'question' + index"
            :value="option.value"
            v-model="userAnswers[index]"
            :id="'option' + index + optionIndex"
          />
          <label :for="'option' + index + optionIndex">{{ option.text }}</label>
        </div>
      </div>
      <button @click="submitAnswers" class="submit-btn">Submit</button>
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