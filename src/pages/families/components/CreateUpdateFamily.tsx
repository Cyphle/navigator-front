import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { UpsertFamilyMemberRequest, FamilyMemberRelation } from '../../../stores/families/families.types';
import { FAMILY_RELATION_LABELS } from '../../../stores/families/families.types';

const RELATION_OPTIONS: FamilyMemberRelation[] = [
  'PARENT', 'GRAND_PARENT', 'CHILD', 'UNCLE', 'AUNT', 'SISTER', 'BROTHER',
];

export interface FamilyFormValues {
  name: string;
  creatorRelation: FamilyMemberRelation;
  members: { usernameOrEmail: string; relation: FamilyMemberRelation; isAdmin: boolean }[];
}

export interface CreateUpdateFamilyPayload {
  name: string;
  creatorRelation: FamilyMemberRelation;
  members: UpsertFamilyMemberRequest[];
}

interface CreateUpdateFamilyProps {
  isOpen: boolean;
  isEditing: boolean;
  initialValues: FamilyFormValues;
  isSubmitting: boolean;
  onSubmit: (payload: CreateUpdateFamilyPayload) => void;
  onCancel: () => void;
}

export const CreateUpdateFamily = ({
  isOpen,
  isEditing,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateUpdateFamilyProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isValid },
    reset,
    trigger,
  } = useForm<FamilyFormValues>({
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'members' });

  useEffect(() => {
    if (!isOpen) return;
    reset(initialValues);
    void trigger();
  }, [initialValues, isOpen, reset, trigger]);

  const handleFormSubmit = (values: FamilyFormValues) => {
    onSubmit({
      name: values.name.trim(),
      creatorRelation: values.creatorRelation,
      members: values.members
        .filter((m) => m.usernameOrEmail.trim().length > 0)
        .map((m) => ({ usernameOrEmail: m.usernameOrEmail.trim(), relation: m.relation, isAdmin: m.isAdmin })),
    });
  };

  const handleAddMember = () => {
    append({ usernameOrEmail: '', relation: 'PARENT', isAdmin: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-light uppercase tracking-widest">
            {isEditing ? 'Modifier la famille' : 'Créer une famille'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
          {/* Family name */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-light text-gray-400">
              Nom de la famille
            </Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true, validate: (v) => v.trim().length > 0 }}
              render={({ field }) => (
                <Input
                  className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0"
                  placeholder="Nom de la famille"
                  {...field}
                />
              )}
            />
          </div>

          {/* Creator relation */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-light text-gray-400">
              Votre rôle dans la famille
            </Label>
            <Controller
              name="creatorRelation"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full h-9 rounded-none border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-blue-500"
                >
                  {RELATION_OPTIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {FAMILY_RELATION_LABELS[rel]}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest font-light text-gray-400">
                Membres
              </Label>
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter un membre
              </button>
            </div>

            {fields.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">
                Aucun membre ajouté. Vous pouvez inviter des membres ci-dessus.
              </p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-100 p-3 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Supprimer ce membre"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Username or Email */}
                    <div>
                      <Label className="text-[9px] uppercase tracking-widest font-light text-gray-400">
                        Email ou Nom d'utilisateur
                      </Label>
                      <Input
                        className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 mt-1"
                        placeholder="email ou nom d'utilisateur"
                        type="text"
                        {...register(`members.${index}.usernameOrEmail`)}
                      />
                    </div>

                    {/* Relation + isAdmin */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1">
                        <Label className="text-[9px] uppercase tracking-widest font-light text-gray-400">
                          Rôle
                        </Label>
                        <Controller
                          name={`members.${index}.relation`}
                          control={control}
                          render={({ field: selectField }) => (
                            <select
                              {...selectField}
                              className="w-full h-9 rounded-none border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-blue-500 mt-1"
                            >
                              {RELATION_OPTIONS.map((rel) => (
                                <option key={rel} value={rel}>
                                  {FAMILY_RELATION_LABELS[rel]}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-5">
                        <Controller
                          name={`members.${index}.isAdmin`}
                          control={control}
                          render={({ field: checkField }) => (
                            <input
                              type="checkbox"
                              id={`member-admin-${index}`}
                              checked={checkField.value}
                              onChange={checkField.onChange}
                              className="w-4 h-4 accent-blue-600"
                            />
                          )}
                        />
                        <Label
                          htmlFor={`member-admin-${index}`}
                          className="text-[9px] uppercase tracking-widest font-light text-gray-400 cursor-pointer"
                        >
                          Admin
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-none uppercase tracking-widest font-light text-xs"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest font-light text-xs"
              disabled={!isValid || isSubmitting}
            >
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
