<template>
  <div v-if="open" class="modal disclaimer">
    <div class="modal__wrapper">
      <Panel class="modal__card">
        <div class="modal__card-text">
          <VueMarkdown
            id="user-agreements"
            class="modal__card-text__markdown"
            :source="userAgreements"
          />
          <VueMarkdown
            class="modal__card-text__markdown"
            :source="cookieAgreement"
          />
        </div>
        <template v-slot:footer>
          <div class="modal__card-actions form-group">
            <div class="modal__card-actions__checkboxes">
              <UiCheckbox
                :checked="agree"
                @input="setTarget($event, 'agree')"
              >
                I agree with the Conditions of Use
              </UiCheckbox>
              <UiCheckbox
                :checked="cookie"
                @input="setTarget($event, 'cookie')"
              >
                I consent with the use of cookies
              </UiCheckbox>
            </div>
            <div class="modal__card-actions__agree-button">
              <UiButton :disabled="!$v.agree.$model || !$v.cookie.$model" @click="submit">
                I Agree
              </UiButton>
            </div>
          </div>
        </template>
      </Panel>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { required, and } from 'vuelidate/lib/validators'
import * as Cookies from 'tiny-cookie'

import Panel from './panel.vue'
import UiCheckbox from './ui-checkbox.vue'
import UiButton from './ui-button.vue'

import userAgreements from '~/assets/docs/user-agreements.md'
import cookieAgreement from '~/assets/docs/cookie-agreements.md'

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
      userAgreements: userAgreements.html,
      cookieAgreement: cookieAgreement.html,
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
  methods: {
    setTarget (evt, target) {
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
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  transform: translateZ(0);
  background-color: rgba(0, 0, 0, .5);
}

.disclaimer .panel__body {
  padding-right: 0;
  padding-left: 0;
}

.modal__wrapper {
  display: flex;
  z-index: 1;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

@media all and (min-width: 500px) {
  .modal__wrapper {
    display: flex;
    position: absolute;
    top: 0;
    left: 50%;
    flex-direction: row;
    align-items: center;
    width: 500px;
    margin: 0 auto;
    padding: var(--spacing-large);
    transform: translateX(-50%);
  }
}

@media all and (min-width: 768px) {
  .modal__wrapper {
    width: 800px;
  }
}

.modal__card {
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: var(--spacing-small);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  box-shadow: var(--shadow);
}

@media all and (min-width: 500px) {
  .modal__card {
    height: auto;
    max-height: 100%;
  }
}

.modal__card-text__markdown {
  margin-bottom: var(--spacing-small);
}

.modal__card-actions {
  display: flex;
  align-items: center;
  padding-top: var(--spacing-small);
}

.modal__card-actions__checkboxes {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
