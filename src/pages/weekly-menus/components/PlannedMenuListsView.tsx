import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ShoppingCart, Calendar as CalendarIcon, Utensils } from 'lucide-react';
import dayjs from 'dayjs';
import type { PlannedMenuList } from '../../../stores/planned-menus/planned-menus.types';
import { cn } from '@/lib/utils';

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
    <div className="p-4 md:p-8 min-h-full">
      <header className="flex justify-end mb-6 md:mb-8">
        <Button onClick={onCreateNew} className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest font-light text-xs">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle liste
        </Button>
      </header>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 bg-white">
          <Utensils className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-400 font-light text-sm uppercase tracking-widest mb-6">Aucune liste de menus planifiés</p>
          <Button onClick={onCreateNew} variant="outline" className="rounded-none uppercase tracking-widest font-light text-xs">
            Créer ma première liste
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {lists.map((list) => {
            const startDate = dayjs(list.startDate);
            const endDate = dayjs(list.endDate);
            const daysCount = endDate.diff(startDate, 'day');

            return (
              <Card 
                key={list.id} 
                className="rounded-none border-gray-200 shadow-none hover:border-blue-500 cursor-pointer transition-all group"
                onClick={() => onSelectList(list.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-extralight text-black uppercase m-0 group-hover:text-blue-500 transition-colors">
                      {list.name}
                    </CardTitle>
                    {list.isActiveShoppingList && (
                      <Badge className="rounded-none bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-50 text-[8px] uppercase tracking-widest font-light px-1.5 py-0">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-light uppercase tracking-widest">
                    <CalendarIcon className="w-3 h-3" />
                    {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="rounded-none border-gray-100 text-gray-400 font-light text-[8px] uppercase tracking-widest px-1.5 py-0">
                      {daysCount} jours
                    </Badge>
                    <Badge variant="outline" className="rounded-none border-gray-100 text-blue-500 font-light text-[8px] uppercase tracking-widest px-1.5 py-0 border-blue-50/50 bg-blue-50/20">
                      {list.recipes.length} recettes
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant={list.isActiveShoppingList ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1 rounded-none text-[8px] uppercase tracking-widest font-light",
                      list.isActiveShoppingList ? "bg-black text-white" : "border-gray-200 text-gray-400 hover:text-black"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleShoppingList(list.id, !list.isActiveShoppingList);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3 mr-2" />
                    {list.isActiveShoppingList ? 'Active' : 'Activer'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 rounded-none text-red-300 hover:text-red-500 hover:bg-red-50 text-[8px] uppercase tracking-widest font-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(list.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
