import { Button, Card, Empty, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { PlannedMenuList } from '../../../stores/planned-menus/planned-menus.types';

interface PlannedMenuListsViewProps {
  lists: PlannedMenuList[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleShoppingList: (id: number, isActive: boolean) => void;
}

export const PlannedMenuListsView = ({
  lists,
  onCreateNew,
  onSelectList,
  onDelete,
  onToggleShoppingList,
}: PlannedMenuListsViewProps) => {
  return (
    <div className="planned-menu-lists-view">
      <div className="planned-menu-lists-header">
        <h1>Mes listes de menus planifiés</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
          Nouvelle liste
        </Button>
      </div>

      {lists.length === 0 ? (
        <Empty
          description="Aucune liste de menus planifiés"
          style={{ marginTop: '48px' }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
            Créer ma première liste
          </Button>
        </Empty>
      ) : (
        <div className="planned-menu-lists-grid">
          {lists.map((list) => {
            const startDate = dayjs(list.startDate);
            const endDate = dayjs(list.endDate);
            const daysCount = endDate.diff(startDate, 'day');

            return (
              <Card
                key={list.id}
                hoverable
                onClick={() => onSelectList(list.id)}
                className="planned-menu-list-card"
                actions={[
                  <Button
                    key="shopping"
                    type={list.isActiveShoppingList ? 'primary' : 'default'}
                    icon={<ShoppingCartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleShoppingList(list.id, !list.isActiveShoppingList);
                    }}
                  >
                    {list.isActiveShoppingList ? 'Liste active' : 'Activer'}
                  </Button>,
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
                  title={list.name}
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
                      </div>
                      <div>
                        <Tag color="blue">{daysCount} jours</Tag>
                        <Tag color="green">{list.recipes.length} recettes</Tag>
                      </div>
                      {list.isActiveShoppingList && (
                        <Tag color="orange" icon={<ShoppingCartOutlined />}>
                          Liste de courses active
                        </Tag>
                      )}
                    </Space>
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
