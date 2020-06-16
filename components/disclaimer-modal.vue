<template>
  <div v-if="open" class="modal disclaimer">
    <div class="modal__wrapper">
      <panel class="modal__card">
        <div class="modal__card-text">
          <vue-markdown
            id="user-agreements"
            class="markdown"
            :source="userAgreements"
            :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          />
          <vue-markdown
            class="markdown"
            :source="cookieAgreement"
            :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          />
        </div>
        <template v-slot:footer>
          <div class="modal__card-actions form-group">
            <div class="modal__card-actions__checkboxes">
              <ui-checkbox
                watches="['source']"
                :checked="agree"
                @input="setTarget($event, 'agree')"
              >
                I agree with the Conditions of Use
              </ui-checkbox>
              <ui-checkbox
                watches="['source']"
                :checked="cookie"
                @input="setTarget($event, 'cookie')"
              >
                I consent with the use of cookies
              </ui-checkbox>
            </div>
            <div class="modal__card-actions__agree-button">
              <ui-button :disabled="!$v.agree.$model || !$v.cookie.$model" @click="submit">
                I Agree
              </ui-button>
            </div>
          </div>
        </template>
      </panel>
    </div>
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  import { required } from 'vuelidate/lib/validators'
  import * as Cookies from 'tiny-cookie'

  import Panel from './panel.vue'
  import UiCheckbox from './ui-checkbox.vue'
  import UiButton from './ui-button.vue'

  export default {
    components: {
      UiCheckbox,
      VueMarkdown,
      UiButton,
      Panel,
    },
    data() {
      return {
        open: true,
        userAgreements: '',
        cookieAgreement: '',
        agree: false,
        cookie: false,
      }
    },
    created() {
      this.cookie = Cookies.get('cookie') === 'true'
      this.agree = Cookies.get('agree') === 'true'
      if (this.agree) {
        this.open = false
      }
    },
    mounted() {
      fetch('docs/user-agreements.md')
        .then(res => {
          return res.text()
        })
        .then(response => {
          this.userAgreements = response
        })

      fetch('docs/cookie-agreements.md')
        .then(res => {
          return res.text()
        })
        .then(response => {
          this.cookieAgreement = response
        })
    },
    validations: {
      cookie: {
        required,
      },
      agree: {
        required,
      },
    },
    methods: {
      setTarget(evt, target) {
        this[target] = evt.target.checked
        this.$v[target].$touch()
      },
      submit(evt) {
        if (this.cookie) {
          Cookies.set('agree', this.agree)
          Cookies.set('cookie', this.cookie)
        }
        this.open = false
      },
    },
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
    background-color: rgba(0, 0, 0, 0.5);
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
