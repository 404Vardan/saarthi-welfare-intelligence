import { supabase } from './supabaseClient.js';

const LOCAL_STORAGE_KEY = 'saarthi_citizen_documents';

// Rich initial categorized documents with expiry tracking
const defaultSeedDocuments = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card (UIDAI e-KYC)',
    category: 'identity',
    docNumber: 'XXXX-XXXX-4819',
    type: 'application/pdf',
    status: 'verified',
    size: '1.2 MB',
    fileUrl: '#',
    uploadedAt: '10 Jan 2026',
    expiryDate: null, // Aadhaar doesn't expire
    daysToExpiry: null,
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)'
  },
  {
    id: 'doc-income',
    name: 'Income Certificate (Revenue Authority)',
    category: 'income',
    docNumber: 'INC/2025/SUR/88412',
    type: 'application/pdf',
    status: 'expiring_soon',
    size: '1.8 MB',
    fileUrl: '#',
    uploadedAt: '15 Oct 2025',
    expiryDate: '2026-10-06', // ~23 days from current mock date
    daysToExpiry: 23,
    issuingAuthority: 'Office of the Mamlatdar / Tehsildar, Surat'
  },
  {
    id: 'doc-land',
    name: 'Land Record (7/12 RoR & 8A Extract)',
    category: 'land',
    docNumber: 'SUR-KHA-2025-9921',
    type: 'application/pdf',
    status: 'verified',
    size: '2.1 MB',
    fileUrl: '#',
    uploadedAt: '05 Jan 2026',
    expiryDate: '2027-01-05',
    daysToExpiry: 479,
    issuingAuthority: 'AnyRoR Gujarat Revenue Department'
  },
  {
    id: 'doc-bank',
    name: 'Bank Passbook (DBT-Seeded Account)',
    category: 'financial',
    docNumber: 'SBIN0004921 - A/C **3918',
    type: 'application/pdf',
    status: 'verified',
    size: '2.4 MB',
    fileUrl: '#',
    uploadedAt: '12 Jan 2026',
    expiryDate: null,
    daysToExpiry: null,
    issuingAuthority: 'State Bank of India (Surat Main Branch)'
  },
  {
    id: 'doc-ration',
    name: 'Ration Card (NFSA / BPL Priority)',
    category: 'household',
    docNumber: 'RC-GUJ-24-11094',
    type: 'application/pdf',
    status: 'verified',
    size: '950 KB',
    fileUrl: '#',
    uploadedAt: '04 Feb 2026',
    expiryDate: '2028-12-31',
    daysToExpiry: 839,
    issuingAuthority: 'Food & Civil Supplies Department'
  },
  {
    id: 'doc-caste',
    name: 'OBC Non-Creamy Layer Certificate',
    category: 'category',
    docNumber: 'NCL-2025-SUR-3391',
    type: 'application/pdf',
    status: 'verified',
    size: '1.4 MB',
    fileUrl: '#',
    uploadedAt: '18 Nov 2025',
    expiryDate: '2026-11-18',
    daysToExpiry: 66,
    issuingAuthority: 'Sub-Divisional Magistrate (SDM)'
  }
];

