import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import type { RecipeCategory } from '../../../stores/recipes/recipes.types';

interface RecipePageHeaderProps {
  searchInput: string;
  categoryFilter: 'ALL' | RecipeCategory;
  categoryLabels: Record<RecipeCategory, string>;
  onSearchChange: (value: string) => void;
  onSearchCommit: (value: string) => void;
  onCategoryChange: (value: 'ALL' | RecipeCategory) => void;
  onCreate: () => void;
}

export const RecipePageHeader = ({
  searchInput,
  categoryFilter,
  categoryLabels,
  onSearchChange,
  onSearchCommit,
  onCategoryChange,
  onCreate,
}: RecipePageHeaderProps) => {
  const debounceRef = useRef<number | undefined>(undefined);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed.length >= 3 || trimmed.length === 0) {
        onSearchCommit(trimmed.length >= 3 ? trimmed : '');
      }
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      const trimmed = searchInput.trim();
      onSearchCommit(trimmed.length >= 3 ? trimmed : '');
    }
  };

  return (
    <header className="flex flex-col sm:flex-row gap-3 md:gap-6 mb-6 md:mb-8 justify-between">
      <div className="flex flex-1 gap-3 md:gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="rounded-none border-gray-200 pl-10 focus:border-blue-500 focus-visible:ring-0 transition-colors"
            placeholder="Rechercher une recette"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value: 'ALL' | RecipeCategory) => onCategoryChange(value)}
        >
          <SelectTrigger className="w-[140px] md:w-[180px] rounded-none border-gray-200 focus:ring-0 transition-colors bg-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="ALL">Toutes les catégories</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onCreate}
        className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest font-light text-xs"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter une recette
      </Button>
    </header>
  );
};
