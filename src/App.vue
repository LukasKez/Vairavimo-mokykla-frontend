<template>
  <div id="app" data-app>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">Driving School</router-link>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/users" class="nav-link">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/users/add" class="nav-link">Add user</router-link>
        </li>
      </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>