import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'saarthi_citizen_documents';

const defaultSeedDocuments = [
  { id: 'doc-1', name: 'Aadhaar Card', type: 'identification', status: 'verified', size: '1.2 MB', fileUrl: '#', uploadedAt: '10 Jan 2026' },
  { id: 'doc-2', name: 'Bank Passbook (DBT-Linked)', type: 'financial', status: 'verified', size: '2.4 MB', fileUrl: '#', uploadedAt: '12 Jan 2026' },
  { id: 'doc-3', name: 'Ration Card (PHH)', type: 'household', status: 'verified', size: '890 KB', fileUrl: '#', uploadedAt: '04 Feb 2026' },
  { id: 'doc-4', name: 'Income Certificate (Tehsildar)', type: 'income', status: 'pending', size: '—', fileUrl: '', uploadedAt: 'Missing' },
  { id: 'doc-5', name: 'Land Record (7/12 RoR)', type: 'land', status: 'pending', size: '—', fileUrl: '', uploadedAt: 'Missing' }
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
            type: d.file_type || 'identification',
            status: d.status || 'verified',
            size: d.file_size ? `${(d.file_size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
            fileUrl: d.file_url || '#',
            uploadedAt: new Date(d.uploaded_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
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

  async uploadDocument(profileId, fileObj) {
    const fileName = fileObj.name || 'Uploaded_Document.pdf';
    const fileSizeFormatted = fileObj.size ? `${(fileObj.size / 1024 / 1024).toFixed(1)} MB` : '1.5 MB';
    const cleanDocName = fileName.replace(/\.[^/.]+$/, '');
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

    // 2. Insert metadata record in Supabase documents table
    const newDocRecord = {
      id: 'doc-' + Date.now(),
      name: cleanDocName,
      type: 'user_upload',
      status: 'verified',
      size: fileSizeFormatted,
      fileUrl: uploadedFileUrl,
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    try {
      if (profileId && profileId !== 'demo-citizen-01') {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            profile_id: profileId,
            name: newDocRecord.name,
            file_type: fileObj.type || 'application/pdf',
            file_size: fileObj.size || 1500000,
            file_url: uploadedFileUrl,
            status: 'verified'
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
    const updated = existing.some(d => d.name.toLowerCase() === newDocRecord.name.toLowerCase())
      ? existing.map(d => d.name.toLowerCase() === newDocRecord.name.toLowerCase() ? newDocRecord : d)
      : [newDocRecord, ...existing];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newDocRecord;
  },

  calculateReadinessScore(userDocuments = [], eligibleSchemes = []) {
    if (!userDocuments || userDocuments.length === 0) return 0;

    const requiredDocs = new Set();
    eligibleSchemes.forEach(s => {
      const docs = s.documents || [];
      docs.forEach(d => requiredDocs.add(d.toLowerCase().trim()));
    });

    if (requiredDocs.size === 0) return 85;

    let verifiedCount = 0;
    const verifiedUserDocs = userDocuments.filter(d => d.status === 'verified').map(d => d.name.toLowerCase());

    requiredDocs.forEach(req => {
      const isFulfilled = verifiedUserDocs.some(userDoc =>
        userDoc.includes(req) || req.includes(userDoc) ||
        (req.includes('aadhaar') && userDoc.includes('aadhaar')) ||
        (req.includes('bank') && userDoc.includes('bank')) ||
        (req.includes('income') && userDoc.includes('income')) ||
        (req.includes('land') && userDoc.includes('land')) ||
        (req.includes('ration') && userDoc.includes('ration'))
      );
      if (isFulfilled) verifiedCount++;
    });

    const score = Math.round((verifiedCount / requiredDocs.size) * 100);
    return Math.min(100, Math.max(20, score));
  }
};

export default DocumentsAPI;
