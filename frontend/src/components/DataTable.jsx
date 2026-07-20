import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, SlidersHorizontal } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function DataTable({ data, onRowClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.affectedUserDevice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || item.severity.toLowerCase() === severityFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Sort logic
  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-[rgba(13,59,54,0.06)] flex flex-col justify-between">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7B76]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title, asset, ID, or anomaly type..."
            className="w-full bg-[#DCEEE7]/30 border border-[rgba(13,59,54,0.08)] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#0D3B36] placeholder-[#6B7B76] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/40"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Severity Dropdown */}
          <div className="flex items-center gap-2 bg-[#DCEEE7]/40 border border-[rgba(13,59,54,0.08)] px-3 py-2 rounded-2xl">
            <Filter className="h-3.5 w-3.5 text-[#6B7B76]" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0D3B36] focus:outline-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 bg-[#DCEEE7]/40 border border-[rgba(13,59,54,0.08)] px-3 py-2 rounded-2xl">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#6B7B76]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0D3B36] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-[rgba(13,59,54,0.08)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#DCEEE7]/40 text-[#6B7B76] text-[11px] font-extrabold uppercase tracking-wider border-b border-[rgba(13,59,54,0.08)]">
              <th
                onClick={() => handleSort('timestamp')}
                className="py-3.5 px-4 cursor-pointer hover:text-[#0D3B36] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Timestamp</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Anomaly Details</th>
              <th className="py-3.5 px-4">Affected User / Device</th>
              <th
                onClick={() => handleSort('deviationScore')}
                className="py-3.5 px-4 cursor-pointer hover:text-[#0D3B36] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Deviation Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(13,59,54,0.06)] text-xs text-[#0D3B36]">
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className="hover:bg-[#DCEEE7]/30 transition-colors cursor-pointer group"
                >
                  {/* Timestamp */}
                  <td className="py-4 px-4 font-mono font-medium text-[#6B7B76] whitespace-nowrap">
                    {row.timestamp}
                  </td>

                  {/* Anomaly Details */}
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-[#0D3B36] group-hover:text-[#1D9E75] transition-colors">
                      {row.title}
                    </div>
                    <div className="text-[11px] text-[#6B7B76] font-mono mt-0.5">
                      {row.id} · {row.type}
                    </div>
                  </td>

                  {/* Affected User / Device */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-semibold bg-[#DCEEE7]/40 px-2.5 py-1 rounded-lg border border-[rgba(13,59,54,0.06)]">
                      {row.affectedUserDevice}
                    </span>
                  </td>

                  {/* Deviation Score */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#DCEEE7] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            row.deviationScore > 75
                              ? 'bg-[#F0785A]'
                              : row.deviationScore > 50
                              ? 'bg-[#F4B740]'
                              : 'bg-[#1D9E75]'
                          }`}
                          style={{ width: `${row.deviationScore}%` }}
                        />
                      </div>
                      <span className="font-bold">{row.deviationScore}</span>
                    </div>
                  </td>

                  {/* Severity Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <SeverityBadge severity={row.severity} size="small" />
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`capitalize font-bold text-[11px] px-2.5 py-1 rounded-full border ${
                        row.status === 'open'
                          ? 'bg-[#F0785A]/15 text-[#8C2911] border-[#F0785A]/30'
                          : row.status === 'investigating'
                          ? 'bg-[#F4B740]/15 text-[#7A5400] border-[#F4B740]/30'
                          : 'bg-[#1D9E75]/15 text-[#1D9E75] border-[#1D9E75]/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button className="p-1.5 rounded-xl bg-[#DCEEE7]/40 hover:bg-[#0D3B36] hover:text-white transition-all duration-200">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#6B7B76]">
                  No anomalies match the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#6B7B76]">
        <span>Showing {sortedData.length} of {data.length} total anomalies</span>
        <span>Click any row to open full technical detail drawer</span>
      </div>
    </div>
  );
}
