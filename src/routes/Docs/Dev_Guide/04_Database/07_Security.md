---
title: "Database Security"
description: "Security best practices for the SvelteCMS database system"
icon: "mdi:database-lock"
published: true
order: 7
---

# Database Security

This guide covers security best practices and implementations for the SvelteCMS database system, including authentication, authorization, encryption, and audit logging.

## Authentication

### Secure Credentials Management

```typescript
interface DatabaseCredentials {
    username: string;
    password: string;
    host: string;
    port: number;
    database: string;
}

class CredentialsManager {
    private static instance: CredentialsManager;
    private credentials: DatabaseCredentials;

    private constructor() {
        this.credentials = this.loadCredentials();
    }

    static getInstance(): CredentialsManager {
        if (!CredentialsManager.instance) {
            CredentialsManager.instance = new CredentialsManager();
        }
        return CredentialsManager.instance;
    }

    private loadCredentials(): DatabaseCredentials {
        return {
            username: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            host: process.env.DB_HOST!,
            port: parseInt(process.env.DB_PORT!, 10),
            database: process.env.DB_NAME!
        };
    }

    getCredentials(): DatabaseCredentials {
        return { ...this.credentials };
    }
}
```

### Connection Security

```typescript
class SecureConnection {
    private static readonly SSL_OPTIONS = {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/path/to/ca.crt'),
        key: fs.readFileSync('/path/to/client-key.pem'),
        cert: fs.readFileSync('/path/to/client-cert.pem')
    };

    static async createConnection(
        credentials: DatabaseCredentials
    ): Promise<any> {
        return new Pool({
            ...credentials,
            ssl: this.SSL_OPTIONS,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 30000
        });
    }
}
```

## Authorization

### Role-Based Access Control

```typescript
enum DatabaseRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER'
}

interface DatabasePermission {
    role: DatabaseRole;
    action: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
    resource: string;
}

class AccessControl {
    private permissions: Map<DatabaseRole, Set<string>>;

    constructor() {
        this.permissions = new Map();
        this.initializePermissions();
    }

    private initializePermissions(): void {
        // Admin permissions
        this.permissions.set(DatabaseRole.ADMIN, new Set([
            'READ:*',
            'WRITE:*',
            'DELETE:*',
            'ADMIN:*'
        ]));

        // Editor permissions
        this.permissions.set(DatabaseRole.EDITOR, new Set([
            'READ:*',
            'WRITE:content',
            'WRITE:media',
            'DELETE:content',
            'DELETE:media'
        ]));

        // Viewer permissions
        this.permissions.set(DatabaseRole.VIEWER, new Set([
            'READ:content',
            'READ:media'
        ]));
    }

    hasPermission(
        role: DatabaseRole,
        action: string,
        resource: string
    ): boolean {
        const rolePermissions = this.permissions.get(role);
        if (!rolePermissions) return false;

        return rolePermissions.has(`${action}:*`) ||
               rolePermissions.has(`${action}:${resource}`);
    }
}
```

### Query Authorization

```typescript
class AuthorizedQueryBuilder {
    constructor(
        private queryBuilder: QueryBuilder,
        private role: DatabaseRole,
        private accessControl: AccessControl
    ) {}

    async execute(): Promise<any> {
        if (!this.authorize()) {
            throw new Error('Unauthorized database operation');
        }

        return await this.queryBuilder.execute();
    }

    private authorize(): boolean {
        const operation = this.queryBuilder.getOperation();
        const resource = this.queryBuilder.getResource();

        return this.accessControl.hasPermission(
            this.role,
            operation,
            resource
        );
    }
}
```

## Data Encryption

### Encryption Service

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly key: Buffer;

    constructor(encryptionKey: string) {
        this.key = Buffer.from(encryptionKey, 'hex');
    }

    encrypt(data: string): {
        encrypted: string;
        iv: string;
        tag: string;
    } {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            encrypted,
            iv: iv.toString('hex'),
            tag: cipher.getAuthTag().toString('hex')
        };
    }

    decrypt(
        encrypted: string,
        iv: string,
        tag: string
    ): string {
        const decipher = createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(tag, 'hex'));

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
```

### Field-Level Encryption

```typescript
class EncryptedField {
    constructor(private encryption: EncryptionService) {}

