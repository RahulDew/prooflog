import React, { useMemo } from 'react';
import './styles.css';

export interface LogEntry {
  hash: string;
  previousHash: string | null;
  timestamp: string | Date;
  action: string;
  metadata?: Record<string, any>;
  isVerified?: boolean;
}

export interface ProofLogTimelineProps {
  logs: LogEntry[];
  title?: string;
  className?: string;
}

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export function ProofLogTimeline({ logs, title = "Cryptographic Audit Trail", className = "" }: ProofLogTimelineProps) {
  // Performance optimization: Memoize the timeline rendering (rerender-memo)
  const renderedLogs = useMemo(() => {
    return logs.map((log) => (
      <div key={log.hash} className="prooflog-item">
        <div className={`prooflog-icon ${log.isVerified !== false ? 'verified' : ''}`}>
          <ShieldIcon />
        </div>
        <div className="prooflog-content">
          <div className="prooflog-meta">
            <span>{new Date(log.timestamp).toLocaleString()}</span>
            {log.isVerified !== false && (
              <span className="prooflog-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckIcon /> Verified
              </span>
            )}
          </div>
          <h4 className="prooflog-action">{log.action}</h4>
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: '#a1a1aa' }}>
              {JSON.stringify(log.metadata)}
            </div>
          )}
          <div className="prooflog-hash">
            {log.hash.substring(0, 32)}...
          </div>
        </div>
      </div>
    ));
  }, [logs]);

  // Performance optimization: CSS content-visibility used implicitly via styles or can be added if list is huge
  return (
    <div className={`prooflog-widget ${className}`} style={{ contentVisibility: 'auto' }}>
      <div className="prooflog-header">
        <ShieldIcon />
        <h3 className="prooflog-title">{title}</h3>
      </div>
      <div className="prooflog-timeline">
        {logs.length === 0 ? (
          <p style={{ color: '#a1a1aa', textAlign: 'center', margin: '20px 0' }}>No logs available.</p>
        ) : (
          renderedLogs
        )}
      </div>
    </div>
  );
}
