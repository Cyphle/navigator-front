import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { useState } from 'react';
import type { CreateTodoListInput, TodoListType } from '../../../stores/family-todos/family-todos.types';
import type { Family } from '../../../stores/families/families.types';

interface CreateTodoListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateTodoListInput) => void;
  isLoading?: boolean;
  families: Family[];
}

export const CreateTodoListForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  families,
}: CreateTodoListFormProps) => {
  const [form] = Form.useForm();
  const [listType, setListType] = useState<TodoListType>('PERSONAL');

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const input: CreateTodoListInput = {
        name: values.name,
        type: values.type,
        familyId: values.type === 'SHARED' ? values.familyId : undefined,
      };
      onSubmit(input);
      form.resetFields();
      setListType('PERSONAL');
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setListType('PERSONAL');
    onCancel();
  };

  const handleTypeChange = (e: any) => {
    setListType(e.target.value);
  };

  return (
    <Modal
      title="Nouvelle liste de todos"
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
      <Form form={form} layout="vertical" initialValues={{ type: 'PERSONAL' }}>
        <Form.Item
          label="Nom de la liste"
          name="name"
          rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input placeholder="Ex: Tâches ménagères" />
        </Form.Item>

        <Form.Item
          label="Type de liste"
          name="type"
          rules={[{ required: true, message: 'Le type est requis' }]}
        >
          <Radio.Group onChange={handleTypeChange}>
            <Radio value="PERSONAL">Personnelle</Radio>
            <Radio value="SHARED">Partagée avec une famille</Radio>
          </Radio.Group>
        </Form.Item>

        {listType === 'SHARED' && families.length > 0 && (
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

        {listType === 'SHARED' && families.length === 0 && (
          <div style={{ color: '#999', fontSize: '14px' }}>
            Vous n'avez aucune famille. Créez-en une dans la section Familles.
          </div>
        )}
      </Form>
    </Modal>
  );
};