    async beforeSave(value: string): Promise<object> {
        const { encrypted, iv, tag } = this.encryption.encrypt(value);
        return { encrypted, iv, tag };
    }

    async afterLoad(data: {
        encrypted: string;
        iv: string;
        tag: string;
    }): Promise<string> {
        return this.encryption.decrypt(
            data.encrypted,
            data.iv,
            data.tag
        );
    }
}
```

## Audit Logging

### Audit Trail

```typescript
interface AuditEvent {
    timestamp: Date;
    action: string;
    resource: string;
    userId: string;
    details: object;
    status: 'SUCCESS' | 'FAILURE';
}

class AuditLogger {
    private static readonly SENSITIVE_FIELDS = [
        'password',
        'credit_card',
        'ssn'
    ];

    async log(event: AuditEvent): Promise<void> {
        const sanitizedEvent = this.sanitizeEvent(event);
        await db.collection('audit_logs').insertOne(sanitizedEvent);
    }

    async query(
        filters: Partial<AuditEvent>
    ): Promise<AuditEvent[]> {
        return await db
            .collection('audit_logs')
            .find(filters)
            .sort({ timestamp: -1 })
            .toArray();
    }

    private sanitizeEvent(event: AuditEvent): AuditEvent {
        const sanitized = { ...event };
        
        if (typeof event.details === 'object') {
            sanitized.details = this.sanitizeObject(event.details);
        }

        return sanitized;
    }

    private sanitizeObject(obj: object): object {
        const sanitized = { ...obj };

        for (const [key, value] of Object.entries(sanitized)) {
            if (this.SENSITIVE_FIELDS.includes(key)) {
                sanitized[key] = '[REDACTED]';
            } else if (typeof value === 'object') {
                sanitized[key] = this.sanitizeObject(value);
            }
        }

        return sanitized;
    }
}
```

## SQL Injection Prevention

### Query Parameterization

```typescript
class SafeQueryBuilder {
    private params: any[] = [];
    private paramCount: number = 0;

    constructor(private table: string) {}

    where(field: string, value: any): this {
        this.paramCount++;
        this.params.push(value);
        return this;
    }

    build(): { sql: string; params: any[] } {
        // Build parameterized query
        return {
            sql: this.buildSql(),
            params: this.params
        };
    }

