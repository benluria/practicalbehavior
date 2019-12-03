import { makeStateKey } from '@angular/platform-browser';

export const CACHE_KEYS = {
    content: makeStateKey<string>('PBA_APP_CONTENT'),
    token: makeStateKey<string>('PBA_APP_TOKEN')
}