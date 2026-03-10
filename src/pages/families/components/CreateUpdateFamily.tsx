import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';

export interface FamilyFormValues {
  name: string;
  emails: string;
}

export interface CreateUpdateFamilyPayload {
  name: string;
  memberEmails: string[];
}

interface CreateUpdateFamilyProps {
  isOpen: boolean;
  isEditing: boolean;
  initialValues: FamilyFormValues;
  isSubmitting: boolean;
  onSubmit: (payload: CreateUpdateFamilyPayload) => void;
  onCancel: () => void;
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
    handleSubmit,
    formState: { isValid },
    reset,
    trigger,
  } = useForm<FamilyFormValues>({
    mode: 'onChange',
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset(initialValues);
    void trigger();
  }, [initialValues, isOpen, reset, trigger]);

  const handleFormSubmit = (values: FamilyFormValues) => {
    onSubmit({
      name: values.name.trim(),
      memberEmails: parseEmails(values.emails),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-light uppercase tracking-widest">
            {isEditing ? 'Modifier la famille' : 'Creer une famille'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="family-name" className="text-[10px] uppercase tracking-widest font-light text-gray-400">Nom de la famille</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true, validate: (value) => value.trim().length > 0 }}
              render={({ field }) => (
                <Input
                  id="family-name"
                  className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                  placeholder="Nom de la famille"
                  {...field}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family-emails" className="text-[10px] uppercase tracking-widest font-light text-gray-400">Emails des membres</Label>
            <Controller
              name="emails"
              control={control}
              rules={{
                required: true,
                validate: (value) => value.trim().length > 0 && parseEmails(value).length > 0,
              }}
              render={({ field }) => (
                <Textarea
                  id="family-emails"
                  className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                  placeholder="email1@exemple.fr, email2@exemple.fr"
                  rows={3}
                  {...field}
                />
              )}
            />
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
              {isEditing ? 'Mettre a jour' : 'Creer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
