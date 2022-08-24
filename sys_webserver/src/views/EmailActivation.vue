<template>
  <b-container fluid style="border: 1px;">
    <b-alert v-model="errorOccured" variant="danger" dismissible fade>
      {{ errorMessage  }}
    </b-alert>
    <b-row class="justify-content-center">
      <b-card v-if="!sent" class="mt-5" style="width: 25%;">
        <b-row>
          <b-col>
            <b-form-group id="inputGroupEmail" label="Email" label-for="inputEmail">
                <b-form-input id="inputEmail" v-model="email" type="email" placeholder="Enter email" maxLength="320"  required></b-form-input>
                <template v-if="invalidEmailAddress"><span style="color: red">Invalid email</span></template>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-button
            type="submit"
            :disabled="email == ''  || sending"
            @click="sendActivationEmail"
          >
            Send Activation Email
          </b-button>
        </b-row>
      </b-card>
      <b-row v-else>
          <b-col>
            <b-row style="margin-top: 100px;" align-h="center">
              <h1>An activation email has been sent</h1>
            </b-row>
            <b-row align-h="center">
              <h3>Please check your email to activate your account</h3>
            </b-row>
            <b-row align-h="center">
              <h5>If you did not receive an an email, please <b-link v-on:click="reset()">click here</b-link></h5>
            </b-row>
          </b-col>
        </b-row>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data: function() {
    return {
      email: '',
      invalidEmailAddress: false,
      errorMessage: '',
      errorOccured: false,
      sent: false,
      sending: false,
    };
  },
  methods:
  {
    async sendActivationEmail()
    {
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = true;
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = false;

      this.errorOccured = false;
      this.errorMessage = '';

      this.sending = true;

      const jsonSendActivationEmailParams = {};
      jsonSendActivationEmailParams['email'] = this.email;
      const jsonSendActivationEmailApiUrl = '/services/jsonSendActivationEmail';
      const jsonSendActivationEmailOutput = await this.performPostHttpRequest(jsonSendActivationEmailApiUrl, jsonSendActivationEmailParams);
      console.log(jsonSendActivationEmailOutput);
      if (jsonSendActivationEmailOutput['status'] != 'SUCCESS')
      {
        this.errorMessage = jsonSendActivationEmailOutput['message'];
        this.errorOccured = true;
        this.sending = false;
        return;
      }

      if (jsonSendActivationEmailOutput['status'] == 'SUCCESS')
      {
        this.errorMessage = '';
        this.errorOccured = false;
        this.sending = false;
        this.sent = true;
        return;
      }
    },
    reset()
    {
      this.email = '';
      this.invalidEmailAddress = false;
      this.errorMessage = '';
      this.errorOccured = false;
      this.sent = false;
    }
  }
}
</script>

<style>
</style>