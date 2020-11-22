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
          <b-nav-item>
            <router-link to="/users">Users</router-link>
          </b-nav-item>
          <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!currentUser">
            <router-link to="/login">Login</router-link>
          </b-nav-item>
          <div v-if="currentUser">
            
            <b-nav-item v-if="currentUser" @click.prevent="logOut()">Logout</b-nav-item>
          </div>
          

          <!-- <b-nav-item-dropdown right>
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container mt-10">
      <router-view />
    </div>
  
    <v-footer dark padless absolute>
      <v-card flat tile class="dark lighten-1 dark--text text-center" width="100%">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-5 white--text"
            icon
          >
            <v-icon size="24px">
              {{icon}}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
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
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>