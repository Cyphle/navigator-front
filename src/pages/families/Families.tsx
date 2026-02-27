import './Families.scss';
import { useMemo, useState } from 'react';
import { Button } from 'antd';
import { useUser } from '../../contexts/user/user.context';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import type { Family } from '../../stores/families/families.types';
import type { UpsertFamilyRequest } from '../../stores/families/families.types';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';
import { CreateUpdateFamily, type FamilyFormValues, type CreateUpdateFamilyPayload } from './components/CreateUpdateFamily';

const getMemberCount = (family: Family): number => {
  return family.members.length + 1;
};

const FamiliesContent = ({ data }: { data: Family[] }) => {
  const { userState } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<number | null>(null);
  const [pendingStatusFamilyId, setPendingStatusFamilyId] = useState<number | null>(null);
  const defaultFormValues: FamilyFormValues = { name: '', emails: '' };
  const [formValues, setFormValues] = useState<FamilyFormValues>(defaultFormValues);

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
    setFormValues(defaultFormValues);
    setIsFormOpen(true);
  };

  const handleEditClick = (family: Family) => {
    setEditingFamilyId(family.id);
    setFormValues({
      name: family.name,
      emails: family.members.map((member) => member.email).join(', ')
    });
    setIsFormOpen(true);
  };

  const onMutationSuccess = () => {
    setIsFormOpen(false);
    setEditingFamilyId(null);
    setFormValues(defaultFormValues);
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

  const onSubmit = (values: CreateUpdateFamilyPayload) => {
    const memberEmails = values.memberEmails.filter((email) => email !== ownerEmail);
    const ownerName = `${userState.firstName} ${userState.lastName}`.trim() || 'Owner';
    const editingFamily = editingFamilyId ? data.find((family) => family.id === editingFamilyId) : undefined;

    const payload: UpsertFamilyRequest = {
      id: editingFamilyId ?? undefined,
      name: values.name,
      ownerEmail: editingFamily?.owner.email ?? ownerEmail,
      ownerName: editingFamily?.owner.relation ?? ownerName,
      memberEmails: memberEmails
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

      <CreateUpdateFamily
        isOpen={isFormOpen}
        isEditing={Boolean(editingFamilyId)}
        initialValues={formValues}
        isSubmitting={createFamilyPending || updateFamilyPending}
        onSubmit={onSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
};

export const Families = withFetchTemplate<any, Family[]>(FamiliesContent, useFetchFamilies);
