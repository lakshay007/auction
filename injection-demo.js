const fetch = require('node-fetch');

async function demonstrateInjectionAttacks() {
    const API_URL = 'http://localhost:3000/api';
    
    console.log('Starting Injection Attack Demonstration\n');

    const attacks = [
        // NoSQL Injection attempts
        {
            name: 'NoSQL Injection - $where',
            endpoint: '/auth/login',
            payload: {
                username: { $where: 'this.password == "hacked"' },
                password: 'anything'
            }
        },
        {
            name: 'NoSQL Injection - $ne',
            endpoint: '/auth/login',
            payload: {
                username: 'admin',
                password: { $ne: null }
            }
        },
        
        // SQL Injection-style attempts
        {
            name: 'SQL Injection Style',
            endpoint: '/auth/login',
            payload: {
                username: "admin' --",
                password: 'anything'
            }
        },
        
        // XSS attempts
        {
            name: 'XSS Attack',
            endpoint: '/auctions',
            payload: {
                title: '<script>alert("xss")</script>',
                description: 'malicious content'
            }
        },
        
        // Command injection attempt
        {
            name: 'Command Injection',
            endpoint: '/auctions',
            payload: {
                title: '; rm -rf /',
                description: 'malicious command'
            }
        }
    ];

    for (const attack of attacks) {
        console.log(`\nAttempting: ${attack.name}`);
        try {
            const response = await fetch(`${API_URL}${attack.endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attack.payload)
            });

            const data = await response.json();
            console.log('Response:', {
                status: response.status,
                data: data
            });
        } catch (error) {
            console.log('Attack failed:', error.message);
        }
    }
}

demonstrateInjectionAttacks();