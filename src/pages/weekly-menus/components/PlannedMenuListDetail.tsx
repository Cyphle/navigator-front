import { Button, Card, DatePicker, Empty, List, Modal, Pagination, Select, Space, Tag, Rate } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { PlannedMenuList, PlannedMenuRecipe } from '../../../stores/planned-menus/planned-menus.types';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';
import { useFetchRecipesPage } from '../../../stores/recipes/recipes.queries';

interface PlannedMenuListDetailProps {
  list: PlannedMenuList;
  onBack: () => void;
  onAddRecipe: (recipeId: number, recipeName: string, assignedDays?: string[]) => void;
  onRemoveRecipe: (recipeId: number) => void;
  onUpdateRecipeDays: (recipeId: number, recipeName: string, assignedDays?: string[]) => void;
}

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

export const PlannedMenuListDetail = ({
  list,
  onBack,
  onAddRecipe,
  onRemoveRecipe,
  onUpdateRecipeDays,
}: PlannedMenuListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipeForDays, setSelectedRecipeForDays] = useState<PlannedMenuRecipe | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Recipe browser state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | RecipeCategory>('ALL');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState('NAME_ASC');

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    undefined,
    minRating,
    sort
  );

  const { data, isPending } = recipesQuery;
  const recipes = data?.items ?? [];
  const total = data?.total ?? 0;

  const selectedRecipeIds = useMemo(
    () => new Set(list.recipes.map((r) => r.recipeId)),
    [list.recipes]
  );

  const handleAddRecipe = (recipe: Recipe) => {
    onAddRecipe(recipe.id, recipe.name);
    // Don't close modal - let user add multiple recipes
  };

  const handleOpenDaysModal = (recipe: PlannedMenuRecipe) => {
    setSelectedRecipeForDays(recipe);
    setSelectedDays(recipe.assignedDays || []);
  };

  const handleSaveDays = () => {
    if (selectedRecipeForDays) {
      onUpdateRecipeDays(
        selectedRecipeForDays.recipeId,
        selectedRecipeForDays.recipeName,
        selectedDays.length > 0 ? selectedDays : undefined
      );
    }
    setSelectedRecipeForDays(null);
    setSelectedDays([]);
  };

  const listDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const start = dayjs(list.startDate);
    const end = dayjs(list.endDate);
    let current = start;

    while (current.isBefore(end) || current.isSame(end)) {
      dates.push({
        value: current.format('YYYY-MM-DD'),
        label: current.format('dddd DD/MM'),
      });
      current = current.add(1, 'day');
    }

    return dates;
  }, [list.startDate, list.endDate]);

  return (
    <div className="planned-menu-list-detail">
      <div className="detail-header">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Retour
        </Button>
        <div>
          <h1>{list.name}</h1>
          <p>
            {dayjs(list.startDate).format('DD/MM/YYYY')} - {dayjs(list.endDate).format('DD/MM/YYYY')}
          </p>
        </div>
      </div>

      <div className="detail-content">
        <Card
          title="Recettes sélectionnées"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
              Ajouter une recette
            </Button>
          }
        >
          {list.recipes.length === 0 ? (
            <Empty description="Aucune recette sélectionnée" />
          ) : (
            <List
              dataSource={list.recipes}
              renderItem={(recipe) => (
                <List.Item
                  actions={[
                    <Button
                      key="days"
                      icon={<CalendarOutlined />}
                      onClick={() => handleOpenDaysModal(recipe)}
                    >
                      Jours
                    </Button>,
                    <Button
                      key="remove"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveRecipe(recipe.recipeId)}
                    >
                      Retirer
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={recipe.recipeName}
                    description={
                      recipe.assignedDays && recipe.assignedDays.length > 0 ? (
                        <Space wrap>
                          {recipe.assignedDays.map((day) => (
                            <Tag key={day} color="blue">
                              {dayjs(day).format('DD/MM')}
                            </Tag>
                          ))}
                        </Space>
                      ) : (
                        <span style={{ color: '#999' }}>Aucun jour assigné</span>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      {/* Add Recipe Modal */}
      <Modal
        title="Ajouter une recette"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsAddModalOpen(false)}>
            Fermer
          </Button>,
        ]}
        width={800}
      >
        <div className="recipe-browser">
          <Space style={{ marginBottom: 16 }} wrap>
            <Select
              value={categoryFilter}
              onChange={(value) => {
                setPage(1);
                setCategoryFilter(value);
              }}
              options={[
                { value: 'ALL', label: 'Toutes les catégories' },
                { value: 'ENTREE', label: CATEGORY_LABELS.ENTREE },
                { value: 'PLAT', label: CATEGORY_LABELS.PLAT },
                { value: 'DESSERT', label: CATEGORY_LABELS.DESSERT },
                { value: 'SAUCE', label: CATEGORY_LABELS.SAUCE },
                { value: 'APERO', label: CATEGORY_LABELS.APERO },
              ]}
            />
            <Select
              value={minRating ?? 'ALL'}
              onChange={(value) => {
                setPage(1);
                setMinRating(value === 'ALL' ? undefined : Number(value));
              }}
              options={[
                { value: 'ALL', label: 'Toutes les notes' },
                { value: 5, label: '5 étoiles' },
                { value: 4, label: '4 étoiles +' },
                { value: 3, label: '3 étoiles +' },
                { value: 2, label: '2 étoiles +' },
                { value: 1, label: '1 étoile +' },
              ]}
            />
            <Select
              value={sort}
              onChange={(value) => {
                setPage(1);
                setSort(value);
              }}
              options={[
                { value: 'NAME_ASC', label: 'Nom (A → Z)' },
                { value: 'NAME_DESC', label: 'Nom (Z → A)' },
                { value: 'RATING_DESC', label: 'Note élevée' },
                { value: 'RATING_ASC', label: 'Note faible' },
              ]}
            />
          </Space>

          {isPending ? (
            <div>Chargement...</div>
          ) : (
            <>
              <List
                dataSource={recipes}
                renderItem={(recipe) => {
                  const isSelected = selectedRecipeIds.has(recipe.id);
                  return (
                    <List.Item
                      actions={[
                        <Button
                          key="add"
                          type="primary"
                          onClick={() => handleAddRecipe(recipe)}
                          disabled={isSelected}
                        >
                          {isSelected ? 'Déjà ajoutée' : 'Ajouter'}
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={recipe.name}
                        description={
                          <Space>
                            <Tag>{CATEGORY_LABELS[recipe.category]}</Tag>
                            <Rate value={recipe.rating} disabled />
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />

              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                onChange={(nextPage) => setPage(nextPage)}
                onShowSizeChange={(_currentPage, nextPageSize) => {
                  setPage(1);
                  setPageSize(nextPageSize);
                }}
                style={{ marginTop: 16, textAlign: 'center' }}
              />
            </>
          )}
        </div>
      </Modal>

      {/* Assign Days Modal */}
      <Modal
        title={`Jours pour ${selectedRecipeForDays?.recipeName}`}
        open={!!selectedRecipeForDays}
        onCancel={() => {
          setSelectedRecipeForDays(null);
          setSelectedDays([]);
        }}
        onOk={handleSaveDays}
      >
        <p>Sélectionnez les jours où cette recette sera disponible (optionnel)</p>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Sélectionner des jours"
          value={selectedDays}
          onChange={setSelectedDays}
          options={listDates}
        />
      </Modal>
    </div>
  );
};
