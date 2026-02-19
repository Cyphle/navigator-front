import './Families.scss';
import { useMemo, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { useUser } from '../../contexts/user/user.context';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import type { Family } from '../../stores/families/families.types';
import type { UpsertFamilyRequest } from '../../stores/families/families.types';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';

interface FamilyFormState {
  name: string;
  emails: string;
}

const parseEmails = (value: string): string[] => {
  return Array.from(
    new Set(
      value
        .split(/[\n,;]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0)
    )
  );
};

const getMemberCount = (family: Family): number => {
  return family.members.length + 1;
};

const FamiliesContent = ({ data }: { data: Family[] }) => {
  const { userState } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<number | null>(null);
  const [formState, setFormState] = useState<FamilyFormState>({ name: '', emails: '' });
  const [pendingStatusFamilyId, setPendingStatusFamilyId] = useState<number | null>(null);

  const ownerEmail = useMemo(() => {
    if (userState.email) {
      return userState.email;
    }

    if (userState.username) {
      return `${userState.username}@banana.fr`;
    }

    return 'owner@banana.fr';
  }, [userState.email, userState.username]);

  const handleCreateClick = () => {
    setEditingFamilyId(null);
    setFormState({ name: '', emails: '' });
    setIsFormOpen(true);
  };

  const handleEditClick = (family: Family) => {
    setEditingFamilyId(family.id);
    setFormState({
      name: family.name,
      emails: family.members.map((member) => member.email).join(', ')
    });
    setIsFormOpen(true);
  };

  const onMutationSuccess = () => {
    setIsFormOpen(false);
    setEditingFamilyId(null);
    setFormState({ name: '', emails: '' });
    setPendingStatusFamilyId(null);
  };

  const onMutationError = () => {
    setPendingStatusFamilyId(null);
  };

  const {
    mutate: createFamilyMutation,
    isPending: createFamilyPending,
  } = useCreateFamily(onMutationError, onMutationSuccess);

  const {
    mutate: updateFamilyMutation,
    isPending: updateFamilyPending,
  } = useUpdateFamily(onMutationError, onMutationSuccess);

  const handleDeactivate = (family: Family) => {
    setPendingStatusFamilyId(family.id);
    updateFamilyMutation({
      id: family.id,
      name: family.name,
      ownerEmail: family.owner.email,
      ownerName: family.owner.relation ?? 'Owner',
      memberEmails: family.members.map((member) => member.email),
      status: 'INACTIVE',
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emails = parseEmails(formState.emails).filter((email) => email !== ownerEmail);
    const ownerName = `${userState.firstName} ${userState.lastName}`.trim() || 'Owner';
    const editingFamily = editingFamilyId ? data.find((family) => family.id === editingFamilyId) : undefined;

    const payload: UpsertFamilyRequest = {
      id: editingFamilyId ?? undefined,
      name: formState.name.trim() || 'Nouvelle famille',
      ownerEmail: editingFamily?.owner.email ?? ownerEmail,
      ownerName: editingFamily?.owner.relation ?? ownerName,
      memberEmails: emails
    };

    if (editingFamilyId) {
      updateFamilyMutation(payload);
    } else {
      createFamilyMutation(payload);
    }
  };

  return (
    <div className="families-page">
      <header className="families-header">
        <div>
          <h1>Familles</h1>
          <p>Gere les espaces familiaux, les membres et leur statut.</p>
        </div>
        <Button type="primary" onClick={handleCreateClick}>
          Creer une famille
        </Button>
      </header>

      <section className="families-grid">
        {data.map((family) => (
          <article key={family.id} className="family-card">
            <div className="family-card__header">
              <div>
                <h2>{family.name}</h2>
                <p>{getMemberCount(family)} membres</p>
              </div>
              <span className={`family-card__status family-card__status--${family.status.toLowerCase()}`}>
                {family.status === 'ACTIVE' ? 'Actif' : 'Desactive'}
              </span>
            </div>
            <div className="family-card__owner">
              <span>Owner</span>
              <strong>{family.owner.email}</strong>
            </div>
            <ul className="family-card__members">
              {family.members.map((member) => (
                <li key={member.id}>
                  <span>{member.relation ?? 'Membre'}</span>
                  <span>{member.email}</span>
                </li>
              ))}
            </ul>
            <div className="family-card__actions">
              <Button onClick={() => handleEditClick(family)} disabled={family.status === 'INACTIVE'}>
                Modifier
              </Button>
              <Button
                danger
                onClick={() => handleDeactivate(family)}
                disabled={family.status === 'INACTIVE' || pendingStatusFamilyId === family.id}
              >
                Desactiver
              </Button>
            </div>
          </article>
        ))}
      </section>

      <Modal
        title={editingFamilyId ? 'Modifier la famille' : 'Creer une famille'}
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        footer={null}
        className="family-form-modal"
      >
        <form onSubmit={handleSubmit} className="family-form">
          <label htmlFor="family-name">Nom de la famille</label>
          <Input
            id="family-name"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nom de la famille"
          />

          <label htmlFor="family-emails">Emails des membres</label>
          <Input.TextArea
            id="family-emails"
            value={formState.emails}
            onChange={(event) => setFormState((prev) => ({ ...prev, emails: event.target.value }))}
            placeholder="email1@exemple.fr, email2@exemple.fr"
            rows={3}
          />

          <div className="family-form__actions">
            <Button htmlType="submit" type="primary" disabled={createFamilyPending || updateFamilyPending}>
              {editingFamilyId ? 'Mettre a jour' : 'Creer'}
            </Button>
            <Button type="default" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const Families = withFetchTemplate<any, Family[]>(FamiliesContent, useFetchFamilies);
