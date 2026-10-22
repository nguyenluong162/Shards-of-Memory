import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { BackButton, PageHeading } from './ui';
import { useGameState } from '../context/GameStateContext';
import danhSachB19 from '../../doc/TaiLieuVuAn/DanhSachB19.png';
import danhSachKhoB from '../../doc/TaiLieuVuAn/DanhSachKhoB.png';
import nhatKyRoiKho from '../../doc/TaiLieuVuAn/NhatKyRoiKho.png';
import nhatKyXe from '../../doc/TaiLieuVuAn/NhatKyXe.png';

const documents = [
  { title: 'Danh sách Kho B', filename: 'DanhSachKhoB.png', image: danhSachKhoB },
  { title: 'Danh sách B-19', filename: 'DanhSachB19.png', image: danhSachB19 },
  { title: 'Nhật ký rời kho', filename: 'NhatKyRoiKho.png', image: nhatKyRoiKho },
  { title: 'Nhật ký xe', filename: 'NhatKyXe.png', image: nhatKyXe },
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
        action={<BackButton onClick={() => setActiveModule('b19')} label="ARCHIVE B-19" />}
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
