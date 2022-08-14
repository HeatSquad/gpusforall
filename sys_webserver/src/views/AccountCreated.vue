<template>
  <b-container fluid style="border: 1px;">
    <b-row class="justify-content-center">
      <b-row>
          <b-col>
            <b-row style="margin-top: 100px;" align-h="center">
              <h1>An activation email has been sent</h1>
            </b-row>
            <b-row align-h="center">
              <h3>Please check your email to activate your account</h3>
            </b-row>
            <b-row align-h="center">
              <h5>If you did not receive an an email, please <b-link to="/email-activation">click here</b-link></h5>
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
    };
  },
  methods:
  {
  }
}
</script>

<style>
</style>