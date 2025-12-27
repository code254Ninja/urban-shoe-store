# DNS Setup Guide for my-test.co.ke

## Current Status
❌ DNS is NOT configured  
✅ Server is running at 77.237.241.239  
✅ Application is accessible via IP: http://77.237.241.239:9090

## Your Target Configuration

**Domain**: my-test.co.ke  
**Server IP**: 77.237.241.239

## Step-by-Step DNS Configuration

### Step 1: Find Your Domain Registrar

Your domain `my-test.co.ke` is registered with a Kenyan domain registrar. Common registrars in Kenya include:
- **KENIC** (Kenya Network Information Centre)
- **Web4Africa**
- **Truehost**
- **Safaricom**
- **Host Kenya**

You need to log into your domain registrar's control panel.

### Step 2: Access DNS Management

Once logged in:
1. Find "DNS Management" or "DNS Settings" or "Nameservers"
2. Look for "DNS Records" or "Zone File Editor"
3. You should see a list of DNS records

### Step 3: Add A Records

Add these **TWO** A records:

#### Record 1: Root Domain
```
Type: A
Name: @ (or leave blank, or "my-test.co.ke")
Value: 77.237.241.239
TTL: 3600 (or Auto)
```

#### Record 2: WWW Subdomain
```
Type: A
Name: www
Value: 77.237.241.239
TTL: 3600 (or Auto)
```

### Step 4: Visual Example

Your DNS records should look like this:

```
┌──────────┬──────────────────┬──────────────────┬──────┐
│ Type     │ Name/Host        │ Value/Points To  │ TTL  │
├──────────┼──────────────────┼──────────────────┼──────┤
│ A        │ @                │ 77.237.241.239   │ 3600 │
│ A        │ www              │ 77.237.241.239   │ 3600 │
└──────────┴──────────────────┴──────────────────┴──────┘
```

### Step 5: Common Registrar Instructions

#### If Using KENIC Direct:
1. Log in to https://registry.kenic.or.ke
2. Go to "My Domains"
3. Click on "my-test.co.ke"
4. Select "DNS Management"
5. Click "Add Record"
6. Add the two A records above

#### If Using cPanel (Many Kenyan Hosts):
1. Log into cPanel
2. Find "Zone Editor" or "Advanced DNS Zone Editor"
3. Select your domain
4. Click "Add Record" or "+ A Record"
5. Add the two A records above

#### If Using Cloudflare (Recommended):
1. Add your domain to Cloudflare (free)
2. Update nameservers at your registrar to Cloudflare's
3. In Cloudflare DNS:
   - Add A record: `@` → `77.237.241.239`
   - Add A record: `www` → `77.237.241.239`
4. Set both to "Proxied" (orange cloud) or "DNS only" (gray cloud)

### Step 6: Wait for Propagation

**DNS Propagation Time**: 5 minutes to 48 hours (usually 5-60 minutes)

#### Check Propagation Status:

**Method 1: Command Line**
```bash
# Check if DNS has propagated
dig my-test.co.ke
dig www.my-test.co.ke

# Should show: 77.237.241.239
```

**Method 2: Online Tools**
- https://dnschecker.org (check globally)
- https://www.whatsmydns.net
- https://mxtoolbox.com/SuperTool.aspx

**Method 3: Using Our Script**
```bash
./check-dns.sh
```

### Step 7: Verify Configuration

Once propagated, test these URLs:

```bash
# Test domain resolves to correct IP
ping my-test.co.ke
# Should show: 77.237.241.239

# Test website loads
curl -I http://my-test.co.ke:9090

# Test in browser
http://my-test.co.ke:9090
```

## After DNS is Working

### Next Step: Remove Port Number

Update your server to use standard port 80:

```bash
# On your local machine
ssh root@77.237.241.239 "cd /var/www/shoe-store && sed -i 's/9090:80/80:80/' docker-compose.yml && docker compose up -d"
```

Then access at: **http://my-test.co.ke** (no port needed)

### Final Step: Install SSL Certificate

Once DNS is confirmed working:

```bash
./setup-ssl.sh
```

This will:
- Install Let's Encrypt SSL certificate
- Enable HTTPS on port 443
- Auto-redirect HTTP → HTTPS
- Your site will be: **https://my-test.co.ke**

## Troubleshooting

### DNS Not Propagating After 1 Hour?

**Check 1: Verify records are saved**
```bash
# Check if authoritative nameservers know about it
dig my-test.co.ke @ns1.your-registrar.com
```

**Check 2: Confirm nameservers**
```bash
dig NS my-test.co.ke
# Should show your registrar's nameservers
```

**Check 3: Clear local DNS cache**
```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

### Wrong Nameservers?

If your domain uses custom nameservers (not your registrar's), you need to add A records there instead.

**Check current nameservers:**
```bash
dig NS my-test.co.ke
```

### Using Third-Party DNS (e.g., Cloudflare)?

If you're using Cloudflare, AWS Route53, or similar:
1. Add A records in their dashboard
2. Make sure proxy is disabled initially (DNS only)
3. Enable proxy after confirming it works

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ DNS Configuration Quick Reference                   │
├─────────────────────────────────────────────────────┤
│ Domain: my-test.co.ke                              │
│ Server IP: 77.237.241.239                          │
│                                                     │
│ A Record 1: @ → 77.237.241.239                    │
│ A Record 2: www → 77.237.241.239                  │
│                                                     │
│ Current Access: http://77.237.241.239:9090         │
│ After DNS: http://my-test.co.ke:9090              │
│ After Port Change: http://my-test.co.ke            │
│ After SSL: https://my-test.co.ke                   │
└─────────────────────────────────────────────────────┘
```

## Need Help?

If you're stuck:
1. Contact your domain registrar's support
2. Share this guide with them
3. Ask them to add the two A records pointing to 77.237.241.239

Most registrars offer live chat or ticket support.

## Common Kenyan Registrar Support

- **KENIC**: support@kenic.or.ke
- **Web4Africa**: https://web4africa.com/support
- **Truehost**: https://truehost.com/contact
- **Host Kenya**: support@hostkenya.com

---

**Remember**: You can always access your site via IP while waiting for DNS:
**http://77.237.241.239:9090**
