const securityLogger = (req, res, next) => {
    // Patterns to detect common injection attempts
    const injectionPatterns = [
      /\$where/i,          // NoSQL injection
      /\$ne/i,             // NoSQL injection
      /\$gt/i,             // NoSQL injection
      /\$lt/i,             // NoSQL injection
      /'--/,               // SQL injection
      /;.*/,               // SQL injection
      /\bdrop\b/i,         // Drop collection/table
      /\bdelete\b/i,       // Delete records
      /\bexec\b/i,         // Command execution
      /\beval\b/i,         // JavaScript evaluation
      /<script>/i,         // XSS attempt
      /javascript:/i,      // XSS attempt
      /\b(admin|root)\b/i  // Privilege escalation attempt
    ];
  
    const checkInjection = (value) => {
      if (typeof value !== 'string') return false;
      return injectionPatterns.some(pattern => pattern.test(value));
    };
  
    const checkObjectForInjection = (obj) => {
      return Object.values(obj).some(value => {
        if (typeof value === 'object' && value !== null) {
          return checkObjectForInjection(value);
        }
        return checkInjection(value);
      });
    };
  
    const suspicious = 
      req.headers['user-agent']?.includes('python-requests') || 
      !req.headers['csrf-token'] ||
      checkObjectForInjection(req.query) ||
      (req.body && checkObjectForInjection(req.body));
  
    if (suspicious) {
      const attackType = [];
      
      if (!req.headers['csrf-token']) {
        attackType.push('CSRF Attack');
      }
      
      if (req.headers['user-agent']?.includes('python-requests')) {
        attackType.push('Automated Attack');
      }
  
      if (checkObjectForInjection(req.query)) {
        attackType.push('Query Injection');
      }
  
      if (req.body && checkObjectForInjection(req.body)) {
        attackType.push('Body Injection');
      }
  
      console.log('🚨 Security Alert:', {
        timestamp: new Date().toISOString(),
        attackTypes: attackType,
        ip: req.ip,
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization ? '[REDACTED]' : undefined
        },
        userAgent: req.headers['user-agent']
      });
    }
    next();
  };
  
  module.exports = securityLogger;