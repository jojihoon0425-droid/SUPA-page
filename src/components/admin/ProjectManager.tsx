'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/lib/types';
import ImageUploader from './ImageUploader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
`;

const CardThumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #1a1a2e;
`;

const CardThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15));
`;

const CardBody = styled.div`
  padding: 0.9rem;
`;

const CardTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.35rem;
`;

const CardDesc = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditBtn = styled.button`
  flex: 1;
  font-size: 0.8rem;
  color: #06b6d4;
  padding: 0.35rem 0;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover { background: rgba(6, 182, 212, 0.1); }
`;

const DeleteBtn = styled.button`
  flex: 1;
  font-size: 0.8rem;
  color: #ef4444;
  padding: 0.35rem 0;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover { background: rgba(239, 68, 68, 0.1); }
`;

const AddBtn = styled.button`
  align-self: flex-start;
  padding: 0.65rem 1.25rem;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 8px;
  color: #67e8f9;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover { background: rgba(6, 182, 212, 0.22); }
`;

const FormTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  background: #13131a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.83rem;
  color: #94a3b8;
`;

const Input = styled.input`
  padding: 0.65rem 0.9rem;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;

  &:focus { border-color: #7c3aed; }
`;

const Textarea = styled.textarea`
  padding: 0.65rem 0.9rem;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  min-height: 90px;

  &:focus { border-color: #7c3aed; }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SaveBtn = styled.button`
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CancelBtn = styled.button`
  padding: 0.65rem 1.25rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.05); }
`;

const StatusMsg = styled.p<{ $error?: boolean }>`
  font-size: 0.85rem;
  color: ${({ $error }) => ($error ? '#ef4444' : '#22c55e')};
`;

const Empty = styled.div`
  padding: 2.5rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed rgba(255,255,255,0.08);
  border-radius: 12px;
`;

const defaultForm = { title: '', description: '', display_order: 0 };

interface Props {
  projects: Project[];
}

export default function ProjectManager({ projects: initialProjects }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const set = (key: keyof typeof defaultForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: key === 'display_order' ? Number(e.target.value) : e.target.value }));

  const startEdit = (project: Project) => {
    setEditing(project);
    setForm({ title: project.title, description: project.description ?? '', display_order: project.display_order });
    setImageFile(null);
    setShowForm(true);
    setStatus('');
  };

  const startAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setShowForm(true);
    setStatus('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setStatus('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const supabase = createClient();
    let thumbnail_url = editing?.thumbnail_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `projects/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(path, imageFile);

      if (uploadError) {
        setStatus('이미지 업로드 실패: ' + uploadError.message);
        setIsError(true);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(path);
      thumbnail_url = urlData.publicUrl;
    }

    const payload = {
      title: form.title,
      description: form.description || null,
      thumbnail_url,
      display_order: form.display_order,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editing.id));
      if (!error) {
        setProjects((prev) =>
          prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p)
        );
      }
    } else {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({ ...payload, created_at: new Date().toISOString() })
        .select()
        .single();
      error = insertError;
      if (!error && data) setProjects((prev) => [...prev, data]);
    }

    if (error) {
      setStatus('저장 실패: ' + error.message);
      setIsError(true);
    } else {
      setStatus('저장되었습니다.');
      setIsError(false);
      setShowForm(false);
      setEditing(null);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  return (
    <Wrapper>
      {projects.length === 0 ? (
        <Empty>아직 프로젝트가 없습니다.</Empty>
      ) : (
        <Grid>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardThumb>
                {project.thumbnail_url ? (
                  <Image src={project.thumbnail_url} alt={project.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <CardThumbPlaceholder>🚀</CardThumbPlaceholder>
                )}
              </CardThumb>
              <CardBody>
                <CardTitle>{project.title}</CardTitle>
                {project.description && <CardDesc>{project.description}</CardDesc>}
                <CardActions>
                  <EditBtn onClick={() => startEdit(project)}>수정</EditBtn>
                  <DeleteBtn onClick={() => handleDelete(project.id)}>삭제</DeleteBtn>
                </CardActions>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}

      {!showForm && <AddBtn onClick={startAdd}>+ 프로젝트 추가</AddBtn>}

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <FormTitle>{editing ? '프로젝트 수정' : '프로젝트 추가'}</FormTitle>
          <Field>
            <Label>제목 *</Label>
            <Input value={form.title} onChange={set('title')} placeholder="프로젝트 이름" required />
          </Field>
          <Field>
            <Label>설명</Label>
            <Textarea value={form.description} onChange={set('description')} placeholder="프로젝트에 대한 설명을 입력하세요." />
          </Field>
          <Field>
            <Label>순서</Label>
            <Input type="number" value={form.display_order} onChange={set('display_order')} min={0} />
          </Field>
          <Field>
            <Label>썸네일 이미지</Label>
            <ImageUploader onFileSelect={setImageFile} currentUrl={editing?.thumbnail_url} />
          </Field>
          {status && <StatusMsg $error={isError}>{status}</StatusMsg>}
          <BtnRow>
            <SaveBtn type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장하기'}
            </SaveBtn>
            <CancelBtn type="button" onClick={handleCancel}>취소</CancelBtn>
          </BtnRow>
        </Form>
      )}
    </Wrapper>
  );
}
