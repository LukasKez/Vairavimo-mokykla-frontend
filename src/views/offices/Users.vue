<template>
  <v-card>
    <v-alert
        v-if="message"
        type="error"
        dismissible
    >{{ message }}</v-alert>
    <v-card-title>
      Office users
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          label="Search"
          append-icon="mdi-magnify"
          single-line
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        :search="search"
        class="elevation-1"
    >
      <template v-slot:[`item.role`]="{ item }">
        {{item.role == 8 ? 'Admin' : item.role == 4 ? 'Lecturer' : 'User'}}
      </template>
      <template v-slot:[`item.created_date`]="{ item }">
        {{item.created_date | moment('YYYY-MM-DD, HH:mm')}}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="userProfile(item)"
        >
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import OfficeDataService from "@/services/OfficeDataService";

export default {
  data() {
    return {
      message: '',
      users: [],
      search: "",
      headers: [
        { text: "Surname", value: "surname" },
        { text: "Username", value: "username" },
        { text: "Role", value: "role" },
        { text: "Created at", value: "created_date" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    getOfficeUsers(id) {
      OfficeDataService.getUsers(id)
          .then((response) => {
            this.users = response.data;
          })
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          });
    },
    userProfile(item) {
      this.$router.push({ name: 'user-profile', params:{id: item._id} });
    }
  },
  mounted() {
    this.getOfficeUsers(this.$route.params.id);
    this.$forceUpdate();
  },
};
</script>
