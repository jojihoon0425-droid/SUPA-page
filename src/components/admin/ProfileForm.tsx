'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import ImageUploader from './ImageUploader';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const Input = styled.input`
  padding: 0.7rem 0.9rem;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #7c3aed;
  }
`;

const Textarea = styled.textarea`
  padding: 0.7rem 0.9rem;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #7c3aed;
  }
`;

const Hint = styled.p`
  font-size: 0.78rem;
  color: #4b5563;
`;

const SaveBtn = styled.button`
  align-self: flex-start;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatusMsg = styled.p<{ $error?: boolean }>`
  font-size: 0.85rem;
  color: ${({ $error }) => ($error ? '#ef4444' : '#22c55e')};
`;

interface Props {
  profile: Profile | null;
}

export default function ProfileForm({ profile }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: profile?.name ?? '',
    tagline: profile?.tagline ?? '',
    school: profile?.school ?? '',
    age: profile?.age?.toString() ?? '',
    bio: profile?.bio ?? '',
    interests: profile?.interests?.join(', ') ?? '',
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const supabase = createClient();

    let profile_image_url = profile?.profile_image_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `profile/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(path, imageFile, { upsert: true });

      if (uploadError) {
        setStatus('이미지 업로드 실패: ' + uploadError.message);
        setIsError(true);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(path);
      profile_image_url = urlData.publicUrl;
    }

    const payload = {
      name: form.name,
      tagline: form.tagline || null,
      school: form.school || null,
      age: form.age ? parseInt(form.age) : null,
      bio: form.bio || null,
      interests: form.interests
        ? form.interests.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      profile_image_url,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (profile?.id) {
      ({ error } = await supabase
        .from('profile')
        .update(payload)
        .eq('id', profile.id));
    } else {
      ({ error } = await supabase.from('profile').insert(payload));
    }

    if (error) {
      setStatus('저장 실패: ' + error.message);
      setIsError(true);
    } else {
      setStatus('저장되었습니다.');
      setIsError(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Field>
          <Label>이름 *</Label>
          <Input value={form.name} onChange={set('name')} placeholder="홍길동" required />
        </Field>
        <Field>
          <Label>나이</Label>
          <Input type="number" value={form.age} onChange={set('age')} placeholder="20" min={1} max={99} />
        </Field>
      </Row>

      <Field>
        <Label>한 줄 소개</Label>
        <Input value={form.tagline} onChange={set('tagline')} placeholder="개발을 좋아하는 학생입니다." />
      </Field>

      <Field>
        <Label>학교</Label>
        <Input value={form.school} onChange={set('school')} placeholder="○○대학교 컴퓨터공학과" />
      </Field>

      <Field>
        <Label>관심사 (쉼표로 구분)</Label>
        <Input value={form.interests} onChange={set('interests')} placeholder="웹 개발, AI, 게임" />
        <Hint>예: 웹 개발, 머신러닝, 음악</Hint>
      </Field>

      <Field>
        <Label>소개글</Label>
        <Textarea value={form.bio} onChange={set('bio')} placeholder="자유롭게 소개글을 작성해주세요." />
      </Field>

      <Field>
        <Label>프로필 이미지</Label>
        <ImageUploader onFileSelect={setImageFile} currentUrl={profile?.profile_image_url} />
      </Field>

      {status && <StatusMsg $error={isError}>{status}</StatusMsg>}

      <SaveBtn type="submit" disabled={loading}>
        {loading ? '저장 중...' : '저장하기'}
      </SaveBtn>
    </Form>
  );
}
