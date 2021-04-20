<template>
  <v-dialog
    scrollable
    persistent
    v-model="open"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :max-width="640"
  >
    <v-card class="d-flex flex-column pa-3" style="max-height: 100%;overflow:hidden">
      <div class="scrollbar">
        <div
          id="user-agreements"
          class="markdown"
          v-html="UserAgreements"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
        />
        <div
          class="markdown"
          v-html="CookieAgreement"
          :anchor-attributes="{ target: '_blank', rel: 'noopener' }"
        />
      </div>
      <v-card-actions>
        <div class="pa-2" style="width:100%">
          <form action="" submit.prevent>
            <v-checkbox
              label="I agree with the Conditions of Use"
              class="ma-0"
              :value="agree"
              @change="setTarget($event, 'agree')"
              hide-details
            />
            <v-checkbox
              label="I consent with the use of cookies"
              class="ma-0"
              :value="cookie"
              @change="setTarget($event, 'cookie')"
              hide-details
            />
          </form>
          <div class="mt-2 d-flex">
            <v-spacer></v-spacer>
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
import UserAgreements from '@/assets/docs/user-agreements.md'
import CookieAgreement from '@/assets/docs/cookie-agreements.md'
import { required } from 'vuelidate/lib/validators'
import * as Cookies from 'tiny-cookie'

export default {
  data () {
    return {
      open: true,
      UserAgreements,
      CookieAgreement,
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
      this[target] = evt
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
