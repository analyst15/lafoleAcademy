export interface TechnicalBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  pages: number;
  language: 'Somali & English' | 'Somali' | 'English';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  year: number;
  coverUrl: string;
  badge?: string;
  downloadSize: string;
  description: string;
  chapters: string[];
}

export const TECHNICAL_BOOKS: TechnicalBook[] = [
  {
    id: 'book-ccna',
    title: 'Cisco CCNA 200-301: Handbook & Somali Lab Manual',
    subtitle: 'Hagaha Dhameystiran ee Cisco Routing & Switching',
    author: 'Eng. Abdullahi Farah & Lafole Tech Press',
    category: 'Networking',
    pages: 480,
    language: 'Somali & English',
    level: 'Beginner',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    downloadSize: '14.2 MB',
    description: 'Buuggan wuxuu si qoto dheer u sharaxayaa aasaaska shabakadaha, IP Subnetting, VLANs, OSPF routing, ACLs, iyo sida loo xalliyo cilladaha Cisco routers iyo switches.',
    chapters: [
      '1. Introduction to Enterprise Networking & TCP/IP',
      '2. Subnetting & Variable-Length Subnet Masks (VLSM)',
      '3. VLANs, Trunking (802.1Q) and Inter-VLAN Routing',
      '4. Spanning Tree Protocol (STP & RSTP)',
      '5. OSPFv2 Routing Protocol Deep Dive',
      '6. Access Control Lists (ACLs) & Network Security',
      '7. Network Automation, REST APIs & Python Scripting'
    ]
  },
  {
    id: 'book-mikrotik',
    title: 'MikroTik RouterOS: ISP Configuration Architecture',
    subtitle: 'Maamulka Bandwidth-ka, Queues, Hotspot & WireGuard',
    author: 'Eng. Mohamed Nour',
    category: 'Networking',
    pages: 360,
    language: 'Somali',
    level: 'Intermediate',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    downloadSize: '9.8 MB',
    description: 'Hagaha ugu faahfaahsan ee ISP-yada Soomaaliya loogu maamulo router-yada MikroTik: Simple Queues, PCQ bandwidth sharing, PPPoE server, iyo WireGuard tunnels.',
    chapters: [
      '1. RouterOS Architecture & WinBox Quick Setup',
      '2. IP Addressing, DHCP Server & DNS Caching',
      '3. Firewall Filters, NAT & Raw Rules',
      '4. Simple Queues & Queue Trees with PCQ',
      '5. PPPoE Server Configuration & RADIUS Integration',
      '6. Site-to-Site VPN with WireGuard & IPsec',
      '7. BGP Multi-homing Basics for Local ISPs'
    ]
  },
  {
    id: 'book-linux',
    title: 'Linux Server Administration: From Terminal to Cloud',
    subtitle: 'Ubuntu, Rocky Linux, Bash Scripting & Security Hardening',
    author: 'Lafole DevOps Team',
    category: 'Linux & Cloud',
    pages: 520,
    language: 'Somali & English',
    level: 'Beginner',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    badge: 'Essential',
    downloadSize: '16.5 MB',
    description: 'Baro adeegsiga terminal-ka Linux, maaraynta faylasha, rukhsadaha (file permissions), systemd services, SSH hardening, iyo qorista Bash scripts.',
    chapters: [
      '1. Linux Architecture & Command Line Mastery',
      '2. Users, Groups & Advanced Linux Permissions',
      '3. Package Management: APT, DNF & Flatpak',
      '4. Networking & Systemd Service Management',
      '5. Shell Scripting & Automation with Bash',
      '6. Nginx & Apache Web Server Deployments',
      '7. Linux Security, UFW, Fail2Ban & Auditd'
    ]
  },
  {
    id: 'book-docker-k8s',
    title: 'Docker & Kubernetes: Production Cloud Deployment',
    subtitle: 'Containerization, Helm Charts & Microservices',
    author: 'Eng. Hassan Warsame',
    category: 'Linux & Cloud',
    pages: 410,
    language: 'English',
    level: 'Advanced',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80',
    downloadSize: '12.4 MB',
    description: 'Comprehensive guide to multi-stage Docker builds, docker-compose orchestration, Kubernetes pods, replica sets, ingress controllers, and zero-downtime rolling updates.',
    chapters: [
      '1. Containers vs Virtual Machines',
      '2. Dockerfile Optimization & Multi-Stage Builds',
      '3. Multi-Container Apps with Docker Compose',
      '4. Kubernetes Architecture: Master & Worker Nodes',
      '5. Deployments, Services & Ingress NGINX',
      '6. ConfigMaps, Secrets & Persistent Volumes',
      '7. CI/CD GitOps with ArgoCD & GitHub Actions'
    ]
  },
  {
    id: 'book-cybersecurity',
    title: 'Ethical Hacking & Network Defense in Practice',
    subtitle: 'Kali Linux, Wireshark, Metasploit & OWASP Top 10',
    author: 'Eng. Omar Jibril (Lafole CyberLab)',
    category: 'Cybersecurity',
    pages: 460,
    language: 'Somali & English',
    level: 'Intermediate',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    badge: 'Lab Companion',
    downloadSize: '18.1 MB',
    description: 'Buug si tijaabo ah ku baraya baadhista nuglaanta shabakadaha, jabsiga tijaabada ah (penetration testing), xallinta weerarrada phishing, iyo ilaalinta xogta shirkadaha.',
    chapters: [
      '1. Cybersecurity Fundamentals & CIA Triad',
      '2. Reconnaissance & Network Scanning with Nmap',
      '3. Vulnerability Scanning with OpenVAS & Nessus',
      '4. Exploitation with Metasploit Framework',
      '5. Packet Inspection with Wireshark',
      '6. Web Application Vulnerabilities (OWASP Top 10)',
      '7. Incident Response, DFIR & SIEM Monitoring'
    ]
  },
  {
    id: 'book-fullstack',
    title: 'Full-Stack TypeScript: React, Node.js & PostgreSQL',
    subtitle: 'Dhismaha Application-nada Casriga ah ee Dhameystiran',
    author: 'Eng. Sharmaarke Ali',
    category: 'Programming',
    pages: 540,
    language: 'Somali & English',
    level: 'Intermediate',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    badge: 'New Edition',
    downloadSize: '15.9 MB',
    description: 'Hagaha dhismaha SaaS apps casri ah: React 18, Next.js, Express, Prisma ORM, PostgreSQL, JWT Authentication, iyo payment gateway integrations (Somali Mobile Money & Stripe).',
    chapters: [
      '1. TypeScript Fundamentals for Modern Developers',
      '2. React Components, Hooks & State Management',
      '3. Next.js 14 App Router & Server Components',
      '4. RESTful API Design with Express & Node.js',
      '5. PostgreSQL Database Design & Prisma ORM',
      '6. Authentication: JWT, Cookies & OAuth 2.0',
      '7. Deploying to Cloud & Edge Environments'
    ]
  },
  {
    id: 'book-windows-server',
    title: 'Windows Server 2022 & Active Directory Domain Services',
    subtitle: 'Maamulka Domain-ka, GPO, DNS, DHCP & Hyper-V',
    author: 'Lafole Systems Faculty',
    category: 'IT Support',
    pages: 420,
    language: 'Somali',
    level: 'Beginner',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    downloadSize: '11.3 MB',
    description: 'Baro sida shirkadaha loogu dhiso Domain Controller, loo maamulo Users & Groups, loogu dhaqan-galiyo Group Policy Objects (GPO), iyo maaraynta File Server-rada.',
    chapters: [
      '1. Windows Server 2022 Editions & Installation',
      '2. Active Directory Domain Services (AD DS) Setup',
      '3. User, Computer & Group Management',
      '4. Group Policy (GPO) Design & Security Hardening',
      '5. DHCP Server, DNS Records & IP Management',
      '6. File Services, NTFS Permissions & Quotas',
      '7. Windows Server Backup & Disaster Recovery'
    ]
  },
  {
    id: 'book-hardware',
    title: 'Computer Hardware & Laptop Repair Diagnostics',
    subtitle: 'Baadhista iyo hagaajinta cilladaha Hardware-ka iyo Motherboard-ka',
    author: 'Eng. Yasin Adan',
    category: 'IT Support',
    pages: 310,
    language: 'Somali',
    level: 'Beginner',
    year: 2024,
    coverUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    downloadSize: '22.0 MB',
    description: 'Hagaha gacanta ee hagaajinta laptop-yada iyo kombuyuutarrada miiska: Power rails, multimeter testing, BIOS flashing, RAM & SSD diagnostics, iyo thermal management.',
    chapters: [
      '1. Computer Architecture & Internal Components',
      '2. Power Supplies (SMPS) & Voltage Rails',
      '3. Motherboard Components & Schematics Reading',
      '4. Diagnostic Tools: Multimeter, POST Card & Oscilloscope',
      '5. Common Laptop No-Power & Display Faults',
      '6. BIOS Extraction, Flashing & ME Region Cleaning',
      '7. Preventive Maintenance & Thermal Paste Application'
    ]
  }
];
