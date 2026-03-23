import { useMemo, useState } from 'react';
import { useUser } from '../../contexts/user/user.context';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import type { Family } from '../../stores/families/families.types';
import type { UpsertFamilyRequest } from '../../stores/families/families.types';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';
import { CreateUpdateFamily, type FamilyFormValues, type CreateUpdateFamilyPayload } from './components/CreateUpdateFamily';
import { Users, User, Settings, ShieldAlert, Plus } from 'lucide-react';

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
    if (userState.email) return userState.email;
    if (userState.username) return `${userState.username}@banana.fr`;
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
      emails: family.members.map((member) => member.email).join(', '),
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

  const { mutate: createFamilyMutation, isPending: createFamilyPending } =
    useCreateFamily(onMutationError, onMutationSuccess);

  const { mutate: updateFamilyMutation, isPending: updateFamilyPending } =
    useUpdateFamily(onMutationError, onMutationSuccess);

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
    const editingFamily = editingFamilyId
      ? data.find((family) => family.id === editingFamilyId)
      : undefined;

    const payload: UpsertFamilyRequest = {
      id: editingFamilyId ?? undefined,
      name: values.name,
      ownerEmail: editingFamily?.owner.email ?? ownerEmail,
      ownerName: editingFamily?.owner.relation ?? ownerName,
      memberEmails,
    };

    if (editingFamilyId) {
      updateFamilyMutation(payload);
    } else {
      createFamilyMutation(payload);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Créer une famille
        </button>
      </div>

      {/* Cards grid */}
      <section>
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
            >
              <Users className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
                Aucune famille pour le moment
              </p>
              <p className="text-sm mt-1 m-0" style={{ color: 'var(--mist)' }}>
                Créez votre première famille pour commencer à utiliser Navigator.
              </p>
            </div>
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
            >
              <Plus className="w-4 h-4" />
              Créer une famille
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {data.map((family) => (
          <div
            key={family.id}
            className="bg-white rounded-[var(--radius-lg)] overflow-hidden flex flex-col relative"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {/* Accent bar — gradient ocean → sage */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(to right, var(--ocean), var(--sage-light))' }}
              aria-hidden="true"
            />

            {/* Card body */}
            <div className="p-6 pt-7 flex flex-col flex-1">
              {/* Title row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="font-display text-xl font-bold m-0"
                    style={{ color: 'var(--stone)' }}
                  >
                    {family.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--mist)' }}>
                    <Users className="w-3.5 h-3.5" />
                    <span>{getMemberCount(family)} membre{getMemberCount(family) > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Status badge */}
                {family.status === 'ACTIVE' ? (
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                    style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
                  >
                    Actif
                  </span>
                ) : (
                  <span
                    className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-gray-100 text-gray-400"
                  >
                    Désactivé
                  </span>
                )}
              </div>

              {/* Owner block */}
              <div
                className="rounded-[var(--radius-sm)] p-3 flex items-center justify-between mb-4"
                style={{ background: 'var(--sand)' }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide m-0 mb-0.5" style={{ color: 'var(--mist)' }}>
                    Owner
                  </p>
                  <p className="text-sm font-medium m-0 truncate max-w-[180px]" style={{ color: 'var(--stone)' }}>
                    {family.owner.email}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                  style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
                >
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* Members list */}
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-2 m-0" style={{ color: 'var(--mist)' }}>
                  Membres
                </p>
                <ul className="list-none p-0 m-0 space-y-1">
                  {family.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between text-sm py-1.5 border-b border-black/5 last:border-0"
                    >
                      <span className="text-xs font-medium" style={{ color: 'var(--mist)' }}>
                        {member.relation ?? 'Membre'}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--stone)' }}>
                        {member.email}
                      </span>
                    </li>
                  ))}
                  {family.members.length === 0 && (
                    <li className="text-sm py-2 italic" style={{ color: 'var(--mist)' }}>
                      Aucun autre membre
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-5 mt-5 border-t border-black/5">
                <button
                  className="flex-1 flex items-center justify-center gap-2 border text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--ocean-pale)] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)', background: 'transparent' }}
                  onClick={() => handleEditClick(family)}
                  disabled={family.status === 'INACTIVE'}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Modifier
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 border text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--coral-pale)] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: 'var(--coral)', color: 'var(--coral)', background: 'transparent' }}
                  onClick={() => handleDeactivate(family)}
                  disabled={family.status === 'INACTIVE' || pendingStatusFamilyId === family.id}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Désactiver
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
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
