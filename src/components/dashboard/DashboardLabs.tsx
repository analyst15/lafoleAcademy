import React, { useState } from 'react';
import { Shield, Cpu, Terminal, Play, CheckCircle2, ExternalLink, Download, Server, Wifi } from 'lucide-react';

interface DashboardLabsProps {
  initialType?: 'cyber' | 'networking';
}

export const DashboardLabs: React.FC<DashboardLabsProps> = ({ initialType = 'cyber' }) => {
  const [activeTab, setActiveTab] = useState<'cyber' | 'networking'>(initialType);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Lafole Virtual Sandbox Engine [Version 2.4.1]',
    'Connected to Node: laf-edge-rtr01 (Cisco IOS-XE 17.6.3a)',
    'Ready. Type "show ip interface brief" or "run diagnostic" below.'
  ]);
  const [cmdInput, setCmdInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim();
    const newLogs = [...terminalOutput, `laf-rtr01# ${cmd}`];

    if (cmd.toLowerCase().includes('interface') || cmd.toLowerCase().includes('ip')) {
      newLogs.push('GigabitEthernet0/0/0  192.168.10.1   YES NVRAM  up                    up');
      newLogs.push('GigabitEthernet0/0/1  10.254.0.5     YES NVRAM  up                    up');
      newLogs.push('Loopback0             10.0.0.1       YES NVRAM  up                    up');
    } else if (cmd.toLowerCase().includes('bgp') || cmd.toLowerCase().includes('ospf')) {
      newLogs.push('BGP router identifier 10.0.0.1, local AS number 65001');
      newLogs.push('BGP table version is 24, main routing table version 24');
      newLogs.push('Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd');
      newLogs.push('10.254.0.6      4 65002    1482    1485       24    0    0 04:12:30        18');
    } else if (cmd.toLowerCase().includes('ping')) {
      newLogs.push('Sending 5, 100-byte ICMP Echos to target, timeout is 2 seconds:');
      newLogs.push('!!!!!');
      newLogs.push('Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms');
    } else {
      newLogs.push(`Command executed: ${cmd}`);
      newLogs.push('OK (status code 0)');
    }

    setTerminalOutput(newLogs);
    setCmdInput('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
            {activeTab === 'cyber' ? 'CYBER SECURITY LABS' : 'NETWORKING SIMULATION LABS'}
          </h1>
          <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1">
            Hands-on sandboxed hardware environments with live terminal telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('cyber')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[13px] font-[500] transition-all cursor-pointer ${
              activeTab === 'cyber'
                ? 'bg-white dark:bg-slate-900 text-[#22C55E] shadow-2xs font-[600]'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cyber Labs
          </button>
          <button
            onClick={() => setActiveTab('networking')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[13px] font-[500] transition-all cursor-pointer ${
              activeTab === 'networking'
                ? 'bg-white dark:bg-slate-900 text-[#22C55E] shadow-2xs font-[600]'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Networking Labs
          </button>
        </div>
      </div>

      {/* Interactive Web Terminal */}
      <div className="bg-slate-950 text-emerald-400 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-slate-400 text-[11px] ml-2 font-mono">laf-edge-pod04.lafole.lab (SSH-2.0)</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
            LIVE SESSION
          </span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="flex items-center space-x-2 pt-2 border-t border-slate-800">
          <span className="text-emerald-500 font-bold">laf-rtr01#</span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type command (e.g. show ip interface brief, show bgp summary, ping 10.0.0.1)..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>

      {/* Lab Topologies & Workbooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {[
          {
            title: activeTab === 'cyber' ? 'Wireshark Packet Analysis Lab' : 'Cisco BGP Multi-Homing Lab',
            desc: activeTab === 'cyber' ? 'Detect ARP poisoning, DNS amplification, and TLS anomalies.' : 'Configure dual ISP peering with BGP local preference and AS-Path prepend.',
            status: 'Ready to launch'
          },
          {
            title: activeTab === 'cyber' ? 'Metasploitable 2 Penetration Testing' : 'MikroTik CCR WireGuard Site-to-Site',
            desc: activeTab === 'cyber' ? 'Exploit vulnerable Linux daemons and practice post-exploitation.' : 'Build encrypted overlay tunnels between Mogadishu and Hargeisa POPs.',
            status: 'Ready to launch'
          },
          {
            title: activeTab === 'cyber' ? 'Suricata IDS / Snort Rule Writing' : 'Cisco Enterprise 300-410 ENARSI Lab',
            desc: activeTab === 'cyber' ? 'Craft custom signature alerts for brute force SSH detection.' : 'Advanced EIGRP named mode, OSPF multi-area, and VRF route leaking.',
            status: 'Ready to launch'
          }
        ].map((lab, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E]">
                {lab.status}
              </span>
              <h3 className="font-[500] text-[17px] text-slate-900 dark:text-white pt-1 leading-snug">
                {lab.title}
              </h3>
              <p className="text-[14px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
                {lab.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => alert(`Launching sandboxed environment for: ${lab.title}. Provisioning VM instance...`)}
                className="w-full py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Lab VM</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
