<template>
  <!-- <div class="d-flex justify-center">
      <h1 id="addTask">Add Task</h1>
    </div>
    <div class="d-flex justify-center mb-4">
      <v-col cols="4">
        <v-text-field v-model="task" label="Task name" solo hide-details />
      </v-col>
      <v-col cols="4">
        <v-select
          :items="options"
          v-model="status"
          label="Select status"
          single-line
          item-text="name"
          item-value="id"
          solo
          hide-details
        />
      </v-col>
    </div>
    <div class="d-flex justify-center">
      <v-btn @click="addTask()" color="primary" class="mb-5">Add Task</v-btn>
    </div>

     <div class="d-flex justify-center">
      <h1>Tasks</h1>
    </div>
    <div v-for="task in tasks" :key="task._id">
      <v-card class="mx-auto my-4" color="white" dark max-width="800">
        <v-card-text class="font-weight-bold title blue--text">
          {{ task.name }}
          {{ task.status.toString() }}
          <v-list-item id="task-list-item" class="grow">
            <v-btn @click="completeTodo(task._id)" class="mx-2" small color="green">Update(NYI)</v-btn>
            <v-btn @click="deleteTask(task._id)" class="mx-2" small color="red">Delete</v-btn>
          </v-list-item>
        </v-card-text>
      </v-card>
    </div> -->
  <h1>Welcome to the Driving school managment system</h1>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
}
</script>
