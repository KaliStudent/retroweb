# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in the Base44 to Supabase SDK, please report it responsibly.

### How to Report

1. **Do NOT create a public GitHub issue** for security vulnerabilities
2. Email us directly at: info@ai-automators.org
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 24 hours
- **Assessment**: We'll assess the vulnerability within 72 hours
- **Updates**: We'll provide regular updates on our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days

### Security Best Practices

When using this SDK:

1. **Environment Variables**: Never commit Supabase keys to version control
2. **Row Level Security**: Always enable RLS on your Supabase tables
3. **Service Role Key**: Protect your service role key - it bypasses RLS
4. **Input Validation**: Validate all user inputs before database operations
5. **HTTPS Only**: Always use HTTPS in production environments

### Scope

This security policy covers:

- The Base44 to Supabase SDK code
- Integration implementations
- Authentication and authorization flows
- Data handling and storage

This policy does NOT cover:

- Vulnerabilities in Supabase itself
- Issues with your Base44 application code
- Third-party integrations you implement
- Infrastructure security (your servers, databases, etc.)

Thank you for helping keep the Base44 to Supabase SDK secure!
