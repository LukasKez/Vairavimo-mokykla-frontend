<template>
  <v-layout row class="justify-center">
    <v-flex xs4 class="grey lighten-4">
      <v-container class="text-center">
        <v-card flat>
          <v-card-title primary-title>
            <h4>Login</h4>
          </v-card-title>
          <v-form ref="form">
            <v-text-field
              v-model="user.username"
              prepend-icon="mdi-account"
              name="Username"
              label="Username"
              :rules="validator.username"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              prepend-icon="mdi-lock"
              name="Password"
              label="Password"
              type="password"
              :rules="validator.password"
            ></v-text-field>
            <v-card-actions>
              <v-btn
                primary
                large
                block
                dark
                class="indigo"
                @click="handleLogin()"
              >
                Login
              </v-btn>
            </v-card-actions>
            <div
              v-if="message"
              class="alert alert-danger"
              role="alert"
            >
              {{ message }}
            </div>
          </v-form>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import User from "../models/User";

export default {
  name: "Login",
  data() {
    return {
      user: new User("", ""),
      message: "",
      validator: {
        username: [(v) => !!v || "Username is required"],
        password: [(v) => !!v || "Password is required"],
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        if (this.user.username && this.user.password) {
          this.$store.dispatch("auth/login", this.user).then(
            () => {
              this.$router.push("/");
            },
            (error) => {
              this.message = error.response.data.message;
            }
          );
        }
      }
    },
  },
};
</script>

<style>
</style>