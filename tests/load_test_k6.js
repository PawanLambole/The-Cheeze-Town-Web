
import http from 'k6/http';
import { check, sleep } from 'k6';

// Install k6: https://k6.io/docs/get-started/installation/
// Run: k6 run --vus 20 --duration 30s tests/load_test_k6.js

// Configuration
const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const ANON_KEY = 'sb_publishable_l2p6m13fqhlAC4unPTnulg_gK69Qict'; // Replace with your ANON KEY if different

export const options = {
    // Key configurations for load test
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
        http_req_failed: ['rate<0.01'],    // http errors should be less than 1%
    },
};

export default function () {
    const url = `${SUPABASE_URL}/rest/v1/menu_items?select=count&limit=1`;

    const params = {
        headers: {
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${ANON_KEY}`,
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}
