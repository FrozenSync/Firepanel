// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDz4ySEwQdaXFHN7KnUKmzSvFti1o0qOaE',
    authDomain: 'firebridge-7ba35.firebaseapp.com',
    databaseURL: 'https://firebridge-7ba35.firebaseio.com',
    projectId: 'firebridge-7ba35',
    storageBucket: 'firebridge-7ba35.appspot.com',
    messagingSenderId: '494567369272',
    appId: '1:494567369272:web:cf93d3b00d0f383da354cd'
  },
  actionCodeSettings: {
    url: 'http://localhost:4200/',
    handleCodeInApp: true
  },
  consulUrl: 'http://127.0.0.1:8500/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
