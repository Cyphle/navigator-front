import { Button, Card, Empty, List, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TodoList } from '../../../stores/family-todos/family-todos.types';

interface TodoListsViewProps {
  lists: TodoList[];
  onCreateNew: () => void;
  onSelectList: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoListsView = ({ lists, onCreateNew, onSelectList, onDelete }: TodoListsViewProps) => {
  return (
    <div className="family-todos">
      <div className="todos-header">
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
          Nouvelle liste
        </Button>
      </div>

      {lists.length === 0 ? (
        <Empty description="Aucune liste de todos" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={lists}
          renderItem={(list) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => onSelectList(list.id)}
                actions={[
                  <Button
                    key="delete"
                    danger
                    type="text"
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
                    <>
                      <div>
                        {list.type === 'SHARED' ? (
                          <Tag color="blue">Partagée</Tag>
                        ) : (
                          <Tag color="green">Personnelle</Tag>
                        )}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        {list.items.length} tâche{list.items.length > 1 ? 's' : ''}
                      </div>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
