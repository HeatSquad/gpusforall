<template>
  <b-container fluid style="border: 1px;">
    <b-alert v-model="errorOccured" variant="danger" dismissible fade>
      {{ errorMessage  }}
    </b-alert>
    <b-row class="justify-content-center">
      <b-card v-if="!userAccountCreated" class="mt-5" style="width: 25%;">
        <b-row>
          <b-col>
            <b-form-group id="inputGroupUserName" label="User Name" label-for="inputUserName">
                <b-form-input id="inputUserName" v-model="userName" placeholder="Enter user name" maxLength="100" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupEmail" label="Email" label-for="inputEmail">
                <b-form-input id="inputEmail" v-model="email" type="email" placeholder="Enter email" maxLength="320"  required></b-form-input>
                <template v-if="invalidEmailAddress"><span style="color: red">Invalid email</span></template>
            </b-form-group>
            <b-form-group id="inputGroupActivationCode" label="Activation Code" label-for="inputActivationCode">
                <b-form-input id="inputActivationCode" v-model="activationCode" placeholder="Enter activation code" maxLength="50" required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-button
            type="submit"
            :disabled="userName == '' || email == '' || activationCode == ''"
            @click="activateUser"
          >
            Activate
          </b-button>
        </b-row>
      </b-card>
      <b-row v-else class="justify-content-center">
          <b-col>
            <b-row style="margin-top: 100px;" align-h="center">
              <h1>Your account has been activated</h1>
            </b-row>
            <b-row align-h="center">
              <h5>To access your account, please <b-link to="/login">log in</b-link></h5>
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
      userName: '',
      email: '',
      activationCode: '',
      invalidEmailAddress: false,
      errorMessage: '',
      errorOccured: false,
      userAccountCreated: false,
    };
  },
  methods:
  {
    async activateUser()
    {
      this.errorMessage = '';
      this.errorOccured = false;

      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = true;
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = false;

      const jsonActivateAccountParams = {};
      jsonActivateAccountParams['userName'] = this.userName;
      jsonActivateAccountParams['email'] = this.email;
      jsonActivateAccountParams['activationCode'] = this.activationCode;
      
      // Within the API, verify userName and email, then hash the activationCode using the salt 
      const jsonActivateAccountApiUrl = '/jsonVerifyUser';
      const jsonActivateAccountOutput = await this.performPostHttpRequest(jsonActivateAccountApiUrl, jsonActivateAccountParams);
      console.log(jsonActivateAccountOutput);
      if (jsonActivateAccountOutput['status'] != 'SUCCESS')
      {
        this.errorMessage = jsonActivateAccountOutput['message'];
        this.errorOccured = true;
        return;
      }

      if (jsonActivateAccountOutput['status'] == 'SUCCESS')
      {
        this.errorMessage = '';
        this.errorOccured = false;
        this.userAccountCreated = true;
      }
    }
  }
}
</script>

<style>
</style>