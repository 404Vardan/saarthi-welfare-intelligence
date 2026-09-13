import { supabase } from './supabaseClient';

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
          console.warn('[DocumentsAPI] Database query notice:', error.message);
        } else if (data && data.length > 0) {
          // Generate time-limited signed URLs for each private document
          const docsWithSignedUrls = await Promise.all(data.map(async (d) => {
            let secureUrl = '#';
            if (d.file_url && d.file_url !== '#') {
              try {
                // If it's stored in Supabase private bucket, generate 1-hour signed URL
                const pathParts = d.file_url.split('/documents/');
                const relativePath = pathParts.length > 1 ? pathParts[1] : d.file_url;
                const { data: signedData } = await supabase.storage
                  .from('documents')
                  .createSignedUrl(relativePath, 3600);
                if (signedData?.signedUrl) secureUrl = signedData.signedUrl;
              } catch {
                secureUrl = d.file_url;
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
      console.warn('Backend documents query failed, using local vault:', err);
    }

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
  },

  async uploadDocument(profileId, fileObj, metadata = {}) {
    const fileName = fileObj.name || 'Uploaded_Proof.pdf';
    const fileSizeFormatted = fileObj.size ? `${(fileObj.size / 1024 / 1024).toFixed(1)} MB` : '1.5 MB';
    const cleanDocName = metadata.name || fileName.replace(/\.[^/.]+$/, '');
    let storageFilePath = null;
    let signedUrl = '#';

    // 1. Upload to Supabase Storage private bucket 'documents'
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        storageFilePath = `${profileId}/${Date.now()}_${fileName}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('documents')
          .upload(storageFilePath, fileObj, { upsert: true });

        if (storageError) {
          console.warn('[DocumentsAPI] Storage upload notice:', storageError.message);
        } else if (storageData) {
          const { data: signedData } = await supabase.storage
            .from('documents')
            .createSignedUrl(storageFilePath, 3600); // 1-hour secure URL
          signedUrl = signedData?.signedUrl || '#';
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload offline, storing metadata locally:', storageErr);
    }

    // 2. Metadata record — status is 'uploaded' (or 'under_review'), NEVER auto-'verified'
    const newDocRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'doc-' + Date.now(),
      name: cleanDocName,
      category: metadata.category || 'user_upload',
      docNumber: metadata.docNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      type: fileObj.type || 'application/pdf',
      status: 'uploaded', // Honest state: newly uploaded proof awaiting authority/OCR verification
      size: fileSizeFormatted,
      fileUrl: signedUrl,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: metadata.expiryDate || '2027-12-31',
      daysToExpiry: metadata.expiryDate ? Math.ceil((new Date(metadata.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 365,
      issuingAuthority: metadata.issuingAuthority || 'Issuing Authority (Pending Verification)'
    };

    // 3. Insert into Supabase documents table
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
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
            file_url: storageFilePath || signedUrl,
            status: 'uploaded',
            expiry_date: newDocRecord.expiryDate,
            issuing_authority: newDocRecord.issuingAuthority
          })
          .select()
          .single();

        if (error) {
          console.warn('[DocumentsAPI] Metadata insertion notice:', error.message);
        } else if (data) {
          newDocRecord.id = data.id;
        }
      }
    } catch (err) {
      console.warn('Backend document metadata insert failed:', err);
    }

    // 4. Update local cache
    const existing = await this.fetchUserDocuments(profileId);
    const updated = [newDocRecord, ...existing.filter(d => d.id !== newDocRecord.id && d.name !== newDocRecord.name)];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newDocRecord;
  },

  // Global Vault Completeness score
  calculateReadinessScore(userDocuments = []) {
    if (!userDocuments || userDocuments.length === 0) return 30;

    const keyCategories = ['identity', 'income', 'land', 'financial', 'household'];
    const availableCategories = new Set(userDocuments.map(d => d.category));

    let matched = 0;
    keyCategories.forEach(cat => {
      if (availableCategories.has(cat)) matched++;
    });

    const baseScore = Math.round((matched / keyCategories.length) * 100);
    return Math.min(100, Math.max(35, baseScore));
  },

  // Specific Scheme Readiness score (Exact requirement matching)
  calculateSchemeDocumentReadiness(schemeRequiredDocs = [], userDocuments = []) {
    if (!schemeRequiredDocs || schemeRequiredDocs.length === 0) return 100;
    if (!userDocuments || userDocuments.length === 0) return 0;

    const userDocNames = userDocuments.map(d => (d.name || '').toLowerCase());
    let matchedCount = 0;

    schemeRequiredDocs.forEach(reqDoc => {
      const reqLower = reqDoc.toLowerCase();
      const isPresent = userDocNames.some(uDoc => 
        uDoc.includes(reqLower) || reqLower.includes(uDoc) ||
        (reqLower.includes('aadhaar') && uDoc.includes('aadhaar')) ||
        (reqLower.includes('income') && uDoc.includes('income')) ||
        (reqLower.includes('land') && (uDoc.includes('land') || uDoc.includes('7/12') || uDoc.includes('ror'))) ||
        (reqLower.includes('bank') && (uDoc.includes('bank') || uDoc.includes('passbook'))) ||
        (reqLower.includes('ration') && uDoc.includes('ration')) ||
        (reqLower.includes('caste') && (uDoc.includes('caste') || uDoc.includes('ncl') || uDoc.includes('certificate')))
      );
      if (isPresent) matchedCount++;
    });

    return Math.round((matchedCount / schemeRequiredDocs.length) * 100);
  }
};

export default DocumentsAPI;
