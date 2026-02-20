import { Button, Input, Modal } from 'antd';
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
    <Modal
      title={isEditing ? 'Modifier la famille' : 'Creer une famille'}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      className="family-form-modal"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="family-form">
        <label htmlFor="family-name">Nom de la famille</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: true, validate: (value) => value.trim().length > 0 }}
          render={({ field }) => (
            <Input
              id="family-name"
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
              name={field.name}
              placeholder="Nom de la famille"
            />
          )}
        />

        <label htmlFor="family-emails">Emails des membres</label>
        <Controller
          name="emails"
          control={control}
          rules={{
            required: true,
            validate: (value) => value.trim().length > 0 && parseEmails(value).length > 0,
          }}
          render={({ field }) => (
            <Input.TextArea
              id="family-emails"
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
              name={field.name}
              placeholder="email1@exemple.fr, email2@exemple.fr"
              rows={3}
            />
          )}
        />

        <div className="family-form__actions">
          <Button
            htmlType="submit"
            type="primary"
            disabled={!isValid || isSubmitting}
          >
            {isEditing ? 'Mettre a jour' : 'Creer'}
          </Button>
          <Button type="default" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </Modal>
  );
};
