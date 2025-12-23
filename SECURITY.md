# Security Policy

## Supported Versions

Currently supported versions of GrowMore:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. Do Not Disclose Publicly

Please **do not** create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send an email to: **security@growmore.com** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### 3. What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll assess the issue within 7 days
- **Updates**: You'll receive regular updates on the fix progress
- **Credit**: We'll credit you in the security advisory (unless you prefer anonymity)

### 4. Responsible Disclosure

We ask that you:
- Give us reasonable time to fix the issue before public disclosure
- Make a good faith effort to avoid privacy violations and data destruction
- Don't exploit the vulnerability beyond what's necessary to demonstrate it

## Security Best Practices

When using GrowMore:

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique JWT secrets in production
   - Rotate secrets regularly

2. **Database**
   - Use strong MongoDB credentials
   - Enable MongoDB authentication in production
   - Regularly backup your data

3. **Deployment**
   - Always use HTTPS in production
   - Keep dependencies updated
   - Use environment-specific configurations

4. **Authentication**
   - Enforce strong password policies
   - Implement rate limiting on auth endpoints
   - Monitor for suspicious login attempts

## Known Security Considerations

- File uploads are stored locally - implement virus scanning for production
- JWT tokens don't expire on logout - implement token blacklisting for production
- CORS is configured for development - restrict origins in production

## Security Updates

Security patches will be released as soon as possible after a vulnerability is confirmed. Monitor the [CHANGELOG](CHANGELOG.md) for security updates.

Thank you for helping keep GrowMore and our users safe! 🔒
