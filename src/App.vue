<template>
  <div id="app">
    <!-- Menu -->
    <b-navbar toggleable="md" type="dark" variant="info" class="pr-3">
      <b-navbar-brand to="/" class="m-3">
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
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mr-3">
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
        </b-navbar-nav>
        <b-navbar-nav class="align-items-center">
          <b-icon icon="person-circle" variant="white"></b-icon>
            <b-nav-item-dropdown text="Thuc Nguyen" variant="danger" right>
              <b-dropdown-item to="/user">Account</b-dropdown-item>
              <b-dropdown-item to="/">Cart</b-dropdown-item>
              <b-dropdown-item to="/wishlist">Wishlist</b-dropdown-item>
              <b-dropdown-item to="/">Orders</b-dropdown-item>
              <b-dropdown-item to="/">Transactions</b-dropdown-item>
              <b-dropdown-item to="/">Settings</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- View -->
    <router-view id="routerview"/>  

    <!-- Footer -->
    <div id="footer" class="mt-5 pt-5 pb-5">
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
  </div>
</template>

<style scoped lang="scss">
html,body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
