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

        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            name: d.name,
            category: d.category || 'identity',
            docNumber: d.document_number || 'DOC-VERIFIED',
            type: d.file_type || 'application/pdf',
            status: d.status || 'verified',
            size: d.file_size ? `${(d.file_size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
            fileUrl: d.file_url || '#',
            uploadedAt: new Date(d.uploaded_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            expiryDate: d.expiry_date || null,
            daysToExpiry: d.expiry_date ? Math.ceil((new Date(d.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) : null,
            issuingAuthority: d.issuing_authority || 'Official Issuing Authority'
          }));
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
    let uploadedFileUrl = '#';

    // 1. Attempt upload to Supabase Storage bucket 'documents'
    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        const storagePath = `${profileId}/${Date.now()}_${fileName}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('documents')
          .upload(storagePath, fileObj, { upsert: true });

        if (!storageError && storageData) {
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(storagePath);
          uploadedFileUrl = publicUrlData?.publicUrl || '#';
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload bypassed/offline, saving local record:', storageErr);
    }

    // 2. Metadata record
    const newDocRecord = {
      id: 'doc-' + Date.now(),
      name: cleanDocName,
      category: metadata.category || 'user_upload',
      docNumber: metadata.docNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      type: fileObj.type || 'application/pdf',
      status: 'verified',
      size: fileSizeFormatted,
      fileUrl: uploadedFileUrl,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: metadata.expiryDate || '2027-12-31',
      daysToExpiry: metadata.expiryDate ? Math.ceil((new Date(metadata.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 365,
      issuingAuthority: metadata.issuingAuthority || 'Verified Government Entity'
    };

    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            profile_id: profileId,
            name: newDocRecord.name,
            category: newDocRecord.category,
            document_number: newDocRecord.docNumber,
            file_type: fileObj.type || 'application/pdf',
            file_size: fileObj.size || 1500000,
            file_url: uploadedFileUrl,
            status: 'verified',
            expiry_date: newDocRecord.expiryDate,
            issuing_authority: newDocRecord.issuingAuthority
          })
          .select()
          .single();

        if (!error && data) {
          newDocRecord.id = data.id;
        }
      }
    } catch (err) {
      console.warn('Backend document metadata insert failed, saving locally:', err);
    }

    // 3. Update local cache
    const existing = await this.fetchUserDocuments(profileId);
    const updated = [newDocRecord, ...existing.filter(d => d.id !== newDocRecord.id && d.name !== newDocRecord.name)];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newDocRecord;
  },

  calculateReadinessScore(userDocuments = [], eligibleSchemes = []) {
    if (!userDocuments || userDocuments.length === 0) return 30;

    const keyCategories = ['identity', 'income', 'land', 'financial', 'household'];
    const availableCategories = new Set(userDocuments.filter(d => d.status === 'verified' || d.status === 'expiring_soon').map(d => d.category));

    let matched = 0;
    keyCategories.forEach(cat => {
      if (availableCategories.has(cat)) matched++;
    });

    const baseScore = Math.round((matched / keyCategories.length) * 100);
    return Math.min(100, Math.max(35, baseScore));
  }
};

export default DocumentsAPI;
