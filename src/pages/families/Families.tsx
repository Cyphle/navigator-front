import { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../contexts/user/user.context';
import { useFamily } from '../../contexts/family/family.context';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import type { Family, UpsertFamilyRequest } from '../../stores/families/families.types';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';
import { CreateUpdateFamily, type FamilyFormValues, type CreateUpdateFamilyPayload } from './components/CreateUpdateFamily';
import { FamilyCard } from './components/FamilyCard';
import { Users, Plus } from 'lucide-react';

const FamiliesContent = ({ data }: { data: Family[] }) => {
  const { userState } = useUser();
  const { setFamilies } = useFamily();

  useEffect(() => {
    setFamilies(data.map((f) => ({ id: String(f.id), name: f.name })));
  }, [data, setFamilies]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<number | null>(null);
  const [pendingStatusFamilyId, setPendingStatusFamilyId] = useState<number | null>(null);
  const defaultFormValues: FamilyFormValues = { name: '', creatorRelation: 'PARENT', members: [] };
  const [formValues, setFormValues] = useState<FamilyFormValues>(defaultFormValues);

  const username = useMemo(() => {
    if (userState.username) return userState.username;
    return 'owner';
  }, [userState.username]);

  const handleCreateClick = () => {
    setEditingFamilyId(null);
    setFormValues(defaultFormValues);
    setIsFormOpen(true);
  };

  const handleEditClick = (family: Family) => {
    setEditingFamilyId(family.id);
    setFormValues({
      name: family.name,
      creatorRelation: family.creator.relation,
      members: family.members.map((m) => ({ username: m.username, relation: m.relation, isAdmin: m.isAdmin })),
    });
    setIsFormOpen(true);
  };

  const onMutationSuccess = () => {
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
      creatorRelation: family.creator.relation,
      members: family.members.map((m) => ({ username: m.username, relation: m.relation, isAdmin: m.isAdmin })),
      status: 'INACTIVE',
    });
  };

  const onSubmit = (values: CreateUpdateFamilyPayload) => {
    const payload: UpsertFamilyRequest = {
      id: editingFamilyId ?? undefined,
      name: values.name,
      creatorRelation: values.creatorRelation,
      members: values.members.filter((m) => m.username !== username),
    };

    setIsFormOpen(false);

    if (editingFamilyId) {
      updateFamilyMutation(payload);
    } else {
      createFamilyMutation(payload);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
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

      {data.length === 0 ? (
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
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {data.map((family) => (
            <FamilyCard
              key={family.id}
              family={family}
              isPendingDeactivation={pendingStatusFamilyId === family.id}
              onEdit={handleEditClick}
              onDeactivate={handleDeactivate}
            />
          ))}
        </section>
      )}

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
