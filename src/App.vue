<template>
  <v-app>
    <v-toolbar app dark>
      <v-toolbar-title class="headline ">
        <span>Vuetify</span>
        <span class="font-weight-light">Material design</span>
        <a class="" href="/">Home</a>
        <a class="" href="/about">About</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>


  </v-app>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    task: "",
    status: "",
    tasks: [],
    options: ["pending", "ongoing", "completed"],
  }),
  created() {
    // fetch tasks
    axios
      .get("http://localhost:3000/tasks")
      .then((response) => (this.tasks = response.data))
      .catch((error) => console.log(error));
  },
  methods: {
    addTask() {
      axios
        .post("http://localhost:3000/tasks", {
          name: this.task,
          status: this.status,
        })
        .then((response) => {
          this.message = response.data;
        });
    },
    deleteTask(taskId) {
      axios
        .delete("http://localhost:3000/tasks/" + taskId)
        .then((response) => {
          console.log(response.data);
      });
    },
  }
};
</script>