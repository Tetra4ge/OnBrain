// Comprehensive Mock Data for OnBrain Security SOC Dashboard (Phase 1, 2, 3 Spec)

export const statSummary = {
  activeAnomalies: 14,
  activeTrend: '+18% vs yesterday',
  riskScore: 78, // High/Amber -> Coral threshold
  riskStatus: 'Elevated Threat',
  systemsMonitored: 42,
  systemsOnline: 41,
  anomaliesToday: 38,
  correlatedAttacks: 3,
  avgResponseTime: '1.4m',
};

export const heatmapMatrix = {
  systems: [
    'SCADA-Edge-01',
    'DB-Cluster-Primary',
    'IAM-OAuth-Server',
    'ERP-Core-Gateway',
    'Firewall-BGP-02',
  ],
  timeBuckets: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  // 0 = Low (teal), 1 = Medium (amber), 2 = High (coral), 3 = Critical (bright coral)
  data: [
    [0, 1, 3, 2, 1, 0], // SCADA
    [0, 0, 1, 3, 3, 2], // DB
    [1, 2, 2, 1, 0, 0], // IAM
    [0, 0, 0, 1, 2, 1], // ERP
    [2, 3, 1, 0, 1, 0], // Firewall
  ]
};

export const anomalies = [
  {
    id: 'ANO-9042',
    title: 'Lateral movement via Pass-the-Hash',
    timestamp: '2026-07-20 17:14:02',
    timeAgo: '12m ago',
    timeRange: '17:10 - 17:15',
    type: 'Auth Anomaly',
    affectedUserDevice: 'srv_admin / DB-Cluster-Primary',
    deviationScore: 94,
    severity: 'critical', // coral
    status: 'investigating',
    category: 'Credential Access',
    baselineVal: '0.02 requests/min from IP 192.168.1.45',
    observedVal: '142 Kerberos Ticket-Granting requests in 45 seconds',
    logSnippet: `Jul 20 17:14:02 DB-Cluster-Primary authd[4821]: EventID 4624 - Successful Logon (Type 9 - NewCredentials)
Jul 20 17:14:03 DB-Cluster-Primary authd[4821]: NT AUTHORITY\\SYSTEM impersonating srv_admin from 10.0.4.112
Jul 20 17:14:05 DB-Cluster-Primary authd[4825]: EventID 4672 - Special privileges assigned to new logon`,
    assignedAnalysts: [
      { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: true,
  },
  {
    id: 'ANO-9041',
    title: 'Unusual outbound data spike to external IP',
    timestamp: '2026-07-20 16:58:19',
    timeAgo: '28m ago',
    timeRange: '16:50 - 17:00',
    type: 'Network Exfiltration',
    affectedUserDevice: 'workstation_884 / 198.51.100.42',
    deviationScore: 86,
    severity: 'high', // coral
    status: 'open',
    category: 'Exfiltration',
    baselineVal: 'Average 1.2 MB/hr outbound HTTPS transfer',
    observedVal: '4.8 GB outbound encrypted TCP traffic to 198.51.100.42 within 8 mins',
    logSnippet: `Jul 20 16:58:19 Firewall-BGP-02 flowd[991]: SRC=10.0.12.88 DST=198.51.100.42 PROTO=TCP SPT=49152 DPT=443 BYTES=5153960755
Jul 20 16:58:21 Firewall-BGP-02 flowd[991]: Alert: Threshold exceeded for rule "DLP-High-Volume-Egress"`,
    assignedAnalysts: [
      { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: false,
  },
  {
    id: 'ANO-9039',
    title: 'Abnormal process spawning (powershell.exe)',
    timestamp: '2026-07-20 16:22:45',
    timeAgo: '1h 4m ago',
    timeRange: '16:20 - 16:25',
    type: 'Execution Spike',
    affectedUserDevice: 'm_keller / SCADA-Edge-01',
    deviationScore: 68,
    severity: 'medium', // amber
    status: 'investigating',
    category: 'Execution',
    baselineVal: '0 powershell invocations during off-shift hours',
    observedVal: 'Encoded powershell command launched via cmd.exe spawned by Excel.exe',
    logSnippet: `Jul 20 16:22:45 SCADA-Edge-01 sysmon[1104]: Process Create: PID=8842 Image=C:\\Windows\\System32\\powershell.exe
Jul 20 16:22:45 SCADA-Edge-01 sysmon[1104]: CommandLine: powershell.exe -e aW52b2tlLWV4cHJlc3Npb24...`,
    assignedAnalysts: [
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: true,
  },
  {
    id: 'ANO-9036',
    title: 'Failed SSH brute force attempt detected',
    timestamp: '2026-07-20 15:45:10',
    timeAgo: '1h 41m ago',
    timeRange: '15:40 - 15:45',
    type: 'Authentication Failure',
    affectedUserDevice: 'root / IAM-OAuth-Server',
    deviationScore: 45,
    severity: 'low', // teal
    status: 'resolved',
    category: 'Initial Access',
    baselineVal: '1-2 failed logins per hour (typos)',
    observedVal: '240 failed login attempts in 180 seconds from subnet 203.0.113.0/24',
    logSnippet: `Jul 20 15:45:10 IAM-OAuth-Server sshd[3312]: Failed password for root from 203.0.113.19 port 52312 ssh2
Jul 20 15:45:11 IAM-OAuth-Server sshd[3315]: Failed password for invalid user admin from 203.0.113.19 port 52314 ssh2`,
    assignedAnalysts: [
      { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: true,
  },
  {
    id: 'ANO-9032',
    title: 'Unauthorized registry persistence key written',
    timestamp: '2026-07-20 14:10:00',
    timeAgo: '3h 16m ago',
    timeRange: '14:05 - 14:10',
    type: 'Persistence',
    affectedUserDevice: 'system / ERP-Core-Gateway',
    deviationScore: 72,
    severity: 'medium', // amber
    status: 'open',
    category: 'Persistence',
    baselineVal: 'No registry Run keys modified in past 90 days',
    observedVal: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run modified with unknown binary',
    logSnippet: `Jul 20 14:10:00 ERP-Core-Gateway regmon[781]: Registry modification detected: HKLM\\Software\\Run\\WinUpdater
Jul 20 14:10:01 ERP-Core-Gateway regmon[781]: Target Value: C:\\Users\\Public\\updater.exe -silent`,
    assignedAnalysts: [
      { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: false,
  },
  {
    id: 'ANO-9028',
    title: 'Port scan on internal subnet 10.0.4.0/24',
    timestamp: '2026-07-20 12:30:15',
    timeAgo: '4h 56m ago',
    timeRange: '12:25 - 12:30',
    type: 'Reconnaissance',
    affectedUserDevice: 'node_44 / SCADA-Edge-01',
    deviationScore: 38,
    severity: 'low', // teal
    status: 'resolved',
    category: 'Discovery',
    baselineVal: '0 port sweeps per day',
    observedVal: '1,024 TCP SYN packets probing ports 22, 80, 443, 3389 across 254 hosts',
    logSnippet: `Jul 20 12:30:15 Firewall-BGP-02 ids[229]: [1:2003:1] SCAN SYN FIN -- 10.0.4.12 -> 10.0.4.1-254`,
    assignedAnalysts: [
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    ],
    autoResponseEnabled: true,
  }
];

export const mitreStages = [
  { id: 'initial-access', name: 'Initial Access', code: 'TA0001', active: true, severity: 'low' },
  { id: 'execution', name: 'Execution', code: 'TA0002', active: true, severity: 'medium' },
  { id: 'persistence', name: 'Persistence', code: 'TA0003', active: true, severity: 'medium' },
  { id: 'priv-escalation', name: 'Privilege Escalation', code: 'TA0004', active: true, severity: 'high' },
  { id: 'defense-evasion', name: 'Defense Evasion', code: 'TA0005', active: false, severity: 'none' },
  { id: 'credential-access', name: 'Credential Access', code: 'TA0006', active: true, severity: 'critical' },
  { id: 'lateral-movement', name: 'Lateral Movement', code: 'TA0008', active: true, severity: 'critical' },
  { id: 'exfiltration', name: 'Exfiltration', code: 'TA0010', active: true, severity: 'high' },
];

export const correlatedIncidents = [
  {
    id: 'INC-2026-08',
    title: 'APT29 Style Multi-Stage Intrusion Campaign',
    confidence: 87,
    severity: 'critical',
    mitreStage: 'Lateral Movement -> Exfiltration',
    startTime: '2026-07-20 14:05:00',
    summary: 'Correlated attack sequence spanning 4 systems starting from initial SSH brute force on IAM server leading to Pass-the-Hash credential theft and high-volume egress.',
    anomaliesCount: 4,
    timelineEvents: [
      {
        id: 'EVT-01',
        time: '15:45 AM',
        title: 'Initial Access Attempt (SSH Brute Force)',
        rawAnomalyId: 'ANO-9036',
        mitreTechnique: 'T1110.001 - Password Guessing',
        severity: 'low',
        description: 'Failed password spray against IAM-OAuth-Server from external IP 203.0.113.19.',
        system: 'IAM-OAuth-Server'
      },
      {
        id: 'EVT-02',
        time: '16:22 PM',
        title: 'Obfuscated PowerShell Execution',
        rawAnomalyId: 'ANO-9039',
        mitreTechnique: 'T1059.001 - PowerShell',
        severity: 'medium',
        description: 'Base64 encoded script launched by m_keller on SCADA-Edge-01.',
        system: 'SCADA-Edge-01'
      },
      {
        id: 'EVT-03',
        time: '17:14 PM',
        title: 'Pass-the-Hash Lateral Movement',
        rawAnomalyId: 'ANO-9042',
        mitreTechnique: 'T1550.002 - Pass the Hash',
        severity: 'critical',
        description: 'Impersonation of srv_admin transferring tickets to DB-Cluster-Primary.',
        system: 'DB-Cluster-Primary'
      },
      {
        id: 'EVT-04',
        time: '16:58 PM',
        title: 'Large Encrypted Outbound Egress',
        rawAnomalyId: 'ANO-9041',
        mitreTechnique: 'T1041 - Exfiltration Over C2 Channel',
        severity: 'high',
        description: '4.8 GB outbound TCP stream transferred to unrated external server.',
        system: 'Firewall-BGP-02'
      }
    ]
  },
  {
    id: 'INC-2026-07',
    title: 'SCADA Edge Persistence & Local Discovery',
    confidence: 64,
    severity: 'medium',
    mitreStage: 'Persistence -> Discovery',
    startTime: '2026-07-20 12:25:00',
    summary: 'Probing of internal subnet 10.0.4.0/24 coupled with unauthorized Run registry modifications.',
    anomaliesCount: 2,
    timelineEvents: [
      {
        id: 'EVT-05',
        time: '12:30 PM',
        title: 'Subnet Port Sweep Probe',
        rawAnomalyId: 'ANO-9028',
        mitreTechnique: 'T1046 - Network Service Discovery',
        severity: 'low',
        description: 'Sweep of internal subnet 10.0.4.0/24 across common administrative ports.',
        system: 'SCADA-Edge-01'
      },
      {
        id: 'EVT-06',
        time: '14:10 PM',
        title: 'Registry Persistence Key Added',
        rawAnomalyId: 'ANO-9032',
        mitreTechnique: 'T1547.001 - Registry Run Keys',
        severity: 'medium',
        description: 'Modification of WinUpdater registry entry pointing to user temp folder.',
        system: 'ERP-Core-Gateway'
      }
    ]
  }
];

export const sidebarTimeline = [
  {
    id: 'ST-101',
    time: '17:14:02',
    title: 'Lateral movement — DB-Cluster-Primary',
    severity: 'critical', // coral
    category: 'Pass-the-Hash',
  },
  {
    id: 'ST-102',
    time: '16:58:19',
    title: 'Data Egress Spike — 4.8 GB outbound',
    severity: 'high', // coral
    category: 'Exfiltration',
  },
  {
    id: 'ST-103',
    time: '16:22:45',
    title: 'Encoded PowerShell — SCADA-Edge-01',
    severity: 'medium', // amber
    category: 'Execution',
  },
  {
    id: 'ST-104',
    time: '15:45:10',
    title: 'SSH Brute Force — IAM-OAuth-Server',
    severity: 'low', // teal
    category: 'Auth Failure',
  },
  {
    id: 'ST-105',
    time: '14:10:00',
    title: 'Registry Key Modified — ERP-Core-Gateway',
    severity: 'medium', // amber
    category: 'Persistence',
  },
  {
    id: 'ST-106',
    time: '12:30:15',
    title: 'Subnet Scan — SCADA-Edge-01',
    severity: 'low', // teal
    category: 'Discovery',
  }
];
