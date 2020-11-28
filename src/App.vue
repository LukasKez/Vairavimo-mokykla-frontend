<template>
  <v-app>
    <b-navbar toggleable="md" type="dark" class="indigo lighten-1 light--text">
      <b-navbar-brand>
        <router-link to="/">
          <img src="./assets/steering-wheel.svg"/>
        </router-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="currentUser && (userData.role > 1)">
            <v-icon dark class="mx-1">mdi-account-multiple</v-icon>
            <router-link to="/users">Users</router-link>
          </b-nav-item>
          <b-nav-item v-if="currentUser && (userData.role > 1)">
            <v-icon dark class="mx-1">mdi-format-list-bulleted</v-icon>
            <router-link to="/lectures">Lectures</router-link>
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!currentUser">
            <v-icon dark class="mx-1">mdi-lock</v-icon>
            <router-link to="/login">Login</router-link>
          </b-nav-item>

          <b-nav-item v-if="currentUser">
            <v-icon dark class="mx-1">mdi-calendar</v-icon>
            <router-link :to="'/users/' + userData.userId + '/lectures'">My lectures</router-link>
          </b-nav-item>

          <b-nav-item v-if="currentUser">
            <v-icon dark class="mx-1">mdi-account</v-icon>
            <router-link :to="'/users/' + userData.userId">My profile</router-link>
          </b-nav-item>

          <b-nav-item v-if="currentUser">
            <v-icon v-if="currentUser" dark class="mx-1">mdi-door-open</v-icon>
            <span @click.prevent="logOut()"> Logout </span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container mt-10" style="min-height: 100vh">
      <router-view />
    </div>
  
    <v-footer dark padless style="bottom: 0">
      <v-card flat tile class="flex dark lighten-1 dark--text text-center" width="100%">
        <v-card-title class="justify-center pa-2">
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            dark
            icon
          >
            <v-icon size="24px">
              {{icon}}
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-divider class="ma-1"></v-divider>

        <v-card-text class="py-2 white--text">
          {{ new Date().getFullYear() }} — <strong>Lukas Keževičius</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    userData() {
      return this.$store.state.auth.userData;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  }
}
</script>