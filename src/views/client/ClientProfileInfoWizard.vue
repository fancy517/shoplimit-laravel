<template>
  <v-container id="containerClientSignup" fluid>
    <!-- The layout for the whole screen. -->
    <v-layout
      id="containerSignupCard"
      justify-center
      align-center
      fill-height
    >
      <!-- The card that contains the signup form -->
      <v-flex
        class="signup-card"
        xs12
        sm8
        md6
        lg4
      >
        <!-- Back button -->
        <v-icon
          v-if="step > 0"
          id="buttonBack"
          @click="step = --step < 0 ? 0 : step"
        >
          keyboard_backspace
        </v-icon>

        <basic-info-page
          v-if="step === 0"
          :step-title="stepTitles[step]"
          @submit-info-clicked="btnClick"
        />
        <div v-else id="signup-card__content">
          <div class="flex-item signup-card__title">
            Homewayz
            <br>
            <div class="signup-card__title-page-name">
              {{ stepTitles[step] }}
            </div>
          </div>
          <div class="flex-item signup-card__body">
            <legalities-page v-if="step === 1" />
            <home-needs-page v-if="step === 2" />
            <home-wants-page v-if="step === 3" />
            <approval-letter-page v-if="step === 4" />
            <purchase-details-page v-if="step === 5" />
          </div>
          <!-- Continue button -->
          <div class="flex-item signup-card__footer">
            <button
              v-ripple="{ class: 'grey--text', center: true}"
              class="buttonContinue"
              @click="btnClick"
            >
              {{ btnText }}
            </button>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import { mapState } from 'vuex'
import BasicInfoPage from '../../components/client/signup/BasicInfoPage.vue'
import LegalitiesPage from '../../components/client/signup/LegalitiesPage.vue'
import HomeNeedsPage from '../../components/client/signup/HomeNeedsPage.vue'
import HomeWantsPage from '../../components/client/signup/HomeWantsPage.vue'
import ApprovalLetterPage from '../../components/client/signup/ApprovalLetterPage.vue'
import PurchaseDetailsPage from '../../components/client/signup/PurchaseDetailsPage.vue'

export default {
  components: {
    BasicInfoPage,
    LegalitiesPage,
    HomeNeedsPage,
    HomeWantsPage,
    ApprovalLetterPage,
    PurchaseDetailsPage
  },
  data() {
    return {
      stepTitles: [
        'Create Your Account',
        'Legalities',
        'Add Your Home Needs',
        'Add your Home Wants',
        'Documents',
        'Your Purchase Details'
      ],
      showAlert: false,
      currentPath: '',
      formTitle: '',
      step: 0
    }
  },

  computed: {
    // ...mapState('common', ['authStatus']),
    authError() {
      return this.$store.getters.authError
    },

    btnText() {
      if (this.step === 5) {
        return 'Start Search'
      } else {
        return 'Continue'
      }
    }
  },

  watch: {
    $route(to, from) {
      this.currentPath = to.name
    }
  },

  mounted() {
    this.currentPath = this.$router.currentRoute.name
  },

  methods: {
    btnClick() {
      if (this.step < 5) {
        ++this.step
      } else {
        this.$router.push({ name: 'client-dashboard' })
      }
    }
  }
}
</script>

<style>
*:focus {
  outline: none;
}

.test {
  background-color: #ccc;
}

#containerClientSignup {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/img/home.jpg");
  width: 100%;
  height: 100vh;
  background-size: cover;
  overflow: hidden;
}

#containerSignupCard {
  height: 100%;
  width: 100%;
}

.signup-card {
  height: 90%;
  /* padding-bottom: 40px; */
  background-color: #fff;
  border-radius: 5px;
  position: relative;
}

.flex-item {
  flex: 0 0;
}

#signup-card__content,
.client-signup__content {
  height: 100%;
  padding-top: 4%;
  padding-bottom: 12%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  /* background-color: #aaa; */
}

.signup-card__title {
  text-transform: uppercase;
  color: darkgray;
  font-size: 14px;
  flex-basis: 15%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: #f00; */
}

.signup-card__title-page-name {
  text-transform: uppercase;
  color: black;
  font-size: 16px;
  /* background-color: #f0f; */
}

.signup-card__body {
  max-height: 79%;
  height: fit-content;
  /* background-color: #0f0; */
}

.signup-card__footer {
  max-height: 6%;
  /* background-color: #00f; */
}

.buttonContinue {
  border: darkgray 1px solid;
  height: 100%;
  border-radius: 5px;
  padding: 5px 25px;
  box-shadow: #ababab 0px 2px 2px 1px;
}

#buttonBack {
  position: absolute;
  left: 20px;
  top: 10px;

  color: darkgray;
  font-size: 20px;
  cursor: pointer;
}
</style>
