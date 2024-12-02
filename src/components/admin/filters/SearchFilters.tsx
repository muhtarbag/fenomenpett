import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateFilter: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const SearchFilters = ({ 
  searchQuery, 
  onSearchChange,
  dateFilter,
  onDateChange
}: SearchFiltersProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Kullanıcı adı ile ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? (
              format(dateFilter, "d MMMM yyyy", { locale: tr })
            ) : (
              "Tarihe göre filtrele"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={dateFilter}
            onSelect={(date) => {
              onDateChange(date);
              setIsCalendarOpen(false);
            }}
            initialFocus
            locale={tr}
          />
          {dateFilter && (
            <div className="p-2 border-t border-gray-100">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  onDateChange(undefined);
                  setIsCalendarOpen(false);
                }}
              >
                Filtreyi Temizle
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};