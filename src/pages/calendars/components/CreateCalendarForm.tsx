import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { useState } from 'react';
import type { CreateCalendarInput, CalendarType } from '../../../stores/calendars/calendars.types';
import type { Family } from '../../../stores/families/families.types';

interface CreateCalendarFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateCalendarInput) => void;
  isLoading?: boolean;
  families: Family[];
}

const COLOR_OPTIONS = [
  { value: '#1890ff', label: 'Bleu' },
  { value: '#52c41a', label: 'Vert' },
  { value: '#fa8c16', label: 'Orange' },
  { value: '#eb2f96', label: 'Rose' },
  { value: '#722ed1', label: 'Violet' },
  { value: '#13c2c2', label: 'Cyan' },
  { value: '#f5222d', label: 'Rouge' },
  { value: '#faad14', label: 'Or' },
];

export const CreateCalendarForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  families,
}: CreateCalendarFormProps) => {
  const [form] = Form.useForm();
  const [calendarType, setCalendarType] = useState<CalendarType>('PERSONAL');

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const input: CreateCalendarInput = {
        name: values.name,
        color: values.color,
        type: values.type,
        familyId: values.type === 'SHARED' ? values.familyId : undefined,
      };
      onSubmit(input);
      form.resetFields();
      setCalendarType('PERSONAL');
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setCalendarType('PERSONAL');
    onCancel();
  };

  const handleTypeChange = (e: any) => {
    setCalendarType(e.target.value);
  };

  return (
    <Modal
      title="Nouveau calendrier"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Annuler
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
          Créer
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ type: 'PERSONAL', color: '#1890ff' }}>
        <Form.Item
          label="Nom du calendrier"
          name="name"
          rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input placeholder="Ex: Calendrier familial" />
        </Form.Item>

        <Form.Item
          label="Couleur"
          name="color"
          rules={[{ required: true, message: 'La couleur est requise' }]}
        >
          <Select
            placeholder="Sélectionner une couleur"
            options={COLOR_OPTIONS}
            optionRender={(option) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: option.value,
                  }}
                />
                {option.label}
              </div>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Type de calendrier"
          name="type"
          rules={[{ required: true, message: 'Le type est requis' }]}
        >
          <Radio.Group onChange={handleTypeChange}>
            <Radio value="PERSONAL">Personnel</Radio>
            <Radio value="SHARED">Partagé avec une famille</Radio>
          </Radio.Group>
        </Form.Item>

        {calendarType === 'SHARED' && families.length > 0 && (
          <Form.Item
            label="Famille"
            name="familyId"
            rules={[{ required: true, message: 'Veuillez sélectionner une famille' }]}
          >
            <Select
              placeholder="Sélectionner une famille"
              options={families.map((family) => ({
                value: family.id,
                label: family.name,
              }))}
            />
          </Form.Item>
        )}

        {calendarType === 'SHARED' && families.length === 0 && (
          <div style={{ color: '#999', fontSize: '14px' }}>
            Vous n'avez aucune famille. Créez-en une dans la section Familles.
          </div>
        )}
      </Form>
    </Modal>
  );
};
