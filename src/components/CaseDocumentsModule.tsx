import { useState } from 'react';
import { FileText, Flag, X } from 'lucide-react';
import { BackButton, PageHeading } from './ui';
import { useGameState } from '../context/GameStateContext';
import nhatKyQuetTheB19 from '../../doc/case-2010-tron-bo/3-dao-cu/DC-01-nhat-ky-quet-the-B19.png';
import nhatKySuDungXe from '../../doc/case-2010-tron-bo/3-dao-cu/DC-02-nhat-ky-su-dung-xe.png';
import soCapTheKhoB from '../../doc/case-2010-tron-bo/3-dao-cu/DC-03-so-cap-the-kho-B.png';
import bangDoiChieuGiaoDich from '../../doc/case-2010-tron-bo/3-dao-cu/DC-04-bang-doi-chieu-giao-dich.png';

const documents = [
  { title: 'Nhật ký quẹt thẻ B-19', filename: 'DC-01-nhat-ky-quet-the-B19.png', image: nhatKyQuetTheB19 },
  { title: 'Nhật ký sử dụng xe', filename: 'DC-02-nhat-ky-su-dung-xe.png', image: nhatKySuDungXe },
  { title: 'Sổ cấp thẻ kho B', filename: 'DC-03-so-cap-the-kho-B.png', image: soCapTheKhoB },
  { title: 'Bảng đối chiếu giao dịch', filename: 'DC-04-bang-doi-chieu-giao-dich.png', image: bangDoiChieuGiaoDich },
];

export function CaseDocumentsModule() {
  const { setActiveModule } = useGameState();
  const [selectedDocument, setSelectedDocument] = useState<(typeof documents)[number] | null>(null);

  return (
    <>
      <PageHeading
        eyebrow="CASE FILES / PHASE 04 UNLOCKED"
        title="Tài liệu vụ án"
        detail="Tập tài liệu được thu hồi sau khi hoàn tất Phase 03."
        action={(
          <div className="heading-actions">
            <BackButton onClick={() => setActiveModule('b19')} label="ARCHIVE B-19" />
            <button className="solid-action" onClick={() => setActiveModule('ending')}><Flag size={14} /> FINAL VERDICT</button>
          </div>
        )}
      />
      <section className="case-documents-grid">
        {documents.map((document) => (
          <button className="case-document-card" key={document.filename} onClick={() => setSelectedDocument(document)}>
            <span className="case-document-preview"><img src={document.image} alt={document.title} /></span>
            <span className="case-document-meta"><FileText size={15} /><strong>{document.title}</strong><small>{document.filename}</small></span>
          </button>
        ))}
      </section>
      {selectedDocument && (
        <div className="modal-backdrop document-viewer" onMouseDown={(event) => event.target === event.currentTarget && setSelectedDocument(null)}>
          <div className="case-document-viewer">
            <img src={selectedDocument.image} alt={selectedDocument.title} />
          </div>
          <div className="document-controls">
            <span>{selectedDocument.title}</span>
            <button onClick={() => setSelectedDocument(null)}><X /> CLOSE</button>
          </div>
        </div>
      )}
    </>
  );
}
