'use client';

import { useRef, useState } from 'react';
import styled from 'styled-components';

const Zone = styled.div<{ $dragging: boolean; $hasFile: boolean }>`
  border: 2px dashed
    ${({ $dragging, $hasFile }) =>
      $dragging ? '#7c3aed' : $hasFile ? '#06b6d4' : 'rgba(255,255,255,0.15)'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: ${({ $dragging }) =>
    $dragging ? 'rgba(124,58,237,0.08)' : 'transparent'};

  &:hover {
    border-color: rgba(124, 58, 237, 0.5);
    background: rgba(124, 58, 237, 0.04);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Preview = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.75rem;
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: #64748b;
`;

const FileName = styled.p`
  font-size: 0.85rem;
  color: #06b6d4;
  margin-top: 0.5rem;
`;

interface Props {
  onFileSelect: (file: File) => void;
  currentUrl?: string | null;
}

export default function ImageUploader({ onFileSelect, currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [fileName, setFileName] = useState('');

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Zone
      $dragging={dragging}
      $hasFile={!!preview}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {preview ? (
        <>
          <Preview src={preview} alt="preview" />
          <FileName>{fileName || '현재 이미지'}</FileName>
          <Hint>클릭하여 변경</Hint>
        </>
      ) : (
        <Hint>이미지를 드래그하거나 클릭하여 업로드</Hint>
      )}
    </Zone>
  );
}
