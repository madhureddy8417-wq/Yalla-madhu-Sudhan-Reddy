'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Users, 
  FileCheck, 
  ExternalLink, 
  FileText, 
  Scale, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';

const MOCK_AUDIT_LOGS = [
  { id: 'LOG-001', userId: 'admin_01', ip: '192.168.1.105', action: 'User Login', timestamp: '2026-02-24 08:30:12', status: 'Success' },
  { id: 'LOG-002', userId: 'engineer_04', ip: '10.0.0.42', action: 'Update AI Model', timestamp: '2026-02-24 09:15:45', status: 'Success' },
  { id: 'LOG-003', userId: 'ward_12', ip: '172.16.0.11', action: 'Delete Complaint', timestamp: '2026-02-24 10:05:22', status: 'Warning' },
  { id: 'LOG-004', userId: 'admin_02', ip: '192.168.1.110', action: 'Change Permissions', timestamp: '2026-02-24 11:20:00', status: 'Success' },
  { id: 'LOG-005', userId: 'unknown', ip: '45.12.33.1', action: 'Failed Login Attempt', timestamp: '2026-02-24 12:45:33', status: 'Critical' },
  { id: 'LOG-006', userId: 'engineer_01', ip: '10.0.0.15', action: 'Export Data', timestamp: '2026-02-24 13:10:11', status: 'Success' },
];

export default function GovernanceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSearch = 
      log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);
    
    const matchesFilter = filterStatus === 'All' || log.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-rajdhani text-slate-900 tracking-tight uppercase">Governance & Policy</h1>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Administrative Control & Compliance Framework</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Lock, label: 'Access Control', value: 'Active', color: 'text-emerald-600' },
          { icon: Users, label: 'Admin Users', value: '12', color: 'text-blue-600' },
          { icon: FileCheck, label: 'Audit Logs', value: 'Verified', color: 'text-teal-600' },
          { icon: Shield, label: 'Security Score', value: '98/100', color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</div>
              <div className="text-xl font-bold text-slate-900 font-rajdhani">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 font-rajdhani uppercase tracking-wider mb-6">System Compliance Overview</h3>
        <div className="space-y-6">
          {[
            { name: 'Data Privacy (GDPR/DPDP)', status: 'Compliant', pct: 100 },
            { name: 'AI Ethics Framework', status: 'In Review', pct: 85 },
            { name: 'Municipal Bylaws Sync', status: 'Active', pct: 92 },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{item.name}</span>
                <span className="text-emerald-600">{item.status}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  className="h-full bg-emerald-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-rajdhani uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText size={20} className="text-emerald-600" />
            Security Policies
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Data Protection Policy', desc: 'Guidelines for handling sensitive municipal and citizen data.', icon: Lock },
              { title: 'AI Ethics & Bias Policy', desc: 'Ensuring fairness and transparency in automated decision making.', icon: Eye },
              { title: 'Incident Response Plan', desc: 'Protocol for managing and mitigating security breaches.', icon: Shield },
            ].map((policy, i) => (
              <div key={i} className="bg-slate-50 border border-black/5 p-4 rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                      <policy.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{policy.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{policy.desc}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-rajdhani uppercase tracking-wider mb-6 flex items-center gap-2">
            <Scale size={20} className="text-teal-600" />
            Compliance Standards
          </h3>
          <div className="space-y-4">
            {[
              { title: 'ISO/IEC 27001', desc: 'Information security management system certification.', status: 'Compliant', link: 'https://www.iso.org/isoiec-27001-information-security.html' },
              { title: 'SOC 2 Type II', desc: 'Trust services criteria for security, availability, and privacy.', status: 'In Progress', link: 'https://www.aicpa.org/topic/audit-assurance/audit-and-assurance-services/service-organization-controls-soc-reporting' },
              { title: 'NIST Cybersecurity Framework', desc: 'Alignment with national security standards.', status: 'Compliant', link: 'https://www.nist.gov/cyberframework' },
              { title: 'HIPAA Compliance', desc: 'Health data protection standards (where applicable).', status: 'Not Compliant', link: 'https://www.hhs.gov/hipaa/index.html' },
            ].map((std, i) => (
              <div key={i} className="bg-slate-50 border border-black/5 p-4 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {std.status === 'Compliant' && <CheckCircle2 size={16} className="text-emerald-600" />}
                    {std.status === 'In Progress' && <Clock size={16} className="text-blue-600" />}
                    {std.status === 'Not Compliant' && <XCircle size={16} className="text-red-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{std.title}</h4>
                      <a href={std.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{std.desc}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${
                  std.status === 'Compliant' ? 'bg-emerald-100 text-emerald-600' :
                  std.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {std.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="text-lg font-bold text-slate-900 font-rajdhani uppercase tracking-wider flex items-center gap-2">
            <FileCheck size={20} className="text-emerald-600" />
            Detailed Audit Logs
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-black/10 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 focus:outline-none focus:border-emerald-500/50 w-full sm:w-48"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-black/10 rounded-xl px-3 py-2">
              <Filter size={14} className="text-slate-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white">All Status</option>
                <option value="Success" className="bg-white">Success</option>
                <option value="Warning" className="bg-white">Warning</option>
                <option value="Critical" className="bg-white">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="pb-4 font-bold">Timestamp</th>
                <th className="pb-4 font-bold">User ID</th>
                <th className="pb-4 font-bold">Action</th>
                <th className="pb-4 font-bold">IP Address</th>
                <th className="pb-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-[11px] font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-4 text-[11px] font-bold text-slate-900">{log.userId}</td>
                    <td className="py-4 text-[11px] text-slate-700">{log.action}</td>
                    <td className="py-4 text-[11px] font-mono text-slate-500">{log.ip}</td>
                    <td className="py-4">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' :
                        log.status === 'Warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-500 italic">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
