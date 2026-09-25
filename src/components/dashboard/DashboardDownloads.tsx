import React from 'react';
import { Download, FileText, Code2, Network, ShieldCheck, Check } from 'lucide-react';

interface DownloadItem {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string;
  updated: string;
}

export const DashboardDownloads: React.FC = () => {
  const downloadsList: DownloadItem[] = [
    {
      id: 'd1',
      title: 'Cisco Packet Tracer Multi-Area OSPF & BGP Lab Topology',
      category: 'CCNP Labs',
      format: '.PKT',
      size: '14.2 MB',
      updated: 'Sept 2026'
    },
    {
      id: 'd2',
      title: 'Python Netmiko & Paramiko Automation Scripts for Cisco IOS-XE',
      category: 'Automation',
      format: '.ZIP',
      size: '4.8 MB',
      updated: 'Aug 2026'
    },
    {
      id: 'd3',
      title: 'CCNA 200-301 Subnetting, Hexadecimal & CIDR Quick Cheat Sheet',
      category: 'Exam Prep',
      format: '.PDF',
      size: '2.1 MB',
      updated: 'Sept 2026'
    },
    {
      id: 'd4',
      title: 'MikroTik RouterOS v7 Firewall, NAT & WireGuard Setup Script',
      category: 'Telecom',
      format: '.RSC',
      size: '850 KB',
      updated: 'Sept 2026'
    },
    {
      id: 'd5',
      title: 'Wireshark Network Traffic Analysis & PCAP Sample Captures',
      category: 'Cyber Security',
      format: '.PCAPNG',
      size: '38.5 MB',
      updated: 'July 2026'
    }
  ];

  const handleDownload = (title: string) => {
    // Generate a quick download simulation
    const blob = new Blob([`Lafole Academy Official Lab Resource\nResource: ${title}\nLicensed to verified student.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          DOWNLOADS
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Course supplementary assets, Packet Tracer lab files, automation scripts, and reference sheets for offline study.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {downloadsList.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-[#22C55E] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-[600] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-[600] bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E]">
                    {item.format}
                  </span>
                </div>
                <h3 className="font-[500] text-[17px] text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-mono text-[12px]">{item.size} • {item.updated}</span>
              <button
                onClick={() => handleDownload(item.title)}
                className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[13.5px] font-[500] transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
