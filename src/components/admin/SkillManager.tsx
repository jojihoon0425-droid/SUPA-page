'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { createClient } from '@/lib/supabase/client';
import type { Skill } from '@/lib/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Table = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  padding: 0.75rem 1rem;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: #f1f5f9;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const SkillName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelDots = styled.div`
  display: flex;
  gap: 3px;
`;

const Dot = styled.span<{ $active: boolean; $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active, $color }) => ($active ? $color : 'rgba(255,255,255,0.1)')};
`;

const ActionBtns = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditBtn = styled.button`
  font-size: 0.8rem;
  color: #06b6d4;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover { background: rgba(6, 182, 212, 0.1); }
`;

const DeleteBtn = styled.button`
  font-size: 0.8rem;
  color: #ef4444;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  transition: background 0.2s;

  &:hover { background: rgba(239, 68, 68, 0.1); }
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

const Select = styled.select`
  padding: 0.65rem 0.9rem;
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-size: 0.9rem;
  outline: none;

  &:focus { border-color: #7c3aed; }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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

const AddBtn = styled.button`
  align-self: flex-start;
  padding: 0.65rem 1.25rem;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 8px;
  color: #c4b5fd;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover { background: rgba(124, 58, 237, 0.25); }
`;

const StatusMsg = styled.p<{ $error?: boolean }>`
  font-size: 0.85rem;
  color: ${({ $error }) => ($error ? '#ef4444' : '#22c55e')};
`;

const Empty = styled.div`
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
`;

const defaultForm = {
  name: '',
  icon: '',
  level: 3,
  category: '',
  color: '#7c3aed',
  display_order: 0,
};

interface Props {
  skills: Skill[];
}

export default function SkillManager({ skills: initialSkills }: Props) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const set = (key: keyof typeof defaultForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: key === 'level' || key === 'display_order' ? Number(e.target.value) : e.target.value }));

  const startEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
      color: skill.color,
      display_order: skill.display_order,
    });
    setShowForm(true);
    setStatus('');
  };

  const startAdd = () => {
    setEditing(null);
    setForm(defaultForm);
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
    const payload = { ...form };

    let error;
    if (editing) {
      ({ error } = await supabase.from('skills').update(payload).eq('id', editing.id));
      if (!error) {
        setSkills((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...payload } : s));
      }
    } else {
      const { data, error: insertError } = await supabase
        .from('skills')
        .insert(payload)
        .select()
        .single();
      error = insertError;
      if (!error && data) setSkills((prev) => [...prev, data]);
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
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  };

  return (
    <Wrapper>
      <Table>
        <TableHeader>
          <span>스킬</span>
          <span>카테고리</span>
          <span>레벨</span>
          <span></span>
        </TableHeader>
        {skills.length === 0 ? (
          <Empty>아직 스킬이 없습니다.</Empty>
        ) : (
          skills.map((skill) => (
            <TableRow key={skill.id}>
              <SkillName>
                <span>{skill.icon}</span>
                <span>{skill.name}</span>
              </SkillName>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{skill.category}</span>
              <LevelDots>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Dot key={i} $active={i < skill.level} $color={skill.color || '#7c3aed'} />
                ))}
              </LevelDots>
              <ActionBtns>
                <EditBtn onClick={() => startEdit(skill)}>수정</EditBtn>
                <DeleteBtn onClick={() => handleDelete(skill.id)}>삭제</DeleteBtn>
              </ActionBtns>
            </TableRow>
          ))
        )}
      </Table>

      {!showForm && <AddBtn onClick={startAdd}>+ 스킬 추가</AddBtn>}

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <FormTitle>{editing ? '스킬 수정' : '스킬 추가'}</FormTitle>
          <Row>
            <Field>
              <Label>스킬 이름 *</Label>
              <Input value={form.name} onChange={set('name')} placeholder="React" required />
            </Field>
            <Field>
              <Label>아이콘 (이모지)</Label>
              <Input value={form.icon} onChange={set('icon')} placeholder="⚛️" />
            </Field>
          </Row>
          <Row>
            <Field>
              <Label>카테고리</Label>
              <Input value={form.category} onChange={set('category')} placeholder="프로그래밍" />
            </Field>
            <Field>
              <Label>레벨 (1~5)</Label>
              <Select value={form.level} onChange={set('level')}>
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </Field>
          </Row>
          <Row>
            <Field>
              <Label>색상 (hex)</Label>
              <Input value={form.color} onChange={set('color')} placeholder="#7c3aed" />
            </Field>
            <Field>
              <Label>순서</Label>
              <Input type="number" value={form.display_order} onChange={set('display_order')} min={0} />
            </Field>
          </Row>
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
