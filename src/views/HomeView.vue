<template>
  <div class="background">
    <div class="ball" style="top: 5vh; left: 10vw"></div>
    <div class="ball" style="top: 20vh; left: 30vw"></div>
    <div class="ball-b" style="top: 15.8vh; left: 70vw"></div>
    <div class="ball-b" style="top: 70vh; left: 40vw"></div>
    <div class="ball" style="top: 95vh; left: 80vw"></div>
    <div class="ball" style="top: 45.8vh; left: 90vw"></div>
    <div class="ball" style="top: 80vh; left: 60vw"></div>
    <div class="logo-container">
      <img class="logo" src="../assets/quizmegpt-logo.png" />
    </div>
    <button class="info-button" @click="showModal = true">?</button>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showModal = false">&times;</span>
        <h2>Welcome to QuizMEGPT!</h2>
        <p>
          QuizMEGPT is an interactive web application that generates quizzes for
          you based on the topic of your choice. It utilizes the power of
          OpenAI's advanced language model, chat-gpt-turbo, to process your
          requests and provide insightful, challenging, and fun quizzes in
          return.
        </p>
        <h3>Here's how it works:</h3>
        <ol>
          <li>
            <strong>Choose Your Topic</strong>: Just enter a topic you're
            interested in, and QuizMEGPT will use it to create a quiz. The more
            specific you are with your topic, the more targeted the quiz will
            be.
          </li>
          <li>
            <strong>Select Difficulty Level</strong>: You can choose the
            difficulty level of your quiz from easy, medium, hard, to emojis.
            The higher the level, the more challenging the questions! And let's
            not talk about the emojies difficulty...
          </li>
          <li>
            <strong>Quiz Generation</strong>: After you've chosen a topic and
            difficulty, click on 'Generate Quiz'. The application will then send
            a request to the OpenAI API. The API's response will be processed
            and formatted through specific algorithms to generate a unique and
            engaging quiz for you.
          </li>
          <li>
            <strong>Account Benefits</strong>: If you have an account and are
            logged in, you can track your progress, review past quizzes, and
            even earn points from your quiz results! As you accumulate points,
            you'll level up and unlock new titles, adding an exciting
            competitive edge to your quizzing journey.
          </li>
          <li>
            <strong>Load Sample Quiz</strong>: Not sure what topic to choose?
            Try out the 'Load Sample Quiz' feature! This gives you a pre-made
            quiz to explore.
          </li>
        </ol>
        <p>
          QuizMEGPT aims to make learning fun and engaging, allowing you to test
          your knowledge and learn new information across a wide array of
          topics. Enjoy the quiz experience!
        </p>
        <p class="note">
          <strong>Note</strong>: While ChatGPT strives to provide accurate
          information, there might be instances where the generated content may
          be incorrect or out-of-date. We're constantly working on improving the
          accuracy of the system. However, it's important to remember that the
          underlying model was last trained on new data in September 2021, and
          thus it doesn't have information about the world after that point. We
          encourage users to use QuizMEGPT as a fun learning tool rather than a
          primary source of information and to verify any important data from
          other reliable resources. Thank you for your understanding and enjoy
          the quizzes!
        </p>
      </div>
    </div>
    <div class="container">
      <div v-if="loggedInUser">
        <h1 class="p-message">
          Welcome back {{ shortenedEmail }}! What do you want to be tested
          about?
        </h1>
      </div>

      <div v-else>
        <h1 class="p-message">
          Let's create a quiz! What do you want to be tested about?
        </h1>
        <p class="nlg-paragraph">
          Log into your account to review your Quizzes and get points from your
          matches!
        </p>
        <!-- Display login or signup form -->
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <input
            type="text"
            v-model="quizTopic"
            class="input-topic"
            placeholder="Enter a topic"
          />
          <div class="selector-container">
            <select
              v-model="difficultyLevel"
              class="difficulty-selector custom-select"
              :disabled="loading"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="emoji">Emojis</option>
            </select>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button @click="generateQuiz" :disabled="loading" class="disabledStyle">
          Generate Quiz
        </button>
        <button
          @click="loadSampleQuiz"
          class="sample-button"
          :disabled="loading"
        >
          Load Sample Quiz
        </button>
      </div>

      <p class="error-message">{{ errorMessage }}</p>
      <div v-if="loading" class="loading-spinner"></div>
      <p v-if="loading" class="waiting-text">
        We are generating a quiz for you
      </p>
    </div>
    <img
      class="illustration-home"
      v-if="!quizGenerated & !resultsShown"
      src="../assets/home-vector-design.png"
    />
    <img
      class="illustration-home results-ill"
      v-if="resultsShown"
      src="../assets/results-ill.png"
    />
    <quiz-component
      ref="quizComponent"
      v-if="quizGenerated"
      :questions="quizQuestions"
      @submit-answers="showResults"
    ></quiz-component>

    <results-component
      v-if="resultsShown"
      :score="score"
      :total-questions="quizQuestions.length"
      :questions="quizQuestions"
      :user-answers="userAnswers"
      :xp-earned="xpEarned"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import QuizComponent from "@/components/QuizComponent.vue";
