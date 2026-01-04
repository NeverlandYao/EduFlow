import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "选择选项...",
  searchPlaceholder = "搜索...",
  emptyText = "未找到结果",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setOpen(false)
    setInputValue("")
  }

  const handleCreateNew = () => {
    if (inputValue.trim() && !options.includes(inputValue.trim())) {
      onValueChange(inputValue.trim())
      setOpen(false)
      setInputValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-2">
                <p className="text-sm text-muted-foreground mb-2">{emptyText}</p>
                {inputValue.trim() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    创建 "{inputValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
            {inputValue.trim() && !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase()) && (
              <CommandGroup>
                <CommandItem onSelect={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建 "{inputValue}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
