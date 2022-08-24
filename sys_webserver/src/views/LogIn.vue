<template>
  <b-container fluid style="border: 1px;">
    <b-alert v-model="errorOccured" variant="danger" dismissible fade>
      {{ errorMessage  }}
    </b-alert>
    <b-row class="justify-content-center">
      <b-card  v-if="!userAccountCreated" class="mt-5" style="width: 25%;">
        <b-row>
          <b-col>
            <b-form-group id="inputGroupUserName" label="User Name" label-for="inputUserName">
                <b-form-input id="inputUserName" v-model="userName" placeholder="Enter user name" maxLength="100" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupPassword" label="Password" label-for="inputPassword">
                <b-form-input id="inputPassword" v-model="password" type="password" maxLength="50" required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        
        <b-row class="mb-3">
          <b-col class="text-left"><b-link to="/forgot-username">Forgot your user name?</b-link></b-col>
          <b-col class="text-right"><b-link to="/forgot-password">Forgot your password?</b-link></b-col>
        </b-row>

        <b-row class="justify-content-center">
          <b-button
            type="submit"
            :disabled="userName == '' || firstName == '' || lastName == '' || dateOfBirth == '' || email == '' || password == '' || confirmPassword == '' || creatingUser"
            @click="performSignUp"
          >
            Log In
          </b-button>
        </b-row>

        <b-row class="justify-content-center">
          <p>Don't have an account? <b-link to="/signup">Sign Up</b-link></p>
        </b-row>

        <b-row class="justify-content-center">
          <b-link to="/email-activation">Need another activation email?</b-link>
        </b-row>

      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data: function() {
    return {
      userName: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: '',
      invalidEmailAddress: false,
      passwordDoesNotMatch: false,
      errorMessage: '',
      errorOccured: false,
      userAccountCreated: false,
      creatingUser: false,
    };
  },
  mounted: async function()
  {
    
  },
  methods:
  {
    async performSignUp()
    {
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = true;
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = false;

      if (this.password != this.confirmPassword) this.passwordDoesNotMatch = true;
      if (this.password == this.confirmPassword) this.passwordDoesNotMatch = false;

      if (this.invalidEmailAddress || this.passwordDoesNotMatch) return;

      this.creatingUser = true;

      const jsonCreateNewUserParams = {};
      jsonCreateNewUserParams['user_name'] = this.userName;
      jsonCreateNewUserParams['first_name'] = this.firstName;
      jsonCreateNewUserParams['last_name'] = this.lastName;
      jsonCreateNewUserParams['dob'] = this.dateOfBirth;
      jsonCreateNewUserParams['email'] = this.email;
      jsonCreateNewUserParams['password'] = this.password;
      const jsonCreateNewUserApiUrl = `/services/jsonCreateNewUser`;
      const jsonCreateNewUserOutput = await this.performPostHttpRequest(jsonCreateNewUserApiUrl, jsonCreateNewUserParams);
      console.log(jsonCreateNewUserOutput);
      if (jsonCreateNewUserOutput['status'] != 'SUCCESS')
      {
        this.errorMessage = jsonCreateNewUserOutput['message'];
        this.errorOccured = true;
        this.creatingUser = false;
        return;
      }

      if (jsonCreateNewUserOutput['status'] == 'SUCCESS')
      {
        this.errorMessage = '';
        this.errorOccured = false;
      }

      // Generate an activation code (more chars, more secure; they can break the salt)
      // Generate random codes (look for a package native to node; try not to import a package elsewhere; less 3rd party)
      // Maybe use Math.random() to generate random numbers or letters (or both to make it more secure)
      // Generate 6 random chars (make it alphanumeric; no special chars)
      // This will be in the logic of sending the email
      // Use crypto helper (read cryptoHashMessage256Bit and try to understand it)
      // Basically hashing the message. We're shifting / transforming in a way that it is transformed into something else
      // but we're not encrypting it (if we encrypt it we can decrypt it).
      // Encrypt (cypher into some text) but this is not encrypting. We can't get back to the OG value.
      // The message/activation code (the first param) will be the 6 alphanumeric char string
      // This will be what we hash and also we'll have to provide a salt in order for us to avoid
      // pre-calculated values.
      // 123456 (doesn't take long for someone else to figure this out using there hash function)
      // With a salt we add more chars to it so that they can't pre-compute it basically
      // Basically we need to provide a salt so we use another function Thuc created (cryptoRandomBytes)
      // Take a look and follow logic
      // Goal: generate an act code, hash code w/ salt, and save hash value into some property within json_ column for that user
      // When sending email, you provide the act code and give them a link a page
      // This page we need to build, and you just enter the act code and check if it's correct...
      // Prompt user to also ask for username and email too
      // Annoying for user but only needed once anyways
      // Then if correct, set the verified value to 1
      // This act code should have an expiration date
      // Right when the code is generated, generate an expire date & time
      // E.g. Date now() + 1 day = tomorrow

      const jsonSendActivationEmailParams = {};
      jsonSendActivationEmailParams['email'] = this.email;
      const jsonSendActivationEmailApiUrl = '/jsonSendActivationEmail';
      const jsonSendActivationEmailOutput = await this.performPostHttpRequest(jsonSendActivationEmailApiUrl, jsonSendActivationEmailParams);
      console.log(jsonSendActivationEmailOutput);
      if (jsonSendActivationEmailOutput['status'] != 'SUCCESS')
      {
        this.errorMessage = jsonSendActivationEmailOutput['message'];
        this.errorOccured = true;
        this.creatingUser = false;
        return;
      }

      if (jsonSendActivationEmailOutput['status'] == 'SUCCESS')
      {
        this.errorMessage = '';
        this.errorOccured = false;
        this.userAccountCreated = true;
        this.$router.push({ name: 'Account Created' })
      }
    }
  }
}
</script>

<style>
</style>