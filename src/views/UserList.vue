<template>
  <v-card>
    <v-card-title>
      Registered users
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Search"
        append-icon="mdi-magnify"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark class="mb-2 indigo" v-bind="attrs" v-on="on">
            New User
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedUser.name"
                    label="Name"
                    :rules="validator.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedUser.surname"
                    label="Surname"
                    :rules="validator.surname"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedUser.username"
                    label="Username"
                    :rules="validator.username"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" v-if="editedId == -1">
                  <v-text-field
                    v-model="editedUser.password"
                    label="Password"
                    type="password"
                    :rules="validator.password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    :items="roles"
                    v-model="editedUser.role"
                    label="Role"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    :items="offices"
                    item-text="city"
                    item-value="_id"
                    v-model="editedUser.office"
                    label="Office"
                    :rules="validator.office"
                    required
                  >
                    <template v-slot:selection="data">
                      <!-- HTML that describe how select should render selected items -->
                      {{ data.item.city }}, {{ data.item.address }}
                    </template>
                    <template v-slot:item="data">
                      <!-- HTML that describe how select should render items when the select is open -->
                      {{ data.item.city }}, {{ data.item.address }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this user?</v-card-title>
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
      :items="users"
      :items-per-page="10"
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
        @click="editUser(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteUser(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import UserDataService from "../services/UserDataService";
import OfficeDataService from "../services/OfficeDataService";

export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      users: [],
      search: "",
      headers: [
        { text: "Name", value: "name", align: "start",},
        { text: "Surname", value: "surname" },
        { text: "Username", value: "username" },
        { text: "Role", value: "role" },
        { text: "Created at", value: "created_date" },
        { text: "Actons", value: "actions", sortable: false },
      ],
      title: "",
      editedId: -1,
      editedUser: {
        name: "",
        surname: "",
        username: "",
        password: "",
        role: 1,
        office: 0,
      },
      defaultUser:{
        name: "",
        surname: "",
        username: "",
        password: "",
        role: 1,
        office: 0,
      },
      validator: {
        name: [
          v => !!v || 'Name is required',
        ],
        surname: [
          v => !!v || 'Surname is required',
        ],
        username: [
          v => !!v || 'Username is required',
          v => (v && v.length >= 5) || 'Username must be at least 5 characters long'
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be at least 6 characters long'
        ],
        role: 0,
        office: [
          v => !!v || 'Office is required',
        ],
      },
      roles: [
        { text: 'User', value: 1},
        { text: 'Lecturer', value: 4},
        { text: 'Admin', value: 8},
      ],
      offices: [],
    };
  },
  computed: {
    formTitle() {
      return this.editedId === -1 ? "New User" : "Edit User";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    getOffices() {
      OfficeDataService.getAll()
        .then((response) => {
          this.offices = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.getUsers();
    },

    editUser (user) {
      this.dialog = true
      this.editedId = user._id
      this.editedUser = user
    },

    deleteUser (item) {
      this.editedId = item._id
      this.dialogDelete = true
    },

    deleteUserConfirm () {
      UserDataService.delete(this.editedId)
      this.closeDelete()
      this.refreshList()
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedId = -1;
      });
    },

    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedUser = Object.assign({}, this.defaultUser)
          this.editedId = -1
        })
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedId != -1) {
        UserDataService.update(this.editedId, this.editedUser);
      } else {
        UserDataService.create(this.editedUser);
      }
      this.close();
      this.refreshList();
      }
    },
  },
  mounted() {
    this.getUsers();
    this.getOffices();
  },
};
</script>
