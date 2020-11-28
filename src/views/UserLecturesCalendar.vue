<template>
  <v-row class="fill-height">
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
                <v-icon>mdi-pencil</v-icon>
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
        <add-lecture-modal v-model="showDialog"/>
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
    }
  },
  mounted() {
    this.getLectures(this.$route.params.id);
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
            console.log(response.data)
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
                if (name === 'Teorija')
                  event.color = '#ff3232'
                else event.color = '#2E56E7'
                events.push(event);
              }
            })
            this.events = events;

            console.log(this.events)
          })
          .catch((e) => {
            console.log(e);
          });
    },
    setEvents() {
      console.log(this.lectures)
      for (let i = 0; i < (this.lectures).length; i++) {
        this.events[i].start = this.lectures[i].date;
        this.events[i].name = this.lectures[i].type;
        console.log(this.events[i])
      }
    },
    getEventColor(event) {
      return event.color
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
  }
}
</script>