import ResultsComponent from "@/components/ResultsComponent.vue";

const sampleQuiz = [
  {
    question: "What is the capital of France?",
    options: [
      { text: "A. Paris", value: "A" },
      { text: "B. London", value: "B" },
      { text: "C. Madrid", value: "C" },
    ],
    correctAnswer: "A",
  },
  {
    question: "Which language is primarily used for web development?",
    options: [
      { text: "A. Python", value: "A" },
      { text: "B. JavaScript", value: "B" },
      { text: "C. C++", value: "C" },
    ],
    correctAnswer: "B",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: [
      { text: "A. Earth", value: "A" },
      { text: "B. Jupiter", value: "B" },
      { text: "C. Mars", value: "C" },
    ],
    correctAnswer: "B",
  },
  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: [
      { text: "A. Nitrogen", value: "A" },
      { text: "B. Oxygen", value: "B" },
      { text: "C. Carbon Dioxide", value: "C" },
    ],
    correctAnswer: "A",
  },
  {
    question: "What is the chemical symbol for Sodium?",
    options: [
      { text: "A. S", value: "A" },
      { text: "B. Na", value: "B" },
      { text: "C. Sn", value: "C" },
    ],
    correctAnswer: "B",
  },
];

export default {
  components: {
    QuizComponent,
    ResultsComponent,
  },
  mounted() {
    window.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        this.showModal = false;
      }
    });
  },
  data() {
    return {
      showModal: false,
      difficultyLevel: "easy",
      quizTopic: "",
      quizGenerated: false,
      quizQuestions: [],
      resultsShown: false,
      score: 0,
      totalQuestions: 5,
      loading: false,
      userAnswers: [],
      errorMessage: "",
    };
  },

  computed: {
    ...mapGetters(["loggedInUser"]),
    shortenedEmail() {
      if (this.loggedInUser && this.loggedInUser.email) {
        const emailParts = this.loggedInUser.email.split("@");
        if (emailParts.length === 2) {
          const username = emailParts[0];

          const maxUsernameLength = 8; // Define the maximum length for the username

          if (username.length > maxUsernameLength) {
            // Shorten the username and add ellipsis
            const shortenedUsername = username.slice(0, maxUsernameLength);
            return shortenedUsername + "...";
          }
        }
      }

      return this.loggedInUser ? this.loggedInUser.email : "";
    },
  },
  watch: {
    quizQuestions(newVal) {
      console.log("quizQuestions updated:", newVal);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.quizGenerated) {
      if (
        confirm(
          "You're in the middle of a quiz, are you sure you want to leave this page?"
        )
      ) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    loadSampleQuiz() {
      this.quizQuestions = sampleQuiz;
      this.quizGenerated = true;
      this.resultsShown = false;

      this.$nextTick(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
    },
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
      // Hide the results when generating a new quiz
      this.resultsShown = false;

      this.loading = true;
      const response = await this.getQuizFromChatGPT(
        this.quizTopic,
        this.difficultyLevel
      );
      this.loading = false;

      if (response) {
        const questions = this.parseQuizText(response);
        if (questions !== null) {
          this.quizQuestions = questions;
          this.quizGenerated = true;
          this.errorMessage = ""; // Reset the error message when the quiz is generated successfully
          this.$nextTick(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          });
        } else {
          console.error("Failed to parse questions from API response");
          this.errorMessage =
            "Failed to generate quiz. Please try a different topic.";
        }
      }
    },

    async showResults(payload) {
      this.score = payload.score;
      this.userAnswers = this.$refs.quizComponent.userAnswers;
      this.resultsShown = true;
      this.quizGenerated = false;
      this.xpEarned = payload.xpEarned; // Set the xpEarned value

      // Call the Vuex action to update the user's XP
      await this.updateUserXp(payload.xpEarned);
      await this.saveQuizToHistory({ ...payload });

      window.scrollBy({
        top: window.scrollY - 40,
        behavior: "smooth",
      });
    },
    ...mapActions(["updateUserXp", "saveQuizToHistory"]),
    async getQuizFromChatGPT(topic, difficulty) {
      const apiKey = process.env.VUE_APP_CHATGPT_API_KEY;
      var prompt = ``;
      if (this.difficultyLevel == "emoji") {
        prompt = `Create 5 questions to be responded with emojis about ${topic}; each with 3 multiple choice answers, the choice answers can only be written using multiple emojis, unless the question its a name, it would need to be followed an emoji after the name to represent the character. Indicate the correct answer for each question with a letter (A, B, or C). Answer letters should use ')'. Also, make sure that the response given matches the regex ${this.regex} for formatting purposes. `;
      } else {
        prompt = `Create 5 ${difficulty} questions about ${topic}, each with 3 multiple choice ${difficulty} answers. Indicate the correct answer for each question with a letter (A, B, or C). Answer letters should use ')'. Also, make sure that the response given matches the regex ${this.regex} for formatting purposes.`;
      }
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
  padding-right: 100px;
  box-sizing: border-box;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 8px;
}

button {
  margin-left: 8px;
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  background-color: #30a0e0;
  color: #ffffff;
  border: none;
  border-radius: 41px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sample-button {
  background-color: #ffc973;
}

button:hover {
  background-color: #4e4e4e;
}

.instructions {
  display: inline-block;
  background-color: #e7e7e7;
  padding: 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 20px;
  max-width: 600px;
  color: #333;
}

.selector-container {
  display: inline-block;
}

.difficulty-selector {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  padding: 12px;

  border-radius: 41px;
  font-size: 1rem;
  background-color: #f9f9f9;
  cursor: pointer;
  border: 6px solid #ffc973;
}

.difficulty-selector:focus {
  outline: none;
}

.logo {
  display: block;
  margin: 0 auto;
  width: 148px;
  height: 159px;
}

.logo-container {
  padding: 2rem;
  padding-bottom: 6rem;
}

.p-message {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.input-topic {
  padding: 0.4rem;
  padding: 12px;
  border-radius: 41px;
  font-size: 1rem;
  background-color: #f9f9f9;
  border: 6px solid #ffe3b3;
}

.input-topic:focus {
  outline: none;
}

.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.custom-select:hover {
  opacity: 0.8;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.nlg-paragraph {
  display: flex;
  justify-content: center;
  justify-items: center;
  margin: auto;
  font-size: medium;
  max-width: 50%;
  padding-bottom: 1rem;
  opacity: 75%;
}

.button-container button {
  margin-left: 8px;
  margin-right: 8px;
}

.illustration-home {
  display: block;
  margin: 0 auto;
  width: 317px;
  height: 317px;
}

.results-ill {
  padding: 0;
  width: 200px;
  height: 200px;
}

.waiting-text {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.ball {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #30a0e0;
  opacity: 0.3;
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

.ball-b {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #ffc973;
  opacity: 0.4;
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Responsive Styles */

.background {
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  .background {
    align-items: center;
    justify-content: center;
  }

  .container {
    padding: 20px;
  }

  .logo {
    width: 100px;
    height: 107px;
  }

  .illustration-home {
    width: 200px;
    height: 200px;
  }

  .results-ill {
    width: 120px;
    height: 120px;
  }
}
@media only screen and (max-width: 600px) {
  body {
    font-size: 22px;
  }

  h1 {
    font-size: 2.5rem;
  }

  button {
    font-size: 1.2rem;
    padding: 10px 16px;
  }

  .p-message {
    font-size: 1.5rem;
  }

  .input-topic {
    font-size: 1.2rem;
  }

  .difficulty-selector {
    font-size: 1.2rem;
  }

  .nlg-paragraph {
    font-size: large;
  }

  input[type="text"] {
    padding-right: 100px;
    font-size: 1.2rem;
  }
}

.info-button {
  display: flex;
  margin: auto;
  justify-content: center;
  background-color: #616161;
  color: white;
  border-radius: 100%;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 41px;
}

.close-button {
  color: #30a0e0;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.note{
  opacity:60%;
  color: rgb(85, 0, 0);
}

</style>
