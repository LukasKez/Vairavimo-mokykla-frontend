<template>
  <v-dialog v-model="show" max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">{{formTitle}}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-select
                  :items="lectureTypes"
                  v-model="editedLecture.type"
                  label="Type"
                  color="indigo"
                  item-color="indigo"
                  height="42"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                  v-model="editedLecture.students"
                  :items="students"
                  label="Select"
                  item-value="_id"
                  multiple
                  chips
                  color="indigo"
                  item-color="indigo"
              >
                <template v-slot:item="data">
                  <!-- HTML that describe how select should render items when the select is open -->
                  {{ data.item.name }} {{ data.item.surname }} ({{data.item.office.city}})
                </template>
                <!-- HTML that describe how select should render selected items -->
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" color="indigo lighten-1" dark>
                    <span>{{ item.name + ' ' + item.surname }}</span>
                  </v-chip>
                  <span
                      v-if="index === 1"
                      class="grey--text caption"
                  >
                    (+{{ editedLecture.students.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-date-picker
                  v-model="date"
                  color="indigo lighten-1"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-time-picker
                  v-model="time"
                  color="indigo lighten-1"
                  width="260"
                  format="24hr"
              ></v-time-picker>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UserDataService from "@/services/UserDataService";
import LectureDataService from "@/services/LectureDataService";

export default {
  name: "AddLectureModal",
  props: {
    value: Boolean
  }
  ,
  data() {
    return {
      message: '',
      user: null,
      editedLecture: {
        type: "",
        date: "",
        students: [],
        lecturer: '',
      },
      validator: {
        type: [],
        date: [],
        time: [],
        students: [],
      },
      lectureTypes: [
        {text: 'Teorija', value: 'Teorija'},
        {text: 'Praktika', value: 'Praktika'},
      ],
      students: [],
      editedId: -1,
      date: '',
      time: '',
    }
  },
  methods: {
    close() {
      this.show = false;
      this.$nextTick(() => {
        this.editedLecture = Object.assign({}, this.defaultLecture);
        this.editedId = -1;
      });
    },
    save() {
      if (this.$refs.form.validate()) {
        let dateArr = this.date.split('-');
        let timeArr = this.time.split(':');
        let currentDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1]);
        this.editedLecture.date = this.$moment(currentDate).format();
        LectureDataService.create(this.editedLecture)
        console.log(this.time)
        console.log(this.date)
        this.close();
        this.refresh();
      }
    },
    getStudents() {
      UserDataService.getAll()
          .then((response) => {
            let students = [];
            response.data.forEach(user => {
              if (user.role === 1) {
                students.push(user);
              }
            })
            this.students = students;
          })
          .catch((e) => {
            if (e.response) {
              this.message = e.response.statusText;
            }
          });
    },
    refresh() {
      this.$forceUpdate();
    },
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    userData() {
      return this.$store.state.auth.userData;
    },
    formTitle() {
      return this.editedId === -1 ? "New Lecture" : "Edit Lecture";
    },
  },
  mounted() {
    this.getStudents();
    this.editedLecture.lecturer = this.$store.state.auth.userData._id;
  }
}
</script>

<style scoped>

</style>