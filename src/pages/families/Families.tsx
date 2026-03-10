import { useMemo, useState } from 'react';
import { useUser } from '../../contexts/user/user.context';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template';
import type { Family } from '../../stores/families/families.types';
import type { UpsertFamilyRequest } from '../../stores/families/families.types';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';
import { CreateUpdateFamily, type FamilyFormValues, type CreateUpdateFamilyPayload } from './components/CreateUpdateFamily';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, Settings, ShieldAlert, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="p-8 bg-gray-50 min-h-full">
      <header className="flex justify-end mb-8">
        <Button onClick={handleCreateClick} className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest font-light text-xs">
          <Plus className="w-4 h-4 mr-2" />
          Creer une famille
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.map((family) => (
          <Card key={family.id} className="rounded-none border-gray-200 shadow-none flex flex-col h-full group">
            <CardHeader className="flex flex-row items-start justify-between pb-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-extralight text-black uppercase m-0">{family.name}</CardTitle>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-light uppercase tracking-widest">
                  <Users className="w-3 h-3" />
                  {getMemberCount(family)} membres
                </div>
              </div>
              <Badge variant="outline" className={cn(
                "rounded-none text-[8px] font-light uppercase tracking-[0.15em] px-1.5 py-0 border-gray-100",
                family.status === 'ACTIVE' ? "text-blue-500 border-blue-100" : "text-gray-300"
              )}>
                {family.status === 'ACTIVE' ? 'Actif' : 'Desactive'}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
              <div className="bg-gray-50 p-4 border border-gray-100 flex items-center justify-between group-hover:bg-white transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] uppercase tracking-widest font-light text-gray-400">Owner</span>
                  <span className="text-xs font-light text-black truncate max-w-[150px]">{family.owner.email}</span>
                </div>
                <div className="bg-white p-2 border border-gray-100">
                  <User className="w-4 h-4 text-black" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[8px] uppercase tracking-widest font-light text-gray-400">Membres</span>
                <ul className="list-none p-0 m-0 space-y-2">
                  {family.members.map((member) => (
                    <li key={member.id} className="flex items-center justify-between text-xs font-light py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-400 uppercase tracking-tighter text-[10px]">{member.relation ?? 'Membre'}</span>
                      <span className="text-black">{member.email}</span>
                    </li>
                  ))}
                  {family.members.length === 0 && (
                    <li className="text-xs font-light text-gray-300 italic py-2">Aucun autre membre</li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t border-gray-50 flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 rounded-none border-gray-200 text-[10px] uppercase tracking-widest font-light hover:bg-gray-50"
                onClick={() => handleEditClick(family)} 
                disabled={family.status === 'INACTIVE'}
              >
                <Settings className="w-3 h-3 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-none border-gray-200 text-red-400 hover:text-red-500 hover:bg-red-50 text-[10px] uppercase tracking-widest font-light"
                onClick={() => handleDeactivate(family)}
                disabled={family.status === 'INACTIVE' || pendingStatusFamilyId === family.id}
              >
                <ShieldAlert className="w-3 h-3 mr-2" />
                Desactiver
              </Button>
            </CardFooter>
          </Card>
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
