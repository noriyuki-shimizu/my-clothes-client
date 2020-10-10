import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import Vue, { VueConstructor } from 'vue';

export default {
    init: (Vue: VueConstructor<Vue>) => {
        Sentry.init({
            dsn: process.env.VUE_APP_SENTRY_DSN,
            integrations: [
                new VueIntegration({
                    Vue,
                    tracing: true
                }),
                new Integrations.BrowserTracing()
            ],

            // We recommend adjusting this value in production, or using tracesSampler
            // for finer control
            tracesSampleRate: 1.0
        });
    }
};
