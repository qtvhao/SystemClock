import { AppBootstrapper, Application } from 'kernel.ts';
import path from 'path';
import { ServiceProvider } from 'support.ts';

export const app = new Application({
    base: path.resolve(__dirname, '../'),                      // Project root
    config: path.resolve(__dirname, '../Config'),              // Configuration files
    database: path.resolve(__dirname, '../Database'),          // Database files or migrations
    resources: path.resolve(__dirname, '../Resources'),        // Views, translations, etc.
    storage: path.resolve(__dirname, '../Storage'),            // Logs, cache, etc.
    lang: path.resolve(__dirname, '../Resources/lang'),        // Language files
    public: path.resolve(__dirname, '../../public'),           // Publicly served assets
}, 'production', true, 'vi-VN');

class AppServiceProvider extends ServiceProvider {
    register(): void {
        console.log(this.app.isLocal())
    }
}

class Bootstrapper extends AppBootstrapper {}

const bootstrapper = new Bootstrapper(app, [AppServiceProvider]);
bootstrapper.bootstrap();
