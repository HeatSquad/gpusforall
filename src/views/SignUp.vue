<template>
  <b-container fluid style="border: 1px;">
    <b-row class="justify-content-center">
      <b-card class="mt-5">
        <b-row>
          <b-col>
            <b-form-group id="inputGroupFirstName" label="First Name" label-for="inputFirstName">
                <b-form-input id="inputFirstName" v-model="firstName" placeholder="Enter first name" maxLength="100" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupLastName" label="Last Name" label-for="inputLastName">
                <b-form-input id="inputLastName" v-model="lastName" placeholder="Enter last name" maxLength="100" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupDateOfBirth" label="Date of Birth" label-for="inputDateOfBirth">
                <b-form-input id="inputDateOfBirth" v-model="dateOfBirth" type="date" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupEmail" label="Email" label-for="inputEmail">
                <b-form-input id="inputEmail" v-model="email" type="email" placeholder="Enter email" maxLength="320"  required></b-form-input>
                <template v-if="invalidEmailAddress"><span style="color: red">Invalid email</span></template>
            </b-form-group>
            <b-form-group id="inputGroupPassword" label="Password" label-for="inputPassword">
                <b-form-input id="inputPassword" v-model="password" type="password" maxLength="50" required></b-form-input>
            </b-form-group>
            <b-form-group id="inputGroupConfirmPassword" label="Confirm Password" label-for="inputConfirmPassword">
                <b-form-input id="inputConfirmPassword" v-model="confirmPassword" type="password" maxLength="50" required></b-form-input>
                <template v-if="passwordDoesNotMatch"><span style="color: red">Passwords do not match</span></template>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-button
            type="submit"
            :disabled="firstName == '' || lastName == '' || dateOfBirth == '' || email == '' || password == '' || confirmPassword ==''"
            @click="performSignUp"
          >
            Sign Up
          </b-button>
        </b-row>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>

export default {
  data: function() {
    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: '',
      invalidEmailAddress: false,
      passwordDoesNotMatch: false
    };
  },
  methods:
  {
    performSignUp(event)
    {
      event.preventDefault();
      console.log(this.firstName, this.lastName, this.dateOfBirth, this.email, this.password, this.confirmPassword);

      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = true;
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.email)) this.invalidEmailAddress = false;

      if (this.password != this.confirmPassword) this.passwordDoesNotMatch = true;
      if (this.password == this.confirmPassword) this.passwordDoesNotMatch = false;

      if (this.invalidEmailAddress || this.passwordDoesNotMatch) return;

      console.log('Creating new user...');
      const params = {};
      params['first_name'] = this.firstName;
      params['last_name'] = this.lastName;
      params['email'] = this.email;
      params['password'] = this.password;
      const apiUrl = `/jsonCreateNewUser`;
      const jsonCreateNewUserOutput = this.performGetHttpRequest(apiUrl, params);
      console.log(jsonCreateNewUserOutput);
      if (jsonCreateNewUserOutput['status'] != 'SUCCESS') return;
    }
  }
}
</script>

<style>
</style>