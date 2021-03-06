// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    users: 'https://jsonplaceholder.typicode.com/users/',
    posts: 'https://jsonplaceholder.typicode.com/posts/',
    albums: 'https://jsonplaceholder.typicode.com/albums/',
    photos: 'https://jsonplaceholder.typicode.com/photos/',
    doxorder: 'https://doxorder-login.herokuapp.com/',
    client_id: 'doxorder_client_id',
    client_secret: 'doxorder_client_secret',
    rollbar_token: '7edb57c54452493eac8c868da21682b6',
    capture_uncaught: true,
    capture_unhandled_rejections: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
