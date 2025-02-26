import React from 'react'
import { Input } from "@/components/ui/input";
import { Button } from './button';

const ProfessorInput = () => {
  return (
    <div>
      <div className="max-w-sm space-y-2">
      <Input placeholder="Professor Name" />
      <Input placeholder="Employee Code" />
      <Input placeholder="Subjects" />
      <Input placeholder="Labs" />
      <Input placeholder="Working Hours" />
      <Button>Submit</Button>
    </div>
    </div>
  );
}

export default ProfessorInput