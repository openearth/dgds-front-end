<template>
  <div v-if="agreed" class="modal">
    <Panel class="modal-content">
      <div class="modal-content__text">
        <span class="modal-content__title h3 unselectable">
          Conditions of use
        </span>
        <VueMarkdown :source="userAgreements"> </VueMarkdown>
        <span class="modal-content__title h3 unselectable">
          Cookies
        </span>
        <VueMarkdown :source="userAgreements"> </VueMarkdown>
      </div>
      <template v-slot:footer>
        <div class="modal-content__actions">
          <div class="modal-content-actions__checkboxes">
            <UiCheckbox>
              I agree with the Conditions of Use
            </UiCheckbox>
            <UiCheckbox>
              I consent with the use of cookies
            </UiCheckbox>
          </div>
          <div class="modal-content-actions__agree-button">
            <UiButton @click="agreed = false">
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

import Panel from './Panel'
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
      modalOpen: true,
      userAgreements: '',
      agreed: true,
    }
  },

  mounted() {
    fetch('user-agreements.md')
      .then(res => {
        return res.text()
      })
      .then(response => {
        this.userAgreements = response
        console.log('response', response)
      })
  },

  methods: {},
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
  flex-grow: 1;
}
</style>
