<template>
  <v-dialog
    v-model="open"
    scrollable
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :max-width="640"
  >
    <v-card
      class="d-flex flex-column pa-3"
      style="max-height: 100%;overflow:hidden"
    >
      <div class="scrollbar">
        <div
          id="user-agreements"
          class="markdown"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          v-html="UserAgreements1"
        />
        <div
          v-for="(dataset, index, count) in getDatasets"
          :key="`license_use-${dataset.id}`"
        >
          <span
            id="user-agreements"
            class="markdown"
            :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
            v-html="markedText(`- 2.${count + 2}.  ${dataset['license_use']}`)"
          />
        </div>
        <div
          id="user-agreements"
          class="markdown"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          v-html="UserAgreements2"
        />
        <div
          v-for="(dataset, index, count) in getDatasets"
          :key="`license_warranty-${dataset.id}`"
        >
          <span
            id="user-agreements"
            class="markdown"
            :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
            v-html="
              markedText(`- 6.${count + 2}.  ${dataset['license_warranty']}`)
            "
          />
        </div>
        <div
          id="user-agreements"
          class="markdown"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          v-html="UserAgreements3"
        />
        <div
          class="markdown"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
          v-html="markedText(CookieAgreement)"
        />
      </div>
      <v-card-actions>
        <div
          class="pa-2"
          style="width:100%"
        >
          <form
            action=""
            submit.prevent
          >
            <v-checkbox
              label="I agree with the Conditions of Use"
              class="ma-0"
              :value="agree"
              hide-details
              @change="setTarget($event, 'agree')"
            />
            <v-checkbox
              label="I consent with the use of cookies"
              class="ma-0"
              :value="cookie"
              hide-details
              @change="setTarget($event, 'cookie')"
            />
          </form>
          <div class="mt-2 d-flex">
            <v-spacer />
            <v-btn
              color="formBase"
              :disabled="!$v.agree.$model || !$v.cookie.$model"
              @click="submit"
            >
              I agree
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserAgreements1 from '@/assets/docs/user-agreements - part 1.md'
import UserAgreements2 from '@/assets/docs/user-agreements - part 2.md'
import UserAgreements3 from '@/assets/docs/user-agreements - part 3.md'
import CookieAgreement from '@/assets/docs/cookie-agreements.md'
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import * as Cookies from 'tiny-cookie'
import marked from 'marked'

const renderer = new marked.Renderer()

export default {
  data() {
    return {
      open: true,
      UserAgreements1,
      UserAgreements2,
      UserAgreements3,
      CookieAgreement,
      agree: false,
      cookie: false
    }
  },
  created() {
    this.cookie = Cookies.get('cookie') === 'true'
    this.agree = Cookies.get('agree') === 'true'
    if (this.agree) {
      this.open = false
    }
  },
  computed: {
    ...mapGetters(['getDatasets'])
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
    setTarget(evt, target) {
      this[target] = evt
      this.$v[target].$touch()
    },
    submit(evt) {
      if (this.cookie) {
        Cookies.set('agree', this.agree)
        Cookies.set('cookie', this.cookie)
      }
      this.open = false
    },
    markedText(text) {
      return marked(text, { renderer: renderer })
    }
  }
}
</script>
