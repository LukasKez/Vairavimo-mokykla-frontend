<template>
  <v-layout row class="justify-center">
    <v-alert
        v-if="message"
        type="error"
        dismissible
    >{{ message }}</v-alert>
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit user</span>
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
<!--              <v-col cols="12" sm="6" md="6">-->
<!--                <v-text-field-->
<!--                    v-model="editedUser.password"-->
<!--                    label="Password"-->
<!--                    type="password"-->
<!--                    :rules="validator.password"-->
<!--                    required-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
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
    <v-flex v-if="user" xs12 sm10 md8 class="grey lighten-4">
      <v-container fluid>
        <v-layout column>
          <v-card>
            <v-card-title class="display-1">
              User profile
              <v-spacer></v-spacer>
              <v-chip color="yellow darken-2">
                {{ user.role == 8 ? 'Admin' : user.role == 4 ? 'Lecturer' : 'User' }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-row>
                  <v-col cols="6" align="right" class="font-weight-medium title">
                    ID
                  </v-col>
                  <v-col cols="6" class="title">
                    {{ user._id }}
                  </v-col>
                </v-row>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  Name
                </v-col>
                <v-col cols="6" class="title">
                  {{ user.name }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  Surname
                </v-col>
                <v-col cols="6" class="title">
                  {{ user.surname }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  Username
                </v-col>
                <v-col cols="6" class="title">
                  {{ user.username }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn dark class="ma-2 indigo lighten-1" @click="editUser()"> Edit </v-btn>
              <router-link :to="'/users/' + user._id + '/lectures'">
                <v-btn class="indigo lighten-1 ma-2" dark> Lectures </v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import UserDataService from "@/services/UserDataService";
import OfficeDataService from "@/services/OfficeDataService";

export default {
  data() {
    return {
      dialog: false,
      message: '',
      user: null,
      editedUser: {
        name: "",
        surname: "",
        username: "",
        password: "",
        role: 1,
        office: 0,
      },
      validator: {
        name: [],
        surname: [],
        username: [],
        password: [],
        role: 0,
        office: [],
      },
      roles: [
        { text: 'User', value: 1},
        { text: 'Lecturer', value: 4},
        { text: 'Admin', value: 8},
      ],
      offices: [],
      editedId: -1,
    };
  },
  computed: {
  },
  methods: {
    getUser(id) {
      UserDataService.get(id)
          .then((response) => {
              this.user = response.data;
              this.message = '';
          })
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          });
    },
    getOffices() {
      OfficeDataService.getAll()
          .then((response) => {
            this.offices = response.data;
          })
          .catch((e) => {
            console.log(e);
          });
    },
    editUser () {
      this.dialog = true
      this.editedId = this.user._id
      this.editedUser = this.user
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedId = -1;
      });
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedId !== -1) {
          UserDataService.update(this.editedId, this.editedUser);
        }
        this.close();
        this.refresh();
      }
    },
    refresh() {
      // this.getUser(this.user._id);
    },
  },
  mounted() {
    this.getUser(this.$route.params.id);
    this.getOffices();
  }
}
</script>