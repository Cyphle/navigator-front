import { Button, Card, Empty, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ShoppingList } from '../../../stores/shopping-lists/shopping-lists.types';

interface ShoppingListsViewProps {
  lists: ShoppingList[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ShoppingListsView = ({
  lists,
  onCreateNew,
  onSelectList,
  onDelete,
}: ShoppingListsViewProps) => {
  return (
    <div className="shopping-lists-view">
      <div className="shopping-lists-header">
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
          Nouvelle liste
        </Button>
      </div>

      {lists.length === 0 ? (
        <Empty
          description="Aucune liste de courses"
          style={{ marginTop: '48px' }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
            Créer ma première liste
          </Button>
        </Empty>
      ) : (
        <div className="shopping-lists-grid">
          {lists.map((list) => {
            const completedCount = list.items.filter((item) => item.completed).length;
            const totalCount = list.items.length;

            return (
              <Card
                key={list.id}
                hoverable
                onClick={() => onSelectList(list.id)}
                className="shopping-list-card"
                actions={[
                  <Button
                    key="delete"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(list.id);
                    }}
                  >
                    Supprimer
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={<ShoppingOutlined style={{ fontSize: 24 }} />}
                  title={list.name}
                  description={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div>
                        {list.type === 'SHARED' ? (
                          <Tag color="blue">Partagée</Tag>
                        ) : (
                          <Tag color="green">Personnelle</Tag>
                        )}
                      </div>
                      <div>
                        {totalCount > 0 ? (
                          <span>
                            {completedCount} / {totalCount} articles
                          </span>
                        ) : (
                          <span style={{ color: '#999' }}>Aucun article</span>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
