<template>
  <b-navbar
    type="light"
    fixed="top"
    toggleable="lg"
    :class="['main-nav', transparent ? 'transparent' : '']"
  >
    <b-container>
      <b-navbar-brand class="mx-auto">
        <NuxtLink class="brand" to="/">
          <img src="/icone-white.png" class="logo white" alt="logo" />
          <img src="/icone-black.png" class="logo black" alt="logo" />
          <span class="title-font">ID Protect</span>
        </NuxtLink>
      </b-navbar-brand>

      <!-- Mobile button to collapse the menu -->
      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto my-2 my-lg-0">
          <b-nav-item
            class="item"
            v-for="link in links"
            :key="link.name + link.link"
            :to="link.link"
          >
            <div class="d-none d-lg-block">
              <!-- <b-button variant="outline-dark">{{link.name}}</b-button> -->
              <!-- {{link.name}} -->
                  <b-button :id="link.name + link.link" variant="light" class="mb-2" size="sm">
                    <b-icon :icon="link.icon" variant="secondary"></b-icon>
                      <b-tooltip :target="link.name + link.link" triggers="hover">
                        {{link.name}}
                      </b-tooltip>
                  </b-button>
            </div>
            <div class="link d-lg-none">
              <!-- <b-button variant="outline-dark">{{link.name}}</b-button> -->
              {{link.name}}
            </div>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BNavItem,
  BNavbarNav,
  BNavForm,
  BDropdownItem,
  BNavItemDropdown,
  BCollapse
} from "bootstrap-vue";

export default {
  name: "BaseNavigationBar",
  components: {
    "b-navbar": BNavbar,
    "b-navbar-brand": BNavbarBrand,
    "b-navbar-toggle": BNavbarToggle,
    "b-collapse": BCollapse,
    "b-navbar-nav": BNavbarNav
  },
  props: {
    links: {
      type: Array,
      required: false,
      default: [],
      validator: links => {
        return links.every(
          link => link.hasOwnProperty("name") && link.hasOwnProperty("link")
        );
      }
    },
    transparent: { type: Boolean, required: false, default: false }
  }
};
</script>
<style scoped lang="scss">

.main-nav {
  box-shadow: $box-shadow;
  background-color: $white;
  transition: background-color 0.2s ease;

  .logo {
    width: 30px;
    height: 30px;

    &.white {
      display: none;
    }

    &.black {
      display: inline-block;
    }
  }

  .brand {
    font-family: $font-family-sans-serif;
    font-weight: $font-weight-bold;
    color: $gray-900;
  }

  .item {
    margin: 0 3px;
    color: white;

    & > a {
      padding: 0 !important;
      margin: 0.5rem;
    }
  }

  .link {
    font-family: $font-family-sans-serif;
    font-weight: $font-weight-bold;
    font-size: 0.9rem;
    padding: 0;
    color: rgba($black, 0.8);

    &:hover {
      color: $black;
    }

    &.active {
      color: $black !important;
    }
  }

  @include media-breakpoint-up(lg) {
    background-color: rgba($main-font-color, 0.8);

    &.transparent {
      background-color: rgba(38, 94, 168, 0.3);
    }

    .link {
      color: rgba($white, 0.85);
      margin-bottom: 5px;
      border-bottom: 1px solid white;

      &:hover {
        color: $white;
      }
    }

    .logo {
      width: 30px;
      height: 30px;

      &.white {
        display: inline-block;
      }

      &.black {
        display: none;
      }
    }

    .brand {
      color: fade-out($white, 0.2);

      &:hover {
        color: $white;
      }
    }

    .item:last-child .link {
      padding-right: 0;
    }
  }
}
</style>

