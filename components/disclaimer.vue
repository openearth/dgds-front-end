<template>
  <div v-if="open" class="modal disclaimer">
    <Panel class="modal-content unselectable">
      <div class="modal-content__text">
        <VueMarkdown
          id="user-agreements"
          class="modal-content-text__markdown"
          :source="userAgreements"
        />
        <VueMarkdown
        class="modal-content-text__markdown"
        :source="cookieAgreement" />
      </div>
      <template v-slot:footer>
        <div class="modal-content__actions form-group">
          <div class="modal-content-actions__checkboxes">
            <UiCheckbox
              :checked="agree"
              @input="setAgreementTarget($event, 'agree')"
            >
              I agree with the Conditions of Use
            </UiCheckbox>
            <UiCheckbox
              :checked="cookie"
              @input="setAgreementTarget($event, 'cookie')"
            >
              I consent with the use of cookies
            </UiCheckbox>
          </div>
          <div class="modal-content-actions__agree-button">
            <UiButton :disabled="!$v.agree.$model" @click="submit">
              I Agree
            </UiButton>
          </div>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { required, and } from 'vuelidate/lib/validators'
import * as Cookies from 'tiny-cookie'

import Panel from './panel'
import UiCheckbox from './ui-checkbox.vue'
import UiButton from './ui-button.vue'

const mustBeTrue = val => val === true
export default {
  components: {
    UiCheckbox,
    VueMarkdown,
    UiButton,
    Panel
  },
  data () {
    return {
      open: true,
      userAgreements: '',
      cookieAgreement: '',
      agree: false,
      cookie: false
    }
  },
  created () {
    this.cookie = Cookies.get('cookie') === 'true'
    this.agree = Cookies.get('agree') === 'true'
    if (this.agree) {
      this.open = false
    }
  },
  validations: {
    cookie: {
      required
    },
    agree: {
      required
    }
  },
  mounted () {
    fetch('docs/user-agreements.md')
      .then((res) => {
        return res.text()
      })
      .then((response) => {
        this.userAgreements = response
      })
    fetch('docs/cookie-agreements.md')
      .then((res) => {
        return res.text()
      })
      .then((response) => {
        this.cookieAgreement = response
      })
  },

  methods: {
    setAgreementTarget (evt, target) {
      this[target] = evt.target.checked
      this.$v[target].$touch()
    },
    submit (evt) {
      if (this.cookie) {
        Cookies.set('agree', this.agree)
        Cookies.set('cookie', this.cookie)
      }
      this.open = false
    }
  }
}
</script>

<style>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.disclaimer section.panel__body {
  padding-left: 0;
  padding-right: 0;
}

.modal-content {
  margin: 10% auto;
  width: 80%;
  height: 50%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  box-shadow: var(--shadow);
  border-radius: 4px;
  display: flex;
  overflow: auto;
  padding: var(--spacing-small);
}

.modal-content__title {
  padding-bottom: var(--spacing-small);
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.modal-content-text__markdown {
  padding-bottom: var(--spacing-small);
}

.modal-content__text {
  font-size: unset;
}

.modal-content__actions {
  flex-grow: 1;
  display: flex;
  padding-top: var(--spacing-small);
}

.modal-content-actions__checkboxes {
  flex-grow: 9;
  display: flex;
  flex-direction: column;
}

.modal-content-actions__agree-button {
  margin-top: auto;
}

</style>
