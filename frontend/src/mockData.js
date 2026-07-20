// Initial State for OnBrain Dashboard & Ingestion Workbench
// All hardcoded fake values removed. Reflects actual implemented state.

export const initialStatSummary = {
  activeAnomalies: 0,
  activeTrend: '0% change',
  riskScore: 0,
  riskStatus: 'Nominal',
  systemsMonitored: 0,
  systemsOnline: 0,
  anomaliesToday: 0,
  correlatedAttacks: 0,
  avgResponseTime: '--',
};

export const emptyHeatmapMatrix = {
  systems: [
    'SCADA-Edge-01',
    'DB-Cluster-Primary',
    'IAM-OAuth-Server',
    'ERP-Core-Gateway',
    'Firewall-BGP-02',
  ],
  timeBuckets: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  data: [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]
};

export const initialMitreStages = [
  { id: 'initial-access', name: 'Initial Access', code: 'TA0001', active: false, severity: 'none' },
  { id: 'execution', name: 'Execution', code: 'TA0002', active: false, severity: 'none' },
  { id: 'persistence', name: 'Persistence', code: 'TA0003', active: false, severity: 'none' },
  { id: 'priv-escalation', name: 'Privilege Escalation', code: 'TA0004', active: false, severity: 'none' },
  { id: 'defense-evasion', name: 'Defense Evasion', code: 'TA0005', active: false, severity: 'none' },
  { id: 'credential-access', name: 'Credential Access', code: 'TA0006', active: false, severity: 'none' },
  { id: 'lateral-movement', name: 'Lateral Movement', code: 'TA0008', active: false, severity: 'none' },
  { id: 'exfiltration', name: 'Exfiltration', code: 'TA0010', active: false, severity: 'none' },
];
