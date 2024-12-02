import { Search } from "lucide-react";
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
import { DateRange } from "react-day-picker";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  usernames?: string[];
}

export const SearchFilters = ({ 
  searchQuery, 
  onSearchChange,
  dateRange,
  onDateRangeChange,
  usernames = []
}: SearchFiltersProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal"
            >
              <Search className="mr-2 h-4 w-4" />
              {searchQuery || "Kullanıcı adı ara..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Kullanıcı adı girin..." 
                value={searchQuery}
                onValueChange={onSearchChange}
              />
              <CommandList>
                <CommandEmpty>Kullanıcı bulunamadı.</CommandEmpty>
                <CommandGroup heading="Önerilen Kullanıcılar">
                  {usernames
                    .filter(username => 
                      username.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map(username => (
                      <CommandItem
                        key={username}
                        value={username}
                        onSelect={(value) => {
                          onSearchChange(value);
                          setOpen(false);
                        }}
                      >
                        {username}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "d MMMM", { locale: tr })} -{" "}
                  {format(dateRange.to, "d MMMM yyyy", { locale: tr })}
                </>
              ) : (
                format(dateRange.from, "d MMMM yyyy", { locale: tr })
              )
            ) : (
              "Tarih aralığı seç"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange(range);
              if (range?.from && range?.to) {
                setIsCalendarOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={tr}
          />
          {dateRange && (
            <div className="p-2 border-t border-gray-100">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  onDateRangeChange(undefined);
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