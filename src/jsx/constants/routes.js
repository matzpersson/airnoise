import Search from '../containers/Search.jsx';
import Intro from '../containers/Intro.jsx';
import Movements from '../containers/Movements.jsx';

export const rootRoutes = [
  {
    path: "/",
    exact: true,
    component: Movements,
    title: "Movements",
    authRequired: false
  },
  {
    path: "/intro",
    exact: true,
    component: Intro,
    title: "Intro",
    authRequired: false
  },
  {
    path: "/search",
    exact: true,
    component: Search,
    title: "Search",
    authRequired: false
  }
];