export const DocumentsAPI = {
  async fetchUserDocuments(profileId) {
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('profile_id', profileId)
          .order('uploaded_at', { ascending: false });

        if (error) {
          console.error('[DocumentsAPI] Database query error:', error.message);
          if (import.meta.env.PROD) return [];
        } else if (data) {
          // Generate time-limited signed URLs for each private document
          const docsWithSignedUrls = await Promise.all(data.map(async (d) => {
            let secureUrl = null;
            if (d.file_url && d.file_url !== '#') {
              try {
                // If it's stored in Supabase private bucket, generate 1-hour signed URL
                const pathParts = d.file_url.split('/documents/');
                const relativePath = pathParts.length > 1 ? pathParts[1] : d.file_url;
                const { data: signedData, error: signErr } = await supabase.storage
                  .from('documents')
                  .createSignedUrl(relativePath, 3600);
                if (!signErr && signedData?.signedUrl) {
                  secureUrl = signedData.signedUrl;
                } else {
                  // Do not downgrade to public or raw file_url!
                  secureUrl = null;
                }
              } catch {
                secureUrl = null;
              }
            }

            return {
              id: d.id,
              name: d.name,
              category: d.category || 'identity',
              docNumber: d.document_number || 'DOC-PENDING',
              type: d.file_type || 'application/pdf',
              status: d.status || 'uploaded',
              size: d.file_size ? `${(d.file_size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
              fileUrl: secureUrl,
              uploadedAt: new Date(d.uploaded_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              expiryDate: d.expiry_date || null,
              daysToExpiry: d.expiry_date ? Math.ceil((new Date(d.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) : null,
              issuingAuthority: d.issuing_authority || 'Official Issuing Authority'
            };
          }));

          return docsWithSignedUrls;
        }
      }
    } catch (err) {
      console.error('[DocumentsAPI] Backend documents query failed:', err.message);
      if (import.meta.env.PROD) return [];
    }

    // Demo Mode Only
    if (profileId === 'demo-citizen-01') {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {
          // ignore
        }
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultSeedDocuments));
      return defaultSeedDocuments;
    }

    return [];
  },

  async uploadDocument(profileId, fileObj, metadata = {}) {
    const isAuthenticatedUser = profileId && profileId !== 'demo-citizen-01';
    const fileName = fileObj.name || 'Uploaded_Proof.pdf';
    const fileSizeFormatted = fileObj.size ? `${(fileObj.size / 1024 / 1024).toFixed(1)} MB` : '1.5 MB';
    const cleanDocName = metadata.name || fileName.replace(/\.[^/.]+$/, '');
    let storageFilePath = null;
    let signedUrl = null;

    // 1. Upload to Supabase Storage private bucket 'documents'
    if (isAuthenticatedUser) {
      storageFilePath = `${profileId}/${Date.now()}_${fileName}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(storageFilePath, fileObj, { upsert: true });

      if (storageError) {
        console.error('[DocumentsAPI] Supabase storage upload failed:', storageError.message);
        throw new Error(`Document storage upload failed: ${storageError.message}`);
      }

      if (storageData) {
        const { data: signedData, error: signErr } = await supabase.storage
          .from('documents')
          .createSignedUrl(storageFilePath, 3600); // 1-hour secure URL
        if (!signErr && signedData?.signedUrl) {
          signedUrl = signedData.signedUrl;
        }
      }
    }

    // 2. Metadata record — status is 'uploaded', NEVER auto-'verified' by client
    const newDocRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'doc-' + Date.now(),
      name: cleanDocName,
      category: metadata.category || 'user_upload',
      docNumber: metadata.docNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      type: fileObj.type || 'application/pdf',
      status: 'uploaded', // Honest initial state awaiting official verification
      size: fileSizeFormatted,
      fileUrl: signedUrl,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: metadata.expiryDate || '2027-12-31',
      daysToExpiry: metadata.expiryDate ? Math.ceil((new Date(metadata.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 365,
      issuingAuthority: metadata.issuingAuthority || 'Issuing Authority (Pending Verification)'
    };

    // 3. Insert into Supabase documents table
    if (isAuthenticatedUser) {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          id: newDocRecord.id,
          profile_id: profileId,
          name: newDocRecord.name,
          category: newDocRecord.category,
          document_number: newDocRecord.docNumber,
          file_type: fileObj.type || 'application/pdf',
          file_size: fileObj.size || 1500000,
          file_url: storageFilePath,
          status: 'uploaded',
          expiry_date: newDocRecord.expiryDate,
          issuing_authority: newDocRecord.issuingAuthority
        })
        .select()
        .single();

      if (error) {
        console.error('[DocumentsAPI] Document metadata insert rejected by database:', error.message);
        throw new Error(`Document registration failed: ${error.message}`);
      }

      if (data) {
        newDocRecord.id = data.id;
      }
    } else {
      // Demo session fallback
      const existing = await this.fetchUserDocuments(profileId);
      const updated = [newDocRecord, ...existing.filter(d => d.id !== newDocRecord.id && d.name !== newDocRecord.name)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    return newDocRecord;
  },

  // Authoritative Vault Completeness score: Evaluates category coverage and verification state
  calculateReadinessScore(userDocuments = []) {
    if (!userDocuments || userDocuments.length === 0) return 0;

    const keyCategories = ['identity', 'income', 'land', 'financial', 'household'];
    let verifiedScore = 0;
    const now = new Date();

    keyCategories.forEach(cat => {
      const doc = userDocuments.find(d => d.category === cat);
      if (doc) {
        const isExpired = doc.expiryDate && new Date(doc.expiryDate) < now;
        if (!isExpired) {
          if (doc.status === 'verified') {
            verifiedScore += 1.0;
          } else if (doc.status === 'expiring_soon') {
            verifiedScore += 0.8;
          } else if (doc.status === 'under_review') {
            verifiedScore += 0.5;
          } else if (doc.status === 'uploaded') {
            verifiedScore += 0.3;
          }
        }
      }
    });

    return Math.min(100, Math.round((verifiedScore / keyCategories.length) * 100));
  },

  // Status-Aware Scheme Document Readiness:
  // Distinguishes NOT_UPLOADED, UPLOADED, UNDER_REVIEW, VERIFIED, REJECTED, EXPIRED
  calculateSchemeDocumentReadiness(schemeRequiredDocs = [], userDocuments = []) {
    if (!schemeRequiredDocs || schemeRequiredDocs.length === 0) return 100;
    if (!userDocuments || userDocuments.length === 0) return 0;

    let totalScore = 0;
    const now = new Date();

    schemeRequiredDocs.forEach(reqDoc => {
      const reqLower = reqDoc.toLowerCase();
      const matchedDoc = userDocuments.find(uDoc => {
        const uName = (uDoc.name || '').toLowerCase();
        return (
          uName.includes(reqLower) || reqLower.includes(uName) ||
          (reqLower.includes('aadhaar') && uName.includes('aadhaar')) ||
          (reqLower.includes('income') && uName.includes('income')) ||
          (reqLower.includes('land') && (uName.includes('land') || uName.includes('7/12') || uName.includes('ror'))) ||
          (reqLower.includes('bank') && (uName.includes('bank') || uName.includes('passbook'))) ||
          (reqLower.includes('ration') && uName.includes('ration')) ||
          (reqLower.includes('caste') && (uName.includes('caste') || uName.includes('ncl') || uName.includes('certificate')))
        );
      });

      if (!matchedDoc) {
        totalScore += 0; // NOT_UPLOADED
      } else {
        const isExpired = matchedDoc.expiryDate && new Date(matchedDoc.expiryDate) < now;
        if (isExpired) {
          totalScore += 0; // EXPIRED provides 0 readiness
        } else if (matchedDoc.status === 'rejected') {
          totalScore += 0; // REJECTED provides 0 readiness
        } else if (matchedDoc.status === 'verified') {
          totalScore += 1.0; // VERIFIED provides full readiness
        } else if (matchedDoc.status === 'expiring_soon') {
          totalScore += 0.8;
        } else if (matchedDoc.status === 'under_review') {
          totalScore += 0.5; // UNDER_REVIEW pending official verification
        } else {
          totalScore += 0.3; // UPLOADED pending review
        }
      }
    });

    return Math.round((totalScore / schemeRequiredDocs.length) * 100);
  },

  // Detailed breakdown of requirements with authoritative statuses
  getDetailedDocumentReadiness(schemeRequiredDocs = [], userDocuments = []) {
    if (!schemeRequiredDocs || schemeRequiredDocs.length === 0) return { score: 100, items: [] };

    const now = new Date();
    const items = schemeRequiredDocs.map(reqDoc => {
      const reqLower = reqDoc.toLowerCase();
      const matchedDoc = (userDocuments || []).find(uDoc => {
        const uName = (uDoc.name || '').toLowerCase();
        return (
          uName.includes(reqLower) || reqLower.includes(uName) ||
          (reqLower.includes('aadhaar') && uName.includes('aadhaar')) ||
          (reqLower.includes('income') && uName.includes('income')) ||
          (reqLower.includes('land') && (uName.includes('land') || uName.includes('7/12') || uName.includes('ror'))) ||
          (reqLower.includes('bank') && (uName.includes('bank') || uName.includes('passbook'))) ||
          (reqLower.includes('ration') && uName.includes('ration')) ||
          (reqLower.includes('caste') && (uName.includes('caste') || uName.includes('ncl') || uName.includes('certificate')))
        );
      });

      if (!matchedDoc) {
        return { requirement: reqDoc, status: 'NOT_UPLOADED', doc: null, isReady: false };
      }

      const isExpired = matchedDoc.expiryDate && new Date(matchedDoc.expiryDate) < now;
      if (isExpired) {
        return { requirement: reqDoc, status: 'EXPIRED', doc: matchedDoc, isReady: false };
      }
      if (matchedDoc.status === 'rejected') {
        return { requirement: reqDoc, status: 'REJECTED', doc: matchedDoc, isReady: false };
      }
      if (matchedDoc.status === 'verified') {
        return { requirement: reqDoc, status: 'VERIFIED', doc: matchedDoc, isReady: true };
      }
      if (matchedDoc.status === 'under_review') {
        return { requirement: reqDoc, status: 'UNDER_REVIEW', doc: matchedDoc, isReady: false };
      }

      return { requirement: reqDoc, status: 'UPLOADED', doc: matchedDoc, isReady: false };
    });

    const score = this.calculateSchemeDocumentReadiness(schemeRequiredDocs, userDocuments);
    return { score, items };
  }
};

export default DocumentsAPI;
