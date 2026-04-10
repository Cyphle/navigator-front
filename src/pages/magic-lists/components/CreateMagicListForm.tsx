import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type {
  CreateMagicListInput,
  MagicListKind,
  MagicListType,
} from '../../../stores/magic-lists/magic-lists.types';
import type { Family, FamilyMember } from '../../../stores/families/families.types';

interface CreateMagicListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateMagicListInput) => void;
  isLoading?: boolean;
  families: Family[];
}

interface FormValues {
  name: string;
  type: MagicListType;
  kind: MagicListKind;
  familyId?: number;
  excludedMemberIds: number[];
}

interface KindOption {
  value: MagicListKind;
  label: string;
  icon: string;
  tooltip: string;
}

const KIND_OPTIONS: KindOption[] = [
  {
    value: 'SIMPLE',
    label: 'Simple',
    icon: '📋',
    tooltip:
      'Une liste contenant des éléments sous forme de liste. Par exemple : les horaires des biberons de bébé, un journal de bord, un historique d\'événements.',
  },
  {
    value: 'TASK',
    label: 'Tâches',
    icon: '✅',
    tooltip:
      'Une liste d\'éléments activables que l\'on coche au fur et à mesure. Par exemple : une liste de courses où l\'on élimine les articles mis dans le caddie.',
  },
  {
    value: 'TEMPLATE',
    label: 'Template',
    icon: '🔁',
    tooltip:
      'Un modèle réutilisable pour générer des listes simples ou de tâches. Par exemple : une liste de choses à faire avant les vacances, réutilisable à chaque départ.',
  },
];

const getAllFamilyMembers = (family: Family): FamilyMember[] => [
  family.creator,
  ...family.members,
];

export const CreateMagicListForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  families,
}: CreateMagicListFormProps) => {
  const { control, handleSubmit, reset, setValue, formState: { isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', type: 'PERSONAL', kind: 'SIMPLE', excludedMemberIds: [] },
  });
  const [listType, setListType] = useState<MagicListType>('PERSONAL');

  const selectedFamilyId = useWatch({ control, name: 'familyId' });
  const selectedFamily = families.find((f) => f.id === selectedFamilyId);
  const familyMembers = selectedFamily ? getAllFamilyMembers(selectedFamily) : [];

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      type: values.type,
      kind: values.kind,
      familyId: values.type === 'SHARED' ? values.familyId : undefined,
      excludedMemberIds: values.type === 'SHARED' && values.excludedMemberIds.length > 0
        ? values.excludedMemberIds
        : undefined,
    });
    reset();
    setListType('PERSONAL');
  };

  const handleCancel = () => {
    reset();
    setListType('PERSONAL');
    onCancel();
  };

  const handleFamilyChange = (familyId: number) => {
    setValue('familyId', familyId, { shouldValidate: true });
    setValue('excludedMemberIds', []);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[440px]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Nouvelle magic list
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">
          {/* Name */}
          <Controller
            name="name"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Nom de la liste *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Liste de courses"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          {/* Kind cards */}
          <Controller
            name="kind"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Type de liste
                </Label>
                <TooltipProvider delayDuration={200}>
                  <div className="grid grid-cols-3 gap-2">
                    {KIND_OPTIONS.map((opt) => (
                      <Tooltip key={opt.value}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              'relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all',
                              field.value === opt.value
                                ? 'border-transparent text-white'
                                : 'border-black/10 hover:border-[var(--ocean-light)]'
                            )}
                            style={
                              field.value === opt.value
                                ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }
                                : { color: 'var(--stone)' }
                            }
                            onClick={() => field.onChange(opt.value)}
                          >
                            <span className="text-xl leading-none">{opt.icon}</span>
                            <span className="text-xs">{opt.label}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[220px] text-center text-xs leading-relaxed">
                          {opt.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            )}
          />

          {/* Scope radio buttons */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Visibilité
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['PERSONAL', 'SHARED'] as MagicListType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={cn(
                        'px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all',
                        field.value === t
                          ? 'text-white border-transparent'
                          : 'border-black/10 hover:border-[var(--ocean-light)]'
                      )}
                      style={
                        field.value === t
                          ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)', color: 'white' }
                          : { color: 'var(--stone)' }
                      }
                      onClick={() => {
                        field.onChange(t);
                        setListType(t);
                        if (t === 'PERSONAL') {
                          setValue('familyId', undefined);
                          setValue('excludedMemberIds', []);
                        }
                      }}
                    >
                      {t === 'PERSONAL' ? 'Personnelle' : 'Partagée'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          {/* Family selector (SHARED only) */}
          {listType === 'SHARED' && families.length > 0 && (
            <Controller
              name="familyId"
              control={control}
              rules={{ required: listType === 'SHARED' }}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Famille *
                  </Label>
                  <select
                    value={field.value ?? ''}
                    onChange={(e) => handleFamilyChange(Number(e.target.value))}
                    className="w-full h-10 px-3 text-sm rounded-[var(--radius-sm)] border border-black/10 focus:outline-none"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    <option value="">Sélectionner une famille</option>
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}
            />
          )}

          {/* Member exclusion (when family is selected) */}
          {listType === 'SHARED' && selectedFamily && familyMembers.length > 0 && (
            <Controller
              name="excludedMemberIds"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Exclure des membres
                  </Label>
                  <div className="rounded-[var(--radius-sm)] border border-black/10 divide-y divide-black/5" style={{ background: 'var(--sand)' }}>
                    {familyMembers.map((member) => {
                      const isExcluded = field.value.includes(member.id);
                      return (
                        <label
                          key={member.id}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-black/5 transition-colors"
                        >
                          <Checkbox
                            checked={isExcluded}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, member.id]);
                              } else {
                                field.onChange(field.value.filter((id) => id !== member.id));
                              }
                            }}
                          />
                          <span className="text-sm flex-1" style={{ color: 'var(--stone)' }}>
                            {member.usernameOrEmail}
                          </span>
                          {isExcluded && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                              exclu.e
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {field.value.length > 0 && (
                    <p className="text-xs" style={{ color: '#b91c1c' }}>
                      {field.value.length} membre{field.value.length > 1 ? 's' : ''} exclu.e{field.value.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            />
          )}

          {listType === 'SHARED' && families.length === 0 && (
            <p className="text-sm rounded-[var(--radius-sm)] px-4 py-3" style={{ background: 'var(--sun-pale)', color: 'var(--stone)' }}>
              Vous n'avez aucune famille. Créez-en une dans la section Familles.
            </p>
          )}

          <DialogFooter className="pt-2">
            <button
              type="button"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-black/5"
              style={{ color: 'var(--stone)' }}
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
