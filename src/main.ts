// Zone.js is required for Angular's default zone-based change detection.
// Make sure the `zone.js` package is installed (npm install zone.js@~0.15.0).
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
