// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiURL:'http://localhost:3000/api/',
  offset : 0,
  count : 5,
  selected : [5, 10, 50],
  homepage_title:'MEAN MOVIES',
  users_component_title:'List of Users',
  token_storage_key:'The name of the key of token in the browser localstorage',
  actors_html_component_title:'Actors',
  add_actor_html_component_title:'ADD ACTOR',
  add_movie_html_component_title:'ADD MOVIE',
  register_user_html_component_title:'REGISTER USER',
  login_sucess_message:'Welcome,'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
