import { Button, Card, Checkbox, Empty, Form, Input, List, Modal, Select, Tag } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type {
  ShoppingList,
  CreateShoppingListItemInput,
  DesireLevel,
} from '../../../stores/shopping-lists/shopping-lists.types';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onBack: () => void;
  onAddItem: (input: CreateShoppingListItemInput) => void;
  onToggleItem: (itemId: number, completed: boolean) => void;
  onDeleteItem: (itemId: number) => void;
  onClearCompleted: () => void;
}

const DESIRE_LEVEL_LABELS: Record<DesireLevel, string> = {
  REALLY_WANT: 'Vraiment envie',
  MAYBE: 'Peut-être',
  NOTED: 'Noté',
};

const DESIRE_LEVEL_COLORS: Record<DesireLevel, string> = {
  REALLY_WANT: 'red',
  MAYBE: 'orange',
  NOTED: 'blue',
};

export const ShoppingListDetail = ({
  list,
  onBack,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
}: ShoppingListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddItem = () => {
    form.validateFields().then((values) => {
      const input: CreateShoppingListItemInput = {
        title: values.title,
        shop: values.shop,
        desireLevel: values.desireLevel,
      };
      onAddItem(input);
      form.resetFields();
    });
  };

  const activeItems = list.items.filter((item) => !item.completed);
  const completedItems = list.items.filter((item) => item.completed);

  return (
    <div className="shopping-list-detail">
      <div className="detail-header">
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

      <div className="detail-content">
        <Card
          title="Articles"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
              Ajouter un article
            </Button>
          }
        >
          {list.items.length === 0 ? (
            <Empty description="Aucun article" />
          ) : (
            <>
              {activeItems.length > 0 && (
                <div>
                  <h3>À acheter ({activeItems.length})</h3>
                  <List
                    dataSource={activeItems}
                    renderItem={(item) => (
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
                        <Checkbox
                          checked={item.completed}
                          onChange={(e) => onToggleItem(item.id, e.target.checked)}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontWeight: 500 }}>{item.title}</span>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {item.shop && <Tag>{item.shop}</Tag>}
                              {item.desireLevel && (
                                <Tag color={DESIRE_LEVEL_COLORS[item.desireLevel]}>
                                  {DESIRE_LEVEL_LABELS[item.desireLevel]}
                                </Tag>
                              )}
                            </div>
                          </div>
                        </Checkbox>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              {completedItems.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>Acheté ({completedItems.length})</h3>
                    <Button
                      danger
                      size="small"
                      icon={<ClearOutlined />}
                      onClick={onClearCompleted}
                    >
                      Nettoyer
                    </Button>
                  </div>
                  <List
                    dataSource={completedItems}
                    renderItem={(item) => (
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
                        <Checkbox
                          checked={item.completed}
                          onChange={(e) => onToggleItem(item.id, e.target.checked)}
                        >
                          <span style={{ textDecoration: 'line-through', color: '#999' }}>
                            {item.title}
                          </span>
                        </Checkbox>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Add Item Modal */}
      <Modal
        title="Ajouter un article"
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
        <Form form={form} layout="vertical">
          <Form.Item
            label="Article"
            name="title"
            rules={[{ required: true, message: 'Le titre est requis' }]}
          >
            <Input placeholder="Ex: Pain" />
          </Form.Item>

          <Form.Item label="Magasin" name="shop">
            <Input placeholder="Ex: Intermarché, Marché, Picard..." />
          </Form.Item>

          <Form.Item label="Niveau d'envie" name="desireLevel">
            <Select
              placeholder="Sélectionner un niveau"
              allowClear
              options={[
                { value: 'REALLY_WANT', label: DESIRE_LEVEL_LABELS.REALLY_WANT },
                { value: 'MAYBE', label: DESIRE_LEVEL_LABELS.MAYBE },
                { value: 'NOTED', label: DESIRE_LEVEL_LABELS.NOTED },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
