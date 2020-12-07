<template>
  <v-card>
    <v-alert
        v-if="message"
        type="error"
        dismissible
    >{{ message }}</v-alert>
    <v-card-title>
      Offices
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          label="Search"
          append-icon="mdi-magnify"
          single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <router-link :to="'/office/create'">
        <v-btn dark class="mb-2 indigo" v-if="userData && userData.role > 4">
          New Office
        </v-btn>
      </router-link>
      <v-dialog v-model="dialogDelete" max-width="550px">
        <v-card>
          <v-card-title class="headline">Are you sure you want to delete this office?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteUserConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="offices"
        :items-per-page="5"
        :search="search"
        class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <router-link :to="'/offices/' + item._id">
          <v-icon
              small
              class="mr-2"
              v-if="userData && userData.role > 0"
          >
            mdi-eye
          </v-icon>
        </router-link>
        <router-link :to="'/offices/' + item._id + '/edit'">
          <v-icon
              small
              class="mr-2"
              v-if="userData && userData.role > 4"
          >
            mdi-pencil
          </v-icon>
        </router-link>
        <v-icon
            small
            v-if="userData && userData.role > 4"
            @click="deleteOffice(item)"
        >
          mdi-delete
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
      dialogDelete: false,
      search: "",
      headers: [
        { text: "City", value: "city" },
        { text: "Address", value: "address" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      title: "",
      editedId: -1,
      offices: [],
    };
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData;
    },
  },
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
    $route(to, from) { // react to route changes...
      if(to !== from) {
        location.reload();
      }
    }
  },
  methods: {
    getOffices() {
      OfficeDataService.getAll()
          .then((response) => {
            this.offices = response.data;
          })
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          });
    },

    deleteOffice(item) {
      this.editedId = item._id
      this.dialogDelete = true
    },

    deleteUserConfirm () {
      OfficeDataService.delete(this.editedId)
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          })
      this.closeDelete()
    },

    closeDelete () {
      this.dialogDelete = false
    },

    showOffice(item) {
      this.$router.push({ name: 'user-profile', params:{id: item._id} });
    }
  },
  mounted() {
    this.getOffices();
  },
};
</script>
