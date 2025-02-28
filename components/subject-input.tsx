import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
const SubjectInput = () => {
  return (
    <div>
      <div className="space-y-2 max-w-sm">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Second Year</SelectItem>
            <SelectItem value="3">Third Year</SelectItem>
            <SelectItem value="4">Fourth Year</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select the Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
            <SelectItem value="IOT">IOT</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select the Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Subjects">Theory</SelectItem>
            <SelectItem value="Labs">Lab</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Enter the Hours" />

        <Input placeholder="Subject Name" />

        <Input placeholder="Enter the Subject Code" />

        <Input placeholder="Subject Type" />

        <Input placeholder=" Labs" />
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default SubjectInput;
