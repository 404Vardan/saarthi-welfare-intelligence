import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CitizenDocuments() {
  const { documents, uploadDocument } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadToast, setUploadToast] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc = await uploadDocument(file);
    setUploadToast(`✓ Successfully uploaded & verified "${newDoc.name}"`);
    setTimeout(() => setUploadToast(''), 3000);
  };

  const triggerUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Document Locker</h1>
          <p className="page-description">
            Secure, reusable repository for eligibility verifications. Upload once, verify everywhere.
          </p>
        </div>
      </header>

      {uploadToast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {uploadToast}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Upload Zone */}
      <div className="upload-zone" onClick={triggerUploadClick} style={{ marginBottom: 'var(--space-8)', cursor: 'pointer' }}>
        <UploadCloud size={48} color="var(--seal-vermillion)" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', marginBottom: '4px' }}>
          Click to Select & Upload Official Proofs
        </h3>
        <p style={{ color: 'var(--slate)', fontSize: '0.85rem' }}>
          Supports PDF, JPEG, PNG (Max 10 MB). Automatically indexed against scheme requirements.
        </p>
      </div>

      {/* Document Grid */}
      <div className="document-grid">
        {documents.map(doc => (
          <div key={doc.id} className="document-card">
            <FileText className="document-icon" />
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink-navy)' }}>
                {doc.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate)', marginTop: '2px' }}>
                {doc.size} · {doc.uploadedAt}
              </div>
            </div>
            {doc.status === 'verified' ? (
              <CheckCircle2 size={18} color="var(--ledger-green)" title="Verified in Locker" />
            ) : (
              <span className="badge badge-nearly">Missing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
