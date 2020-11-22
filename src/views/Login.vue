<template>
  <v-layout row class="justify-center">
      <v-flex xs4 class="grey lighten-4 ">
        <v-container class="text-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Login</h4>
            </v-card-title>
            <v-form>
            <v-text-field v-model="username" prepend-icon="mdi-account" name="Username" label="Username"></v-text-field>
            <v-text-field v-model="password" prepend-icon="mdi-lock" name="Password" label="Password" type="password"></v-text-field>
            <v-card-actions>
              <v-btn primary large block dark class="indigo" @click="login()">Login</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
        }
    },
    methods: {
        login() {
            console.log(this.username);
        }
    },
}
</script>

<style>

</style>