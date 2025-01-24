import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { ngExpressEngine } from '@angular/ssr';


export { renderModule } from '@angular/platform-server';
