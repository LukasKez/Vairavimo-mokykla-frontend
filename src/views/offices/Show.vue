<template>
  <v-layout row class="justify-center">
    <v-flex xs12 sm10 md8>
      <v-alert
          v-if="message"
          type="error"
          dismissible
      >{{ message }}
      </v-alert>
    </v-flex>
    <v-flex xs12 sm10 md8 class="grey lighten-4">
      <v-container fluid>
        <v-layout column>
          <v-card>
            <v-card-title class="display-1">
              Office information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  ID
                </v-col>
                <v-col cols="6" class="title">
                  {{ office._id }}
                </v-col>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  City
                </v-col>
                <v-col cols="6" class="title">
                  {{ office.city }}
                </v-col>
                <v-col cols="6" align="right" class="font-weight-medium title">
                  Address
                </v-col>
                <v-col cols="6" class="title">
                  {{ office.address }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-center">
              <router-link :to="'/offices/' + office._id + '/users'">
                <v-btn class="indigo lighten-1 ma-2" dark> Users</v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import OfficeDataService from "@/services/OfficeDataService";

export default {
  data() {
    return {
      message: '',
      office: {},
      editedId: -1,
    };
  },
  methods: {
    getOffice(id) {
      OfficeDataService.get(id)
        .then((response) => {
          this.office = response.data;
          this.message = '';
        })
        .catch((e) => {
          console.log(e);
          if (e.response) {
            this.message = e.response.statusText;
          }
        });
    },
  },
  mounted() {
    this.getOffice(this.$route.params.id);
  }
}
</script>