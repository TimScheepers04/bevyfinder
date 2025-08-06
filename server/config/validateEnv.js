const validateEnv = () => {
    const requiredEnvVars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'JWT_EXPIRE',
        'NODE_ENV',
        'PORT'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        process.exit(1);
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.error('❌ JWT_SECRET must be at least 32 characters long');
        process.exit(1);
    }

    // Validate MongoDB URI format
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
        console.error('❌ MONGODB_URI must be a valid MongoDB connection string');
        process.exit(1);
    }

    // Validate PORT
    const port = parseInt(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
        console.error('❌ PORT must be a valid port number (1-65535)');
        process.exit(1);
    }

    // Validate NODE_ENV
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(process.env.NODE_ENV)) {
        console.error(`❌ NODE_ENV must be one of: ${validEnvs.join(', ')}`);
        process.exit(1);
    }

    console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv; 