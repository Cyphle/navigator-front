import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type {
  CreateMagicListInput,
  MagicListType,
  MagicListVisibility,
} from '../../../stores/magic-lists/magic-lists.types';

interface CreateMagicListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateMagicListInput) => void;
  isLoading?: boolean;
  familyId?: number;
}

interface FormValues {
  name: string;
  visibility: MagicListVisibility;
  type: MagicListType;
}

interface TypeOption {
  value: MagicListType;
  label: string;
  icon: string;
  tooltip: string;
}

const TYPE_OPTIONS: TypeOption[] = [
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

export const CreateMagicListForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  familyId,
}: CreateMagicListFormProps) => {
  const { control, handleSubmit, reset, formState: { isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', visibility: 'PERSONAL', type: 'SIMPLE' },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      visibility: values.visibility,
      type: values.type,
      familyId: values.visibility === 'SHARED' ? familyId : undefined,
    });
  };

  const handleCancel = () => {
    reset();
    onCancel();
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

          {/* Type cards */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Type de liste
                </Label>
                <TooltipProvider delayDuration={200}>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPE_OPTIONS.map((opt) => (
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

          {/* Visibility toggle */}
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 border border-black/10" style={{ background: 'var(--sand)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--stone)' }}>
                    Partager avec la famille
                  </p>
                  <p className="text-xs" style={{ color: 'var(--mist)' }}>
                    {field.value === 'SHARED' ? 'Visible par les membres de la famille' : 'Uniquement visible par vous'}
                  </p>
                </div>
                <Switch
                  checked={field.value === 'SHARED'}
                  onCheckedChange={(checked) => field.onChange(checked ? 'SHARED' : 'PERSONAL')}
                  aria-label="Partager avec la famille"
                />
              </div>
            )}
          />

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
