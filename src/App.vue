<template>
  <div id="app">
    <!--
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->
    
    <div>
      <b-navbar toggleable="md" type="dark" variant="info" class="pr-3">
        <b-navbar-brand href="/">
          <img src="/images/8bitgpu.jpeg"/> GPUs 4 All
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/about">Specials</b-nav-item>
            <b-nav-item to="/about">Top Sellers</b-nav-item>
            <b-nav-item to="/about">Open box</b-nav-item>
            <b-nav-item to="/about">Upcoming</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
        <b-nav-form class="mr-3">
          <b-row class="mr-3">
            <b-col cols=8>
              <b-form-input size="sm" class="mr-3" placeholder="Search"></b-form-input>
            </b-col>
            <b-col cols=4>
              <b-button size="sm" class="mr-3" type="submit">Search</b-button>
            </b-col>
          </b-row>
        </b-nav-form>
      </b-navbar>
    </div>

    <router-view id="routerview"/>

    <!-- Footer -->
    <div id="footer">
      <b-container class="text-left">
        <b-row>
          <b-col sm="6">
            <h5 class="title">Footer Content</h5>
            <p>Here you can use rows and columns here to organize your footer content.</p>
          </b-col>
          <b-col sm="6">
            <h5 class="title">Links</h5>
            <ul>
              <li class="list-unstyled"><a href="#!">Link 1</a></li>
              <li class="list-unstyled"><a href="#!">Link 2</a></li>
              <li class="list-unstyled"><a href="#!">Link 3</a></li>
              <li class="list-unstyled"><a href="#!">Link 4</a></li>
            </ul>
          </b-col>
        </b-row>
      </b-container>
      <div class="footer-copyright text-center py-3">
        <b-container fluid>
          &copy; 2020 Copyright: <a href="https://www.bootstrap.com"> bootstrap.com </a>
        </b-container>
      </div>
    </div>
    <!-- Footer -->
  </div>
</template>



<style lang="scss">
html,body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: stretch;
}

#routerview{
    flex-grow: 1;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#nav,#footer {
  flex-shrink: 0;
}
</style>
