<template>
  <v-row class="fill-height">
    <v-dialog v-model="dialog" max-width="700px">
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
    <v-col>
      <v-sheet height="64">
        <v-toolbar
            flat
        >
          <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
              bottom
              right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            :key="componentKey"
            v-model="focus"
            color="indigo lighten-2"
            :event-color="getEventColor"
            :events="events"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
          <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
          >
            <v-toolbar
                :color="selectedEvent.color"
                dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon @click="editLecture(selectedEvent)">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon @click="deleteEvent(selectedEvent)">mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span> {{ selectedEvent.start | moment('hh:mm') }} - {{ selectedEvent.end | moment('hh:mm') }}</span>
              <v-spacer></v-spacer>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
      <v-btn fab dark color="green" fixed right bottom>
        <v-icon dark @click="showDialog=true">mdi-plus</v-icon>
        <add-lecture-modal v-model="showDialog" :key="componentKey"/>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment';
import UserDataService from "@/services/UserDataService";
import LectureDataService from "@/services/LectureDataService";
import AddLectureModal from "@/components/AddLectureModal";

export default {
  components: {AddLectureModal},
  data() {
    return {
      componentKey: 0,
      message: '',
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      name: null,
      details: null,
      start: null,
      end: null,
      color: "indigo",
      currentlyEditing: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      lectures: [],
      events: [],
      dialog: false,
      lecturer: null,
      showDialog: false,
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
  mounted() {
    this.getLectures(this.$route.params.id);
    this.getStudents();
    this.editedLecture.lecturer = this.$store.state.auth.userData._id;
  },
  computed: {
    formTitle() {
      return this.editedId === -1 ? "New Lecture" : "Edit Lecture";
    },
  },
  methods: {
    getLectures(id) {
      if (this.$store.state.auth.userData.role === 4 && this.$store.state.auth.userData.userId === id) {
        this.getLecturerLectures(id);
      } else {
        this.getUserLectures(id);
      }
    },
    getUserLectures(id) {
      UserDataService.getLectures(id)
        .then((response) => {
          this.lectures = response.data;
          let events = [];
          this.lectures.forEach(lecture => {
            let event = {};
            let startTime = lecture.date;
            let name = lecture.type;
            event.lecturer = lecture.lecturer
            event.start = moment(startTime).format("YYYY-MM-DD hh:mm");
            event.end = moment(startTime).add(1, 'hours').add(30, 'minutes').format("YYYY-MM-DD hh:mm")
            event.name = name;
            event.id = lecture._id;
            if (name === 'Teorija')
              event.color = '#ff3232'
            else event.color = '#2E56E7'
            events.push(event);
          })
          this.events = events;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getLecturerLectures(id) {
      LectureDataService.getAll()
          .then((response) => {
            this.lectures = response.data;
            let events = [];
            this.lectures.forEach(lecture => {
              if (lecture.lecturer && lecture.lecturer._id === id) {
                let event = {};
                let startTime = lecture.date;
                let name = lecture.type;
                event.lecturer = lecture.lecturer
                event.start = moment(startTime).format("YYYY-MM-DD hh:mm");
                event.end = moment(startTime).add(1, 'hours').add(30, 'minutes').format("YYYY-MM-DD hh:mm")
                event.name = name;
                event.id = lecture._id;
                event.students = lecture.students;
                if (name === 'Teorija')
                  event.color = '#ff3232'
                else event.color = '#2E56E7'
                events.push(event);
              }
            })
            this.events = events;
          })
          .catch((e) => {
            console.log(e);
          });
    },
    getEventColor(event) {
      return event.color
    },
    deleteEvent(event) {
      LectureDataService.delete(event.id)
        .catch((e) => {
          if (e.response) {
            this.message = e.response.statusText;
          }
        });
      this.selectedOpen = false
      this.refreshList()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    refreshList() {
      this.componentKey += 1;
    },
    editLecture (event) {
      console.log(event)
      this.dialog = true
      this.editedId = event.id
      this.editedLecture.type = event.name
      this.editedLecture.id = event.id
      this.editedLecture.lecturer = event.lecturer._id
      this.editedLecture.students = event.students
      this.time = this.$moment(event.start.substr(0,10)).toISOString()
      this.date = event.start.substr(11,5)
      console.log(this.time)
      console.log(this.date)
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedLecture = Object.assign({}, this.defaultLecture);
        this.editedId = -1;
      });
    },
    save() {
      if (this.editedId === -1) {
        if (this.$refs.form.validate()) {
          let dateArr = this.date.split('-');
          let timeArr = this.time.split(':');
          let currentDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1]);
          this.editedLecture.date = this.$moment(currentDate).format();
          LectureDataService.create(this.editedLecture)

          this.close();
        }
      } else {
        if (this.$refs.form.validate()) {
          let dateArr = this.date.split('-');
          let timeArr = this.time.split(':');
          let currentDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1]);
          this.editedLecture.date = this.$moment(currentDate).format();
          LectureDataService.create(this.editedLecture)

          this.close();
        }
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
  }
}
</script>