    private buildSql(): string {
        // Implementation with proper parameterization
        return '';
    }
}
```

### Input Validation

```typescript
class QueryValidator {
    private static readonly SQL_INJECTION_PATTERNS = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b)/i,
        /(--)/,
        /(\b(OR|AND)\b\s+\w+\s*=\s*\w+)/i
    ];

    static validate(input: string): boolean {
        return !this.SQL_INJECTION_PATTERNS.some(
            pattern => pattern.test(input)
        );
    }

    static sanitize(input: string): string {
        return input.replace(/[;'"\\]/g, '');
    }
}
```

## Database-Specific Security

### PostgreSQL Security

```typescript
interface PostgresSecurityConfig {
    ssl: {
        mode: 'require' | 'verify-full';
        ca?: string;
        key?: string;
        cert?: string;
    };
    connection: {
        // Maximum time (in milliseconds) to wait for connection
        connectTimeout: number;
        // Maximum time (in milliseconds) to wait for query
        statementTimeout: number;
        // Maximum number of prepared statements
        maxPreparedStatements: number;
    };
}

class PostgresSecurityManager {
    static configureDatabase(pool: Pool): Promise<void> {
        return pool.query(`
            -- Enforce SSL connections
            ALTER SYSTEM SET ssl = on;
            ALTER SYSTEM SET ssl_prefer_server_ciphers = on;
            
            -- Set connection limits
            ALTER SYSTEM SET max_connections = 100;
            ALTER SYSTEM SET superuser_reserved_connections = 3;
            
            -- Set statement timeout (1 minute)
            ALTER SYSTEM SET statement_timeout = 60000;
            
            -- Enable connection tracking
            ALTER SYSTEM SET log_connections = on;
            ALTER SYSTEM SET log_disconnections = on;
            
            -- Enforce row-level security
            ALTER TABLE content ENABLE ROW LEVEL SECURITY;
            ALTER TABLE media ENABLE ROW LEVEL SECURITY;
        `);
    }
}
```

### MySQL Security

```typescript
interface MySQLSecurityConfig {
    ssl: {
        enabled: boolean;
        ca?: string;
        key?: string;
        cert?: string;
        rejectUnauthorized: boolean;
    };
    connection: {
        maxAllowedPacket: number;
        waitTimeout: number;
        maxConnections: number;
    };
}

class MySQLSecurityManager {
    static async configureDatabase(connection: Connection): Promise<void> {
        await connection.query(`
            -- Require secure connections
            SET GLOBAL require_secure_transport = ON;
            
            -- Set connection timeouts
            SET GLOBAL wait_timeout = 600;
            SET GLOBAL interactive_timeout = 600;
            
            -- Set maximum allowed packet size (16MB)
            SET GLOBAL max_allowed_packet = 16777216;
            
            -- Enable binary logging with secure settings
            SET GLOBAL binlog_encryption = ON;
            SET GLOBAL binlog_expire_logs_seconds = 604800;
        `);
    }
}
```

### SQLite Security

```typescript
interface SQLiteSecurityConfig {
    encryption: {
        enabled: boolean;
        key: string;
    };
    pragmas: {
        foreignKeys: boolean;
        journalMode: 'DELETE' | 'WAL' | 'MEMORY';
        synchronous: 'OFF' | 'NORMAL' | 'FULL';
    };
}

class SQLiteSecurityManager {
    static configurePragmas(db: Database): void {
        db.pragma('journal_mode = WAL');
        db.pragma('synchronous = FULL');
        db.pragma('foreign_keys = ON');
        db.pragma('temp_store = MEMORY');
        db.pragma('mmap_size = 30000000000');
    }
}
```

## Advanced Security Features

### Rate Limiting

```typescript
class DatabaseRateLimiter {
    private readonly cache: Map<string, number[]> = new Map();
    private readonly windowMs: number;
    private readonly maxRequeries: number;

    constructor(windowMs = 60000, maxRequeries = 100) {
        this.windowMs = windowMs;
        this.maxRequeries = maxRequeries;
    }

    async checkLimit(userId: string): Promise<boolean> {
        const now = Date.now();
        const userRequeries = this.cache.get(userId) || [];
        
        // Remove old timestamps
        const validRequeries = userRequeries.filter(
            timestamp => now - timestamp < this.windowMs
        );
        
        if (validRequeries.length >= this.maxRequeries) {
            return false;
        }
        
        validRequeries.push(now);
        this.cache.set(userId, validRequeries);
        return true;
    }
}
```

### Connection Pool Security

```typescript
class SecureConnectionPool {
    private static readonly DEFAULT_CONFIG = {
        min: 2,
        max: 10,
        acquireTimeout: 30000,
        createTimeout: 30000,
        destroyTimeout: 5000,
        idleTimeout: 30000,
        reapInterval: 1000,
        createRetryIntervalMillis: 200,
    };

    static create(config: PoolConfig): Pool {
        return new Pool({
            ...this.DEFAULT_CONFIG,
            ...config,
            validate: async (connection: any) => {
                try {
                    // Test connection with lightweight query
                    await connection.query('SELECT 1');
                    return true;
                } catch (error) {
                    return false;
                }
            },
            afterCreate: async (connection: any, done: Function) => {
                try {
                    // Set session-level security settings
                    await connection.query(`
                        SET SESSION sql_mode = 'STRICT_ALL_TABLES';
                        SET SESSION max_execution_time = 30000;
                    `);
                    done(null, connection);
                } catch (error) {
                    done(error, connection);
                }
            }
        });
    }
}
```

### Transaction Security

```typescript
class SecureTransaction {
    private static readonly ISOLATION_LEVELS = {
        READ_UNCOMMITTED: 'READ UNCOMMITTED',
        READ_COMMITTED: 'READ COMMITTED',
        REPEATABLE_READ: 'REPEATABLE READ',
        SERIALIZABLE: 'SERIALIZABLE'
    };

    static async executeTransaction<T>(
        pool: Pool,
        callback: (client: PoolClient) => Promise<T>,
        isolationLevel = this.ISOLATION_LEVELS.SERIALIZABLE
    ): Promise<T> {
        const client = await pool.connect();
        
        try {
            await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
            await client.query('BEGIN');
            
            const result = await callback(client);
            
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
```

### Secure Query Builder

```typescript
class SecureQueryBuilder {
    private readonly allowedOperators = ['=', '!=', '>', '<', '>=', '<=', 'IN', 'LIKE'];
    private readonly params: any[] = [];
    private sql: string = '';

    constructor(private readonly table: string) {}

    select(columns: string[]): this {
        const sanitizedColumns = columns.map(
            col => this.sanitizeIdentifier(col)
        );
        this.sql = `SELECT ${sanitizedColumns.join(', ')} FROM ${this.table}`;
        return this;
    }

    where(conditions: Record<string, any>): this {
        const clauses = Object.entries(conditions).map(([key, value], index) => {
            this.params.push(value);
            return `${this.sanitizeIdentifier(key)} = $${this.params.length}`;
        });
        
        if (clauses.length > 0) {
            this.sql += ` WHERE ${clauses.join(' AND ')}`;
        }
        
        return this;
    }

    private sanitizeIdentifier(identifier: string): string {
        // Remove any non-alphanumeric characters except underscores
        return identifier.replace(/[^a-zA-Z0-9_]/g, '');
    }

    build(): { sql: string; params: any[] } {
        return {
            sql: this.sql,
            params: this.params
        };
    }
}
```

## Security Monitoring

### Query Performance Monitoring

```typescript
interface QueryMetrics {
    sql: string;
    duration: number;
    timestamp: Date;
    user: string;
    status: 'success' | 'error';
}

class QueryMonitor {
    private static readonly SLOW_QUERY_THRESHOLD = 1000; // ms

    static async trackQuery(
        metrics: QueryMetrics
    ): Promise<void> {
        // Log slow queries
        if (metrics.duration > this.SLOW_QUERY_THRESHOLD) {
            await this.logSlowQuery(metrics);
        }

        // Store metrics for analysis
        await db.collection('query_metrics').insertOne(metrics);
    }

    private static async logSlowQuery(
        metrics: QueryMetrics
    ): Promise<void> {
        console.warn(`Slow query detected:
            SQL: ${metrics.sql}
            Duration: ${metrics.duration}ms
            User: ${metrics.user}
            Timestamp: ${metrics.timestamp}
        `);
    }
}
```

## Security Checklist

### Pre-Deployment Security Checklist

1. **Database Configuration**
   - [ ] SSL/TLS encryption enabled
   - [ ] Strong password policies enforced
   - [ ] Connection timeouts configured
   - [ ] Statement timeouts set
   - [ ] Maximum connections limited

2. **Access Control**
   - [ ] Role-based access implemented
   - [ ] Least privilege principle applied
   - [ ] Database users properly configured
   - [ ] Object permissions reviewed
   - [ ] Row-level security enabled

3. **Data Protection**
   - [ ] Sensitive data encrypted
   - [ ] Backup encryption configured
   - [ ] Audit logging enabled
   - [ ] Data retention policies defined
   - [ ] Secure deletion procedures established

4. **Monitoring & Maintenance**
   - [ ] Performance monitoring configured
   - [ ] Security logging enabled
   - [ ] Backup procedures tested
   - [ ] Update procedures documented
   - [ ] Incident response plan created

## Best Practices Implementation

### Secure Connection String

```typescript
class ConnectionStringBuilder {
    private params: Map<string, string> = new Map();

    constructor(
        private readonly config: DatabaseConfig
    ) {
        this.setDefaults();
    }

    private setDefaults(): void {
        this.params.set('sslmode', 'verify-full');
        this.params.set('application_name', 'SvelteCMS');
        this.params.set('connect_timeout', '10');
    }

    withSSL(
        ca: string,
        key: string,
        cert: string
    ): this {
        this.params.set('sslcert', cert);
        this.params.set('sslkey', key);
        this.params.set('sslrootcert', ca);
        return this;
    }

    withTimeout(seconds: number): this {
        this.params.set('connect_timeout', seconds.toString());
        return this;
    }

    build(): string {
        const paramString = Array.from(this.params.entries())
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        return `postgresql://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}?${paramString}`;
    }
}
```

## Next Steps

1. [Troubleshooting Guide](./08_Troubleshooting.md)
2. [API Documentation](./09_API.md)
3. [Development Guidelines](./10_Development.md)
