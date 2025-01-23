import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function UserSearch({ searchTerm, setSearchTerm }: UserSearchProps) {
  return (
    <div className="flex-1 flex items-center space-x-2">
      <Search className="text-gray-400" />
      <Input
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
