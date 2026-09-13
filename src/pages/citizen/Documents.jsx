import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Plus,
  Check,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DocumentsAPI } from '../../api/documentsApi';

export default function CitizenDocuments() {
  const { documents, uploadDocument, evaluations } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadToast, setUploadToast] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Upload Form State
  const [docCategory, setDocCategory] = useState('income');
  const [docName, setDocName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const eligibleSchemes = evaluations.filter(e => e.status === 'eligible');
  const readinessScore = DocumentsAPI.calculateReadinessScore(documents, eligibleSchemes);

  const categories = [
    { id: 'all', label: 'All Proofs' },
    { id: 'identity', label: 'Identity & e-KYC' },
    { id: 'income', label: 'Income & Revenue' },
    { id: 'land', label: 'Land & Assets' },
    { id: 'financial', label: 'Banking & DBT' },
    { id: 'household', label: 'Ration & Family' },
    { id: 'category', label: 'Social Category' }
  ];

  const filteredDocs = activeCategory === 'all'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  const handleModalUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile && !docName) return;

    const file = selectedFile || { name: `${docName || 'Document'}.pdf`, size: 1200000, type: 'application/pdf' };
    const metadata = {
      name: docName || file.name,
      category: docCategory,
      docNumber: docNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      expiryDate: docExpiryDate || null
    };

    const newDoc = await uploadDocument(file, metadata);
    setUploadToast(`✓ Successfully indexed "${newDoc.name}" into your secure vault.`);
    setTimeout(() => setUploadToast(''), 4000);

    // Reset Form
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setDocName('');
    setDocNumber('');
    setDocExpiryDate('');
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Citizen Document Locker</h1>
          <p className="page-description">
            Secure, reusable repository for eligibility verifications. Upload once, verify automatically across 100+ schemes.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Upload New Proof
        </button>
      </header>

      {uploadToast && (
        <div style={{ background: 'rgba(31,122,77,0.1)', color: 'var(--ledger-green)', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(31,122,77,0.3)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {uploadToast}
        </div>
      )}

      {/* Document Health & Readiness Summary Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFDF9', borderLeft: '4px solid var(--brass-gold)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(212, 160, 23, 0.12)',
              color: 'var(--brass-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)'
            }}>
              {readinessScore}%
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 4px 0', fontSize: '1.15rem' }}>
                Application Readiness Score
              </h3>
              <p style={{ color: 'var(--slate)', fontSize: '0.85rem', margin: 0 }}>
                {readinessScore >= 80 ? 'Excellent! Your vault contains sufficient verified proofs for immediate submission.' : 'Upload missing income and revenue certificates to achieve 100% instant verification.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-eligible" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> {documents.filter(d => d.status === 'verified').length} Verified Proofs
            </span>
            {documents.some(d => d.status === 'expiring_soon' || (d.daysToExpiry && d.daysToExpiry <= 30)) && (
              <span className="badge badge-nearly" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> Expiry Notice
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '4px' }}>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`filter-chip ${activeCategory === c.id ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {filteredDocs.map(doc => {
          const isExpiring = doc.status === 'expiring_soon' || (doc.daysToExpiry && doc.daysToExpiry <= 30);
          return (
            <div
              key={doc.id}
              className="card"
              style={{
                padding: '1.25rem',
                borderTop: `3px solid ${isExpiring ? 'var(--brass-gold)' : (doc.status === 'verified' ? 'var(--ledger-green)' : 'var(--border)')}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'var(--paper)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <FileText size={20} color="var(--seal-vermillion)" />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', color: 'var(--ink-navy)', margin: 0 }}>
                        {doc.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--slate)', marginTop: '2px' }}>
                        {doc.docNumber || 'DOC-VERIFIED'}
                      </div>
                    </div>
                  </div>

                  {doc.status === 'verified' && !isExpiring ? (
                    <span className="badge badge-eligible" style={{ fontSize: '10px' }}>Verified</span>
                  ) : isExpiring ? (
                    <span className="badge badge-nearly" style={{ fontSize: '10px' }}>
                      Expiring in {doc.daysToExpiry || 23}d
                    </span>
                  ) : (
                    <span className="badge" style={{ fontSize: '10px', background: 'var(--paper)', color: 'var(--slate)' }}>Pending</span>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '12px', lineHeight: 1.4 }}>
                  <div><strong>Authority:</strong> {doc.issuingAuthority || 'Government Revenue Dept'}</div>
                  <div><strong>File Info:</strong> {doc.size || '1.4 MB'} · Indexed {doc.uploadedAt}</div>
                  {doc.expiryDate && (
                    <div><strong>Valid Until:</strong> {doc.expiryDate}</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 8px' }}
                >
                  <Eye size={13} /> View Proof
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDocName(doc.name);
                    setDocCategory(doc.category || 'income');
                    setDocNumber(doc.docNumber || '');
                    setIsUploadModalOpen(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--seal-vermillion)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Update File →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setIsUploadModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: '0 0 6px 0' }}>
              Upload Official Verification Proof
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Proofs are encrypted and automatically matched against scheme prerequisites.
            </p>

            <form onSubmit={handleModalUpload}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Document Category</label>
                <select
                  className="form-select"
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value)}
                >
                  <option value="identity">Identity & e-KYC (Aadhaar / Voter ID)</option>
                  <option value="income">Income Certificate (Tehsildar / Revenue)</option>
                  <option value="land">Land Record (7/12 RoR / Khasra)</option>
                  <option value="financial">Banking Passbook (DBT Seeded)</option>
                  <option value="household">Ration Card (NFSA / BPL)</option>
                  <option value="category">Social Category / Caste Certificate</option>
                  <option value="disability">Disability Certificate (UDID)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Document Name / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Income Certificate 2026-27"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Document / Certificate Reference No.</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. INC/2026/SUR/99214"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Expiry Date (Leave blank if non-expiring)</label>
                <input
                  type="date"
                  className="form-input"
                  value={docExpiryDate}
                  onChange={e => setDocExpiryDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Select File (PDF, PNG, JPG - Max 10MB)</label>
                <input
                  type="file"
                  className="form-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save & Index into Locker →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 31, 58, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setPreviewDoc(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <ShieldCheck size={28} color="var(--ledger-green)" />
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-navy)', margin: 0 }}>
                  {previewDoc.name}
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--slate)' }}>
                  Ref: {previewDoc.docNumber || 'DOC-VERIFIED'}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Category:</strong> {previewDoc.category || 'General'}</div>
                <div><strong>Status:</strong> {previewDoc.status === 'verified' ? '✓ Verified in Locker' : 'Pending Verification'}</div>
                <div><strong>Indexed On:</strong> {previewDoc.uploadedAt}</div>
                <div><strong>File Size:</strong> {previewDoc.size || '1.4 MB'}</div>
                <div><strong>Issuing Authority:</strong> {previewDoc.issuingAuthority || 'Government Department'}</div>
                <div><strong>Validity:</strong> {previewDoc.expiryDate ? `Until ${previewDoc.expiryDate}` : 'Permanent / Non-Expiring'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
