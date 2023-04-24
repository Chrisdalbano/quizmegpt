<template>
  <div id="app">
    <div class="container">
      <h1>Let's create a quiz! What do you want to be tested about?</h1>
      <div class="input-container">
        <input type="text" v-model="quizTopic" placeholder="Enter a topic" />
        <button @click="generateQuiz">Generate Quiz</button>
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <div v-if="loading" class="loading-spinner"></div>
    </div>

    <quiz-component
      ref="quizComponent"
      v-if="quizGenerated"
      :questions="quizQuestions"
      @submit-answers="showResults"
    ></quiz-component>

    <results-component
      v-if="resultsShown"
      :score="score"
      :totalQuestions="totalQuestions"
      :questions="quizQuestions"
      :userAnswers="userAnswers"
    ></results-component>
  </div>
</template>

<script>
import axios from "axios";
import QuizComponent from "./components/QuizComponent.vue";
import ResultsComponent from "./components/ResultsComponent.vue";

export default {
  name: "App",
  components: {
    QuizComponent,
    ResultsComponent,
  },
  data() {
    return {
      quizTopic: "",
      quizGenerated: false,
      quizQuestions: [],
      resultsShown: false,
      score: 0,
      totalQuestions: 3,
      loading: false,
      userAnswers: [],
      errorMessage: "",
    };
  },

  watch: {
    quizQuestions(newVal) {
      console.log("quizQuestions updated:", newVal);
    },
  },

  methods: {
    async callApi(prompt) {
      const apiKey = process.env.VUE_APP_CHATGPT_API_KEY;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (
        response &&
        response.data &&
        response.data.choices &&
        response.data.choices[0] &&
        response.data.choices[0].message
      ) {
        return response.data.choices[0].message.content;
      } else {
        console.error("API call failed or response format is incorrect");
        return null;
      }
    },

    async generateQuiz() {
      this.loading = true;
      const response = await this.getQuizFromChatGPT(this.quizTopic);
      this.loading = false;

      if (response) {
        const questions = this.parseQuizText(response);
        if (questions !== null) {
          this.quizQuestions = questions;
          this.quizGenerated = true;
          this.errorMessage = ""; // Reset the error message when the quiz is generated successfully
        } else {
          console.error("Failed to parse questions from API response");
          this.errorMessage =
            "Failed to generate quiz. Please try a different topic.";
        }
      }
    },
    async getQuizFromChatGPT(topic) {
      const apiKey = process.env.VUE_APP_CHATGPT_API_KEY;
      const prompt = `Create 3 questions about ${topic}, each with 3 multiple choice answers. Indicate the correct answer for each question with a letter (A, B, or C). Also, make sure that the response given matches the regex ${this.regex} for formatting purposes.`;
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        console.log("API response:", response);
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error("Error generating quiz:", error);
      }
    },
    parseQuizText(text) {
      const regex =
        /(?<=^|\n)\s*(.+)\s*\n*\s*A\)(.+)\s*B\)(.+)\s*C\)(.+)\s*\n*\s*Answer:\s*(A|B|C)/gm;
      let match;
      const questions = [];

      while ((match = regex.exec(text)) !== null) {
        questions.push({
          question: match[1].trim(),
          options: [
            { text: match[2].trim(), value: "A" },
            { text: match[3].trim(), value: "B" },
            { text: match[4].trim(), value: "C" },
          ],
          correctAnswer: match[5],
        });
      }

      return questions.length > 0 ? questions : null;
    },
    showResults(score) {
      this.score = score;
      this.userAnswers = this.$refs.quizComponent.userAnswers; // Access userAnswers via ref
      this.resultsShown = true;
      this.quizGenerated = false;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

html,
body {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  background-color: #f8f9fa;
  color: #212529;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

input[type="text"] {
  flex-grow: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  outline: none;
  font-size: 1rem;
  margin-right: 8px;
}

button {
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

@media (max-width: 480px) {
  .input-container {
    flex-direction: column;
  }

  input[type="text"] {
    margin-bottom: 8px;
    margin-right: 0;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
