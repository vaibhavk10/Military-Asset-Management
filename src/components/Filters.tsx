
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Filters as FilterType, EquipmentType } from '../types';
import { Calendar, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface FiltersProps {
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({ className }) => {
  const { bases, setFilters } = useData();
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({ from: new Date() });
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedType, setSelectedType] = useState<EquipmentType | "">("");
  const [isFiltersActive, setIsFiltersActive] = useState(false);

  const equipmentTypes: EquipmentType[] = [
    'Weapon', 'Vehicle', 'Ammunition', 'Communication', 'Medical'
  ];

  const handleApplyFilters = () => {
    const newFilters: FilterType = {};
    
    if (dateRange.from) {
      newFilters.date = {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd')
      };
    }
    
    if (selectedBase) {
      newFilters.baseId = selectedBase;
    }
    
    if (selectedType as EquipmentType) {
      newFilters.equipmentType = selectedType as EquipmentType;
    }
    
    setFilters(newFilters);
    setIsFiltersActive(Object.keys(newFilters).length > 0);
  };

  const handleClearFilters = () => {
    setDateRange({ from: new Date() });
    setSelectedBase("");
    setSelectedType("");
    setFilters({});
    setIsFiltersActive(false);
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {dateRange.from && dateRange.to ? (
              <>
                {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
              </>
            ) : dateRange.from ? (
              format(dateRange.from, "MMM dd, yyyy")
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => {
              if (range) setDateRange(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Base Filter */}
      <Select value={selectedBase} onValueChange={setSelectedBase}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select base" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Bases</SelectItem>
          {bases.map(base => (
            <SelectItem key={base.id} value={base.id}>{base.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Equipment Type Filter */}
      <Select value={selectedType} onValueChange={setSelectedType as (value: string) => void}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Equipment type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {equipmentTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <Button onClick={handleApplyFilters} className="bg-military-accent hover:bg-military-primary">
        <Filter className="h-4 w-4 mr-2" />
        Apply Filters
      </Button>
      
      {isFiltersActive && (
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default Filters;
