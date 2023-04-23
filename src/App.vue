<template>
  <div id="app">
    <div class="container">
      <h1>Let's create a quiz! What do you want to be tested about?</h1>
      <div class="input-container">
        <input type="text" v-model="quizTopic" placeholder="Enter a topic" />
        <button @click="generateQuiz">Generate Quiz</button>
      </div>

    <div v-if="quizGenerated">
      <quiz-component
        :questions="quizQuestions"
        @submit-answers="showResults"
      ></quiz-component>
    </div>

    <div v-if="resultsShown">
      <results-component
        :score="score"
        :totalQuestions="totalQuestions"
      ></results-component>
    </div>
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
      totalQuestions: 1,
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
      console.log("Generating question");
      const response = await this.getQuizFromChatGPT(this.quizTopic); // Use getQuizFromChatGPT instead of callApi
      console.log("Received response for question:", response);

      if (response) {
        const question = this.parseQuizText(response);
        console.log("Parsed question:", question);
        if (question !== null) {
          // Add this condition
          this.quizQuestions = [question]; // Set the quizQuestions directly with the single question
          this.quizGenerated = true; // Set quizGenerated to true
        } else {
          console.error("Failed to parse question from API response");
        }
      }

      console.log("quizQuestions updated:", this.quizQuestions);
    },
    async getQuizFromChatGPT(topic) {
      const apiKey = process.env.VUE_APP_CHATGPT_API_KEY;
      const prompt = `Create a question about ${topic}, with 3 multiple choice answers. Indicate the correct answer for the question with a letter (A, B, or C).`;
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
        /^(.+)\s*\n*\s*A\)(.+)\s*B\)(.+)\s*C\)(.+)\s*\n*\s*Answer:\s*(A|B|C)/gm;
      const match = regex.exec(text);

      if (match) {
        return {
          question: match[1].trim(),
          options: [
            { text: match[2].trim(), value: "A" },
            { text: match[3].trim(), value: "B" },
            { text: match[4].trim(), value: "C" },
          ],
          correctAnswer: match[5],
        };
      } else {
        return null;
      }
    },
    showResults(score) {
      this.score = score;
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
</style>