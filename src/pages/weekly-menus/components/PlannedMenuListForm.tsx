import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import type { CreatePlannedMenuListInput } from '../../../stores/planned-menus/planned-menus.types';

interface PlannedMenuListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreatePlannedMenuListInput) => void;
  isLoading?: boolean;
}

const RANGE_OPTIONS = [
  { value: 7, label: '1 semaine' },
  { value: 14, label: '2 semaines' },
  { value: 21, label: '3 semaines' },
  { value: 30, label: '1 mois' },
];

export const PlannedMenuListForm = ({ open, onCancel, onSubmit, isLoading }: PlannedMenuListFormProps) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [range, setRange] = useState<number>(7);

  useEffect(() => {
    if (startDate) {
      const endDate = startDate.add(range, 'day');
      form.setFieldValue('endDate', endDate);
    }
  }, [startDate, range, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const input: CreatePlannedMenuListInput = {
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };
      onSubmit(input);
      form.resetFields();
      setStartDate(null);
      setRange(7);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setStartDate(null);
    setRange(7);
    onCancel();
  };

  return (
    <Modal
      title="Nouvelle liste de menus planifiés"
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
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nom de la liste"
          name="name"
          rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input placeholder="Ex: Menu de la semaine" />
        </Form.Item>

        <Form.Item
          label="Date de début"
          name="startDate"
          rules={[{ required: true, message: 'La date de début est requise' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            onChange={(date) => setStartDate(date)}
          />
        </Form.Item>

        <Form.Item label="Durée">
          <Select value={range} onChange={setRange} options={RANGE_OPTIONS} />
        </Form.Item>

        <Form.Item label="Date de fin" name="endDate">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};
