import { Button, Card, Empty, Form, Input, List, Modal, Select, Tag, DatePicker } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import type {
  TodoList,
  CreateTodoItemInput,
  TodoStatus,
} from '../../../stores/family-todos/family-todos.types';

interface TodoListDetailProps {
  list: TodoList;
  onBack: () => void;
  onAddItem: (input: CreateTodoItemInput) => void;
  onUpdateItem: (itemId: number, status: TodoStatus) => void;
  onDeleteItem: (itemId: number) => void;
  onClearCompleted: () => void;
}

const STATUS_LABELS: Record<TodoStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

const STATUS_COLORS: Record<TodoStatus, string> = {
  TODO: 'default',
  IN_PROGRESS: 'processing',
  DONE: 'success',
};

export const TodoListDetail = ({
  list,
  onBack,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onClearCompleted,
}: TodoListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddItem = () => {
    form.validateFields().then((values) => {
      const input: CreateTodoItemInput = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
        status: values.status || 'TODO',
      };
      onAddItem(input);
      form.resetFields();
      setIsAddModalOpen(false);
    });
  };

  const todoItems = list.items.filter((item) => item.status === 'TODO');
  const inProgressItems = list.items.filter((item) => item.status === 'IN_PROGRESS');
  const doneItems = list.items.filter((item) => item.status === 'DONE');

  const renderItem = (item: any) => (
    <List.Item
      actions={[
        <Button
          key="delete"
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onDeleteItem(item.id)}
        />,
      ]}
    >
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Select
            value={item.status}
            onChange={(status) => onUpdateItem(item.id, status)}
            style={{ width: 140 }}
            options={[
              { value: 'TODO', label: STATUS_LABELS.TODO },
              { value: 'IN_PROGRESS', label: STATUS_LABELS.IN_PROGRESS },
              { value: 'DONE', label: STATUS_LABELS.DONE },
            ]}
          />
          <span style={{ fontWeight: 500, flex: 1 }}>{item.title}</span>
        </div>
        {item.description && (
          <div style={{ marginTop: 4, color: '#666', fontSize: 14 }}>{item.description}</div>
        )}
        {item.dueDate && (
          <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
            Échéance: {dayjs(item.dueDate).format('DD/MM/YYYY')}
          </div>
        )}
      </div>
    </List.Item>
  );

  return (
    <div className="family-todos">
      <div style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Retour
        </Button>
        <div>
          <h1>{list.name}</h1>
          <div>
            {list.type === 'SHARED' ? (
              <Tag color="blue">Partagée</Tag>
            ) : (
              <Tag color="green">Personnelle</Tag>
            )}
          </div>
        </div>
      </div>

      <Card
        title="Tâches"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
            Ajouter une tâche
          </Button>
        }
      >
        {list.items.length === 0 ? (
          <Empty description="Aucune tâche" />
        ) : (
          <>
            {todoItems.length > 0 && (
              <div>
                <h3>À faire ({todoItems.length})</h3>
                <List dataSource={todoItems} renderItem={renderItem} />
              </div>
            )}

            {inProgressItems.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3>En cours ({inProgressItems.length})</h3>
                <List dataSource={inProgressItems} renderItem={renderItem} />
              </div>
            )}

            {doneItems.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>Terminé ({doneItems.length})</h3>
                  <Button danger size="small" icon={<ClearOutlined />} onClick={onClearCompleted}>
                    Nettoyer
                  </Button>
                </div>
                <List dataSource={doneItems} renderItem={renderItem} />
              </div>
            )}
          </>
        )}
      </Card>

      <Modal
        title="Ajouter une tâche"
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddModalOpen(false);
              form.resetFields();
            }}
          >
            Annuler
          </Button>,
          <Button key="add" type="primary" onClick={handleAddItem}>
            Ajouter
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'TODO' }}>
          <Form.Item
            label="Titre"
            name="title"
            rules={[{ required: true, message: 'Le titre est requis' }]}
          >
            <Input placeholder="Ex: Faire les courses" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Détails de la tâche..." rows={3} />
          </Form.Item>

          <Form.Item label="Date d'échéance" name="dueDate">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Statut" name="status">
            <Select
              options={[
                { value: 'TODO', label: STATUS_LABELS.TODO },
                { value: 'IN_PROGRESS', label: STATUS_LABELS.IN_PROGRESS },
                { value: 'DONE', label: STATUS_LABELS.DONE },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
