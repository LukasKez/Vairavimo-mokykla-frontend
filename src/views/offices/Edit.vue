<template>
  <v-layout row class="justify-center">
    <v-alert
        v-if="message"
        type="error"
        dismissible
    >{{ message }}</v-alert>
    <v-flex xs12 sm10 md8 class="grey lighten-4">
      <v-container fluid>
        <v-layout column>
          <v-card>
            <v-card-title class="display-1">
              Edit office
            </v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        v-model="office.city"
                        label="City"
                        :rules="validator.city"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                        v-model="office.address"
                        label="Address"
                        :rules="validator.address"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo lighten-1" text @click="cancel"> Cancel </v-btn>
              <v-btn color="indigo lighten-1" text @click="save"> Save </v-btn>
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
      editedOffice: {
        city: "",
        address: "",
      },
      validator: {
        city: [
          v => !!v || 'City is required',
        ],
        address: [
          v => !!v || 'Address is required',
        ],
      },
      office: {},
      editedId: -1,
    };
  },
  computed: {
  },
  methods: {
    getOffice(id) {
      OfficeDataService.get(id)
          .then((response) => {
            this.office = response.data;
            this.message = '';
          })
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          });
    },
    save() {
      if (this.$refs.form.validate()) {
        OfficeDataService.update(this.office._id, this.office);
        this.$router.push('/offices');
      }
    },
    cancel() {
      this.$router.push('/offices');
    },
  },
  mounted() {
    this.getOffice(this.$route.params.id);
  }
}
</